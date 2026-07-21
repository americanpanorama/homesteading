/*
 * Core pipeline script that combines raw township data, township boundaries,
 * full-state GLO geometry, and clashes into yearly map data plus district files.
 *
 * Optional environment variables:
 * - YEAR_FILTER=1868,1902 limits generation to selected fiscal years
 * - BUILD_DATA_ROOT=/abs/path overrides ../../build/data
 * - PUBLIC_DATA_ROOT=/abs/path overrides ../../public/data
 * - CONFLICTS_OUTPUT_PATH=/abs/path overrides ../data-input/conflictsDataWithOffices.json
 * - DIAGNOSTICS_ROOT=/abs/path overrides the local script directory for helper outputs
 */
import fs from 'fs';
import path from 'path';
// @ts-ignore: Unreachable code error
import US from '../../src/us.js';
import turf from '@turf/turf';
import { Feature, Polygon } from '@turf/turf';
// @ts-ignore
import pointInSVGPOlygon from 'point-in-svg-polygon';
import {
  TownshipFeature,
  YMD,
  ConflictRaw,
  ConflictData,
  ProjectedTownship,
  TownshipData,
  ClaimsAndPatentsData,
  OfficeBoundary,
  District,
} from '../index.d';
import { parseDate, overlapsWithFiscalYear2, getTownshipFeaturesOnDate, getTownshipFeaturesForOffice, getStateAbbr, project, radiansToDegrees, getDateValue, makeJSONFileNames, albersProjection, getDataForYearFromTileID, getStandardizedOfficeName, getOfficeNameFromStub, normalizeDataNumber } from '../functions.js';
import { csvFormat } from 'd3-dsv';
import { start } from 'repl';

const requestedYears = new Set(
  (process.env.YEAR_FILTER || '')
    .split(',')
    .map(value => parseInt(value.trim(), 10))
    .filter(value => !Number.isNaN(value))
);
const shouldIncludeYear = (year: number) => requestedYears.size === 0 || requestedYears.has(year);
const buildDataRoot = process.env.BUILD_DATA_ROOT || path.resolve('../../build/data');
const publicDataRoot = process.env.PUBLIC_DATA_ROOT || path.resolve('../../public/data');
const diagnosticsRoot = process.env.DIAGNOSTICS_ROOT || path.resolve('.');
const conflictsOutputPath = process.env.CONFLICTS_OUTPUT_PATH || path.resolve('../data-input/conflictsDataWithOffices.json');

fs.mkdirSync(path.join(buildDataRoot, 'yearData'), { recursive: true });
fs.mkdirSync(path.join(buildDataRoot, 'districtsData'), { recursive: true });
fs.mkdirSync(path.join(publicDataRoot, 'yearData'), { recursive: true });

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../data-input/townshipssimplified.json', 'utf8'));
const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../data-input/townships_data.json', 'utf8'));
const AtLargeOffices: TownshipFeature[] = JSON.parse(fs.readFileSync('../data-input/GLOs.json', 'utf-8'));
const fullStateOffices: {[stateAbbr: string]: string} = {
  IN: 'Indianapolis',
  IL: 'Springfield',
  OH: 'Chillicothe',
  MS: 'Jackson',
}

const makeIntoTurfPolygons = (townshipFeature: TownshipFeature): Feature<Polygon>[] => {
  const polygons: Feature<Polygon>[] = [];
  const totalArea = turf.area(townshipFeature.geometry);
  if (townshipFeature.geometry.type === 'MultiPolygon') {
    (townshipFeature.geometry.coordinates as number[][][][]).forEach(coords => {
      const aPolygon = turf.polygon(coords);
      aPolygon.properties.proportion_area = turf.area(aPolygon) / totalArea;
      polygons.push(aPolygon);
    });
  } else {
    const thePolygon = turf.polygon(townshipFeature.geometry.coordinates as number[][][]);
    thePolygon.properties.proportion_area = 1;
    polygons.push(thePolygon);
  }
  return polygons;
}

const atLargeOfficeData: { [key: string]: OfficeBoundary } = {};
AtLargeOffices.forEach(glo => {
  atLargeOfficeData[US.lookup(glo.properties.STATENAM).abbr] = {
    ...project(glo),
    tile_id: null,
  }
});

const getFiscalYear = (year: number, month: number) => (month >= 7) ? year + 1 : year;

const projectedTownships: { [year: string]: ProjectedTownship[] } = {};

const dataWithoutTiles: { [year: string]: TownshipData[] } = {};

type MetricField = Exclude<keyof ClaimsAndPatentsData, 'adjustedForMap'>;

interface PendingMapAllocation {
  year: number;
  state: string;
  sourceOffice: string;
  sourceData: ClaimsAndPatentsData;
  sourceFeature: TownshipFeature;
}

interface MapAllocationDiagnostic {
  year: number;
  state: string;
  sourceOffice: string;
  recipients: { office: string; proportion: number }[];
  allocatedProportion: number;
  status: 'allocated' | 'unresolved';
}

interface MapConservationIssue {
  year: number;
  state: string;
  differences: Partial<Record<MetricField, number>>;
}

const metricFields: MetricField[] = [
  'claims',
  'acres_claimed',
  'claims_indian_lands',
  'acres_claimed_indian_lands',
  'patents',
  'acres_patented',
  'patents_indian_lands',
  'acres_patented_indian_lands',
  'commutations_2301',
  'acres_commuted_2301',
  'commutations_18800615',
  'acres_commuted_18800615',
  'commutations_indian_lands',
  'acres_commuted_indian_lands',
];

const pendingMapAllocations: PendingMapAllocation[] = [];
const mapAllocationDiagnostics: MapAllocationDiagnostic[] = [];

const normalizeOfficeName = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const getFeatureOfficeCandidates = (feature: TownshipFeature, stateAbbr: string): Set<string> => {
  const candidates = new Set<string>();
  const addCandidate = (name: string) => {
    if (name) {
      candidates.add(normalizeOfficeName(name));
    }
  };

  addCandidate(feature.properties.Office);
  makeJSONFileNames(feature).forEach(tileId => {
    const officeStub = tileId.split('-')[1];
    addCandidate(officeStub);
    addCandidate(getOfficeNameFromStub(officeStub, stateAbbr));
  });

  return candidates;
};

const getRawMetrics = (district: ProjectedTownship): ClaimsAndPatentsData => (
  district.data.find(datum => !datum.adjustedForMap) || district.data[0]
);

const getMapMetrics = (district: ProjectedTownship): ClaimsAndPatentsData => (
  district.data.find(datum => datum.adjustedForMap) || getRawMetrics(district)
);

const addMapAllocation = (
  district: ProjectedTownship,
  sourceData: ClaimsAndPatentsData,
  proportion: number,
) => {
  let adjustedData = district.data.find(datum => datum.adjustedForMap);
  if (!adjustedData) {
    adjustedData = {
      ...getRawMetrics(district),
      adjustedForMap: true,
    };
    district.data.push(adjustedData);
  }

  metricFields.forEach(field => {
    adjustedData[field] += sourceData[field] * proportion;
  });
};

// sort the township data into an object by year; this speeds the processing as it allows comparisons within a year--a considerably smaller set
console.log('sorting townshipsData by year')
const townshipsDataByYear: { [index: string]: TownshipData[] } = {};
TownshipsData.forEach(d => {
  projectedTownships[d.year.toString()] = [];
  townshipsDataByYear[d.year.toString()] = townshipsDataByYear[d.year.toString()] || [];
  // exclude AK districts prior to 1900 as they have no data
  if (!d.office.endsWith('AK') || d.year >= 1900) {
    townshipsDataByYear[d.year.toString()].push(d);
  }
});

const districtsWithoutData: {[stateAbbr: string]: string[]} = {
  NV: ['Belmont'],
  CA: ['Aurora'],
}

// initialize by going through all the districts that don't have data associated with them
Townships.features.forEach(township => {
  const tile_ids = makeJSONFileNames(township);
  tile_ids.forEach(tile_id => {
    const [stateAbbr, officeStub, startYearStr, endYearStr] = tile_id.split('-');
    const startYear = parseInt(startYearStr.substring(0, 4));
    const startMonth = parseInt(startYearStr.substring(4, 6));
    const endYear = Math.min(1912, parseInt(endYearStr.substring(0, 4)));
    const endMonth = parseInt(endYearStr.substring(4, 6));
    const startFiscalYear = Math.max(1863, (startMonth <= 6) ? startYear : startYear + 1);
    const endFiscalYear = Math.min(1912, (endMonth <= 6) ? endYear : endYear + 1);
    for (let y = startFiscalYear; y <= endFiscalYear; y++) {
      if (!shouldIncludeYear(y)) {
        continue;
      }
      // look for the data
      const officeDataForYear = getDataForYearFromTileID(tile_id, y);
      // if there isn't data, add it to the projectedTownship with all values as 0
      // there never is data for Aurora, CA, so it's an exception (Belmont NV is too)
      // excludes AK before 1900 as there is no data whatsoever
      // the same is true of Belmont
      // exclude DK after 1889
      if (!officeDataForYear && (stateAbbr !== 'AK' || y >= 1900) && (stateAbbr !== 'DK' || y < 1889) 
        && (getOfficeNameFromStub(officeStub, stateAbbr) !== '' || districtsWithoutData[stateAbbr].includes(officeStub)
      )) {
        const normalizedOfficeStub = officeStub.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idx = projectedTownships[y].findIndex(d => (
          d.office.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedOfficeStub
          && d.state === stateAbbr
        ));
        // find any piece of data regardless of year so you can get the office name and not the officeStub
        if (idx === -1) {
          projectedTownships[y].push({
            office: getOfficeNameFromStub(officeStub, stateAbbr) || officeStub,
            state: stateAbbr,
            data: [{
              claims: 0,
              acres_claimed: 0,
              claims_indian_lands: 0,
              acres_claimed_indian_lands: 0,
              patents: 0,
              acres_patented: 0,
              patents_indian_lands: 0,
              acres_patented_indian_lands: 0,
              commutations_2301: 0,
              acres_commuted_2301: 0,
              commutations_18800615: 0,
              acres_commuted_18800615: 0,
              commutations_indian_lands: 0,
              acres_commuted_indian_lands: 0,
              adjustedForMap: false,
            }],
            office_boundaries: [{
              ...project(township),
              tile_id,
            }]
          })
        } else {
          projectedTownships[y][idx].office_boundaries.push({
            ...project(township),
            tile_id
          });
        }
      }
    };
  });
});

Object.keys(townshipsDataByYear).forEach(yearStr => {
  if (!shouldIncludeYear(parseInt(yearStr, 10))) {
    return;
  }
  console.log(`creating projectedTownships for ${yearStr}`);
  townshipsDataByYear[yearStr]
    // sort so you're handling these in reverse chronological order; 
    // you need to do this so you that you have calculated values for later districts that you can add
    // to for districts that end before the fiscal year and thus aren't displayed on the map as a district
    .sort((a, b) => {
      const a_end = Townships.features
        .filter(d => US.lookup(d.properties.STATENAM).abbr === getStateAbbr(a.office) && a.office.includes(d.properties.Office))
        .reduce((end, curr) => Math.max(curr.properties.End, end), -9999999999999999999999);
      const b_end = Townships.features
        .filter(d => US.lookup(d.properties.STATENAM).abbr === getStateAbbr(b.office) && b.office.includes(d.properties.Office))
        .reduce((end, curr) => Math.max(curr.properties.End, end), -9999999999999999999999);
      return b_end - a_end;
    })
    .forEach((td) => {
      // the data
      const data: ClaimsAndPatentsData[] = [{
        claims: td.claims_num,
        acres_claimed: normalizeDataNumber(td.claims_ac),
        claims_indian_lands: td.claims_num_indian_lands,
        acres_claimed_indian_lands: normalizeDataNumber(td.claims_ac_indian_lands),
        patents: td.patents_num,
        acres_patented: normalizeDataNumber(td.patents_ac),
        patents_indian_lands: td.patents_num_indian_lands,
        acres_patented_indian_lands: normalizeDataNumber(td.patents_ac_indian_lands),
        commutations_2301: td.commutations_num_2301,
        acres_commuted_2301: normalizeDataNumber(td.commutations_ac_2301),
        commutations_18800615: td.commutations_num_18800615,
        acres_commuted_18800615: normalizeDataNumber(td.commutations_ac_18800615),
        commutations_indian_lands: td.commutations_num_indian_lands,
        acres_commuted_indian_lands: normalizeDataNumber(td.commutations_ac_indian_lands),
        adjustedForMap: false,
      }];

      // the state
      let stateAbbr = getStateAbbr(td.office, parseInt(yearStr));
      
      // create the office boundaries
      const office_boundaries: OfficeBoundary[] = (Object.keys(atLargeOfficeData).includes(stateAbbr))
      ? [atLargeOfficeData[stateAbbr]]
      : // get spatial data for the township
      getTownshipFeaturesForOffice(td)
          .map(d => {
            const tile_id = makeJSONFileNames(d)
              // sort them in reverse alphabetical order so the following find gets the last one chronologically
              .sort().reverse()
            // find for those tiles that overlap with the current fiscal year
              .find(_d => {
                let [stateAbbr, officeStub, startNumStr, endNumStr] = _d.split('-');
                let [startYear, startMonth, startDate] = [startNumStr.substr(0, 4), startNumStr.substr(4, 2), startNumStr.substr(6, 2)].map(__d => parseInt(__d));
                let [endYear, endMonth, endDate] = [endNumStr.substr(0, 4), endNumStr.substr(4, 2), endNumStr.substr(6, 2)].map(__d => parseInt(__d));
                const startValue = getDateValue(startYear, startMonth, startDate);
                const endValue = getDateValue(endYear, endMonth, endDate);
                const fiscalYearStart = getDateValue(td.year - 1, 7, 1);
                const fiscalYearEnd = getDateValue(td.year, 6, 30);
                return (startValue <= fiscalYearStart && endValue > fiscalYearStart) ||
                (startValue <= fiscalYearEnd && endValue >= fiscalYearStart) ||
                (startValue >= fiscalYearStart && endValue <= fiscalYearEnd);
              });
              if (!tile_id) {
                // dataWithoutTiles[yearStr] = dataWithoutTiles[yearStr] || [];
                // dataWithoutTiles[yearStr].push(td);
              }
              return {
                ...project(d),
                tile_id,
              }
            });
            
            if (office_boundaries.length === 0) {
              // only add it if there's data--at least Lamar, CO has no match for some years, but all the values in those years are empty
              if (td.claims_num + td.patents_num + td.commutations_num_18800615 + td.commutations_num_2301 + td.commutations_num_indian_lands > 0) {
                dataWithoutTiles[yearStr] = dataWithoutTiles[yearStr] || [];
                dataWithoutTiles[yearStr].push(td);
              }
            }
            
            // If a reporting office is no longer displayed at the end of the
            // fiscal year, defer its map allocation until every possible
            // successor office has been instantiated for this year.
            if (
              office_boundaries.length > 0
              && office_boundaries.every(boundary => boundary.tile_id && boundary.tile_id.slice(-8) < `${yearStr}0630`)
            ) {
              const sourceFeature = getTownshipFeaturesForOffice(td)
                .sort((a, b) => (b.properties.End || 0) - (a.properties.End || 0))[0];
              if (sourceFeature) {
                pendingMapAllocations.push({
                  year: td.year,
                  state: stateAbbr,
                  sourceOffice: td.office.slice(0, -4),
                  sourceData: data[0],
                  sourceFeature,
                });
              }
            }

        projectedTownships[yearStr].push({
          office: fullStateOffices[stateAbbr] || td.office.slice(0, -4),
          state: ((stateAbbr === 'ND' || stateAbbr === 'SD') && td.year < 1889) ? 'DK' : stateAbbr,
          data,
          office_boundaries,
        });
      });
});

// Apply closed-office totals only after all June 30 recipient districts have
// been instantiated. This makes redistribution independent of source-row
// ordering and ensures that all of a source office's activity is conserved.
pendingMapAllocations.forEach(allocation => {
  const yearStr = allocation.year.toString();
  const districtsForYear = projectedTownships[yearStr] || [];
  const recipientAreas = new Map<ProjectedTownship, number>();
  const sourcePolygons = makeIntoTurfPolygons(allocation.sourceFeature);

  getTownshipFeaturesOnDate(allocation.year, 6, 30, allocation.state).forEach(activeFeature => {
    const activeTileIds = new Set(makeJSONFileNames(activeFeature));
    const officeCandidates = getFeatureOfficeCandidates(activeFeature, allocation.state);
    const recipient = districtsForYear.find(district => (
      district.state === allocation.state
      && (
        officeCandidates.has(normalizeOfficeName(district.office))
        || district.office_boundaries.some(boundary => boundary.tile_id && activeTileIds.has(boundary.tile_id))
      )
    ));

    if (!recipient) {
      return;
    }

    let intersectionArea = 0;
    makeIntoTurfPolygons(activeFeature).forEach(activePolygon => {
      sourcePolygons.forEach(sourcePolygon => {
        const intersection = turf.intersect(sourcePolygon, activePolygon);
        if (intersection) {
          intersectionArea += turf.area(intersection);
        }
      });
    });

    if (intersectionArea > 0) {
      recipientAreas.set(recipient, (recipientAreas.get(recipient) || 0) + intersectionArea);
    }
  });

  const totalIntersectionArea = [...recipientAreas.values()]
    .reduce((total, area) => total + area, 0);

  if (totalIntersectionArea <= 0) {
    mapAllocationDiagnostics.push({
      year: allocation.year,
      state: allocation.state,
      sourceOffice: allocation.sourceOffice,
      recipients: [],
      allocatedProportion: 0,
      status: 'unresolved',
    });
    return;
  }

  const recipients = [...recipientAreas.entries()].map(([district, area]) => {
    const proportion = area / totalIntersectionArea;
    addMapAllocation(district, allocation.sourceData, proportion);
    return {
      office: district.office,
      proportion,
    };
  });

  mapAllocationDiagnostics.push({
    year: allocation.year,
    state: allocation.state,
    sourceOffice: allocation.sourceOffice,
    recipients,
    allocatedProportion: recipients.reduce((total, recipient) => total + recipient.proportion, 0),
    status: 'allocated',
  });
});

fs.writeFileSync(
  path.join(diagnosticsRoot, 'mapDataAllocations.json'),
  JSON.stringify(mapAllocationDiagnostics, null, 2),
);

const unresolvedAllocations = mapAllocationDiagnostics.filter(diagnostic => diagnostic.status === 'unresolved');
if (unresolvedAllocations.length > 0) {
  throw new Error(`Unable to allocate ${unresolvedAllocations.length} closed-office record(s) to June 30 districts.`);
}

// filter out districts when the state no longer has any claims in the future
Object.keys(projectedTownships).forEach(yearStr => {
  const year = parseInt(yearStr);
  projectedTownships[yearStr] = projectedTownships[yearStr].filter(d => {
    if (
      (d.state === 'AL' && year < 1865) ||
      (d.state === 'FL' && year < 1866) ||
      (d.state === 'AR' && year < 1866) ||
      (d.state === 'LA' && year < 1866) ||
      (d.state === 'MS' && year < 1866) ||
      (d.state === 'NV' && year < 1867) ||
      (d.state === 'ID' && year < 1868) ||
      (d.state === 'UT' && year < 1869) ||
      (d.state === 'MT' && year < 1869) ||
      (d.state === 'WY' && year < 1871) ||
      (d.state === 'AK' && year < 1900) ||
      (d.state === 'OH' && year > 1902) ||
      (d.state === 'IL' && year > 1905) ||
      (d.state === 'IN' && year > 1902) ||
      (d.state === 'IL' && year > 1905) ||
      (d.state === 'IA' && year > 1908) 
    ) {
      return false;
    }
    return true;
  });
});

// A map allocation may change office-level values, but it must never create or
// lose activity at the state-year level. Enforce that invariant before writing
// any generated output.
const mapConservationIssues: MapConservationIssue[] = [];
Object.keys(projectedTownships).forEach(yearStr => {
  const year = parseInt(yearStr, 10);
  if (!shouldIncludeYear(year)) {
    return;
  }

  const districts = projectedTownships[yearStr];
  const states = [...new Set(districts.map(district => district.state))];
  states.forEach(state => {
    const stateDistricts = districts.filter(district => district.state === state);
    const rawTotals = Object.fromEntries(metricFields.map(field => [field, 0])) as Record<MetricField, number>;
    const mapTotals = Object.fromEntries(metricFields.map(field => [field, 0])) as Record<MetricField, number>;

    stateDistricts.forEach(district => {
      const rawMetrics = getRawMetrics(district);
      metricFields.forEach(field => {
        rawTotals[field] += rawMetrics[field];
      });

      const isFullStateOffice = ['IL', 'IN', 'MS', 'OH'].includes(state);
      const hasJune30Boundary = isFullStateOffice || district.office_boundaries.some(boundary => (
        boundary.tile_id && boundary.tile_id.slice(-8) >= `${yearStr}0630`
      ));
      if (hasJune30Boundary) {
        const mapMetrics = getMapMetrics(district);
        metricFields.forEach(field => {
          mapTotals[field] += mapMetrics[field];
        });
      }
    });

    const differences: Partial<Record<MetricField, number>> = {};
    metricFields.forEach(field => {
      const difference = mapTotals[field] - rawTotals[field];
      if (Math.abs(difference) > 0.000001) {
        differences[field] = difference;
      }
    });

    if (Object.keys(differences).length > 0) {
      mapConservationIssues.push({ year, state, differences });
    }
  });
});

fs.writeFileSync(
  path.join(diagnosticsRoot, 'mapDataConservation.json'),
  JSON.stringify(mapConservationIssues, null, 2),
);

if (mapConservationIssues.length > 0) {
  throw new Error(`Map allocation failed state-level conservation for ${mapConservationIssues.length} state-year record(s).`);
}


// process the conflicts
console.log('creating conflicts data');
const Conflicts: ConflictRaw[] = JSON.parse(fs.readFileSync('../data-input/clashes_updated.json', 'utf8'));
const conflictsData: ConflictData[] = (Conflicts as ConflictRaw[])
  //filter out conflicts before or after our year range
  .filter((d: ConflictRaw) => projectedTownships[d.date_begin.substr(0, 4)])
  .map((d: ConflictRaw) => {
    // the date
    const startDate: YMD = {
      year: parseInt(d.date_begin.substr(0, 4)),
      month: parseInt(d.date_begin.substr(5, 2)),
      day: parseInt(d.date_begin.substr(8, 2)),
    }
    const endDate: YMD = {
      year: parseInt(d.date_end.substr(0, 4)),
      month: parseInt(d.date_end.substr(5, 2)),
      day: parseInt(d.date_end.substr(8, 2)),
    }

    // the state
    let stateTerr = US.lookup(d.state).abbr;
    if (stateTerr === 'ND' || stateTerr === 'SD' && startDate.year < 1889) {
      stateTerr = 'DK';
    }

    // project the location and calculate rotation
    const x = albersProjection([d.x, d.y])[0] as number;
    const y = albersProjection([d.x, d.y])[1] as number;
    const opposite = 512 - x;
    const adjacent = y + 975.4066;
    const rotation = radiansToDegrees(Math.atan(opposite / adjacent));

    // find the office where the conflict happened
    let office: string;
    const startDateFiscalYear = startDate.month >= 7 ? startDate.year + 1 : startDate.year;
    const candidates: ProjectedTownship[] = projectedTownships[startDateFiscalYear].filter(d1 => d1.state === stateTerr);
    candidates.forEach((candidate) => {
      candidate.office_boundaries.forEach(boundary => {
        if (pointInSVGPOlygon.isInside([x, y], boundary.d)) {
          office = candidate.office;
        }
      })
    });

    return {
      x,
      y,
      office,
      names: d.name_michno,
      state: stateTerr,
      nations: [d["nation 1"], d["nation 2"], d["nation 3"], d["nation 4"]].filter(d => d !== ''),
      us_casualties: d["us combatant casualties"] + d["us civilian casualties"],
      native_casualties: d["native casualties"],
      start_date: startDate,
      end_date: endDate,
      rotation,
    };
  });

// 
Object.keys(projectedTownships).forEach(year => {
  if (!shouldIncludeYear(parseInt(year, 10))) {
    return;
  }
  const yearData = {
    offices: projectedTownships[year],
    conflicts: conflictsData.filter(cd => {
      return overlapsWithFiscalYear2(cd.start_date, cd.end_date, parseInt(year));
    }),
  };

  fs.writeFileSync(path.join(buildDataRoot, 'yearData', `${year}.json`), JSON.stringify(yearData));
  fs.writeFileSync(path.join(publicDataRoot, 'yearData', `${year}.json`), JSON.stringify(yearData));
  fs.writeFileSync(conflictsOutputPath, JSON.stringify(conflictsData));
  console.log(`wrote ${year}.json projected`);
});

const officesWithoutTiles: { office: string; years: number[] }[] = [];
Object.keys(dataWithoutTiles).forEach(yearStr => {
  dataWithoutTiles[yearStr].forEach(districtData => {
    const idx = officesWithoutTiles.findIndex(d => d.office === districtData.office);
    if (idx === -1) {
      officesWithoutTiles.push({
        office: districtData.office,
        years: [parseInt(yearStr)],
      });
    } else {
      officesWithoutTiles[idx].years.push(parseInt(yearStr));
    }
  });
});

fs.writeFileSync(path.join(diagnosticsRoot, 'dataWithoutTiles.json'), JSON.stringify(officesWithoutTiles.sort((a, b) => b.years.length - a.years.length)));


const districts: District[] = [];
Townships.features
  .filter(tf => {
    let { startYear, startMonth, startDay, endYear, endMonth, endDay } = parseDate(tf.properties.Start, tf.properties.End);
    return getDateValue(endYear, endMonth, endDay) > 18620701 && getDateValue(startYear, startMonth, startDay) < 19120630;
  })
  .forEach(tf => {
    const { d } = project(tf);
    const stateAbbr = US.lookup(tf.properties.STATENAM).abbr;
    let { startYear, startMonth, startDay, endYear, endMonth, endDay } = parseDate(tf.properties.Start, tf.properties.End);
    if (getDateValue(startYear, startMonth, startDay) < 18620701) {
      startYear = 1862;
      startMonth = 7;
      startDay = 1;
    }
    if (getDateValue(endYear, endMonth, endDay) > 19120630) {
      endYear = 1912;
      endMonth = 6;
      endDay = 30;
    }

    const idx = districts.findIndex(d => d.office === tf.properties.Office.trim() && d.state === stateAbbr);
    if (idx === -1) {
      districts.push({
        office: getStandardizedOfficeName(tf.properties.Office.trim(), stateAbbr),
        state: stateAbbr,
        boundaries: [{
          d,
          start_date: {
            year: startYear,
            month: startMonth,
            day: startDay,
          },
          end_date: {
            year: endYear,
            month: endMonth,
            day: endDay,
          }
        }]
      })
    } else {
      districts[idx].boundaries.push({
        d,
        start_date: {
          year: startYear,
          month: startMonth,
          day: startDay,
        },
        end_date: {
          year: endYear,
          month: endMonth,
          day: endDay,
        }
      })
    }
  });

districts.forEach(district => {
  district.boundaries = district.boundaries.sort((a, b) => getDateValue(a.start_date.year, a.start_date.month, a.start_date.day) - getDateValue(b.start_date.year, b.start_date.month, b.start_date.day));
  const officeStub = district.office.replace(/[^a-zA-Z]/g, '');
  fs.writeFileSync(path.join(buildDataRoot, 'districtsData', `${officeStub}-${district.state}.json`), JSON.stringify(district));
});
