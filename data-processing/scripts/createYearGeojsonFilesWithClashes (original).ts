import fs from 'fs';
// @ts-ignore: Unreachable code error
import rewind from 'geojson-rewind';
// @ts-ignore: Unreachable code error
import getSVGBounds from 'svg-path-bounds';
// @ts-ignore: Unreachable code error
import st from 'geojson-bounds';
// @ts-ignore: Unreachable code error
import US from '../../src/us.js';
import turf from '@turf/turf';
import { Feature, Polygon } from '@turf/turf';
// @ts-ignore: Unreachable code error
import geojsonArea from '@mapbox/geojson-area';
// @ts-ignore
import pointInSVGPOlygon from 'point-in-svg-polygon';
import {
  MapDate,
  TownshipFeature,
  YMD,
  ConflictRaw,
  ConflictData,
  ProjectedTownship,
  TownshipFeatureOrganized,
  TownshipData,
  ClaimsAndPatentsData,
  OfficeBoundary
} from '../index.d';
import { parseDate, parseSingleDate, getFileNameForYear, getDateValue, makeJSONFileNames, albersPath, albersProjection, alaskaPath } from '../functions.js';
import { GeoPermissibleObjects } from 'd3-geo';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../data-input/townshipssimplified.json', 'utf8'));
const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../data-input/townships_data.json', 'utf8'));

const overlapsWithFiscalYear = (start: number, end: number, fiscalYear: number, debug = false): boolean => {
  const { year: startYear, month: startMonth, day: startDay } = parseSingleDate(start);
  const { year: endYear, month: endMonth, day: endDay } = parseSingleDate(end);
  const startValue = getDateValue(startYear, startMonth, startDay);
  const endValue = getDateValue(endYear, endMonth, endDay);
  const fiscalYearStart = getDateValue(fiscalYear - 1, 7, 1);
  const fiscalYearEnd = getDateValue(fiscalYear, 6, 30);
  return (startValue < fiscalYearStart && endValue > fiscalYearStart) ||
    (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
    (startValue > fiscalYearStart && endValue < fiscalYearEnd);
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

function radiansToDegrees(radians: number) { return radians * 180 / Math.PI; }

const AtLargeOffices = [
  {
    stateTerr: 'IL',
    area: 35579520,
    geometry: { type: "Polygon", coordinates: [[[-90.639984, 42.510065], [-88.788778, 42.493634], [-87.802929, 42.493634], [-87.83579, 42.301941], [-87.682436, 42.077386], [-87.523605, 41.710431], [-87.529082, 39.34987], [-87.63862, 39.169131], [-87.512651, 38.95553], [-87.49622, 38.780268], [-87.62219, 38.637868], [-87.655051, 38.506421], [-87.83579, 38.292821], [-87.950806, 38.27639], [-87.923421, 38.15042], [-88.000098, 38.101128], [-88.060345, 37.865619], [-88.027483, 37.799896], [-88.15893, 37.657496], [-88.065822, 37.482234], [-88.476592, 37.389126], [-88.514931, 37.285064], [-88.421823, 37.153617], [-88.547792, 37.071463], [-88.914747, 37.224817], [-89.029763, 37.213863], [-89.183118, 37.038601], [-89.133825, 36.983832], [-89.292656, 36.994786], [-89.517211, 37.279587], [-89.435057, 37.34531], [-89.517211, 37.537003], [-89.517211, 37.690357], [-89.84035, 37.903958], [-89.949889, 37.88205], [-90.059428, 38.013497], [-90.355183, 38.216144], [-90.349706, 38.374975], [-90.179921, 38.632391], [-90.207305, 38.725499], [-90.10872, 38.845992], [-90.251121, 38.917192], [-90.470199, 38.961007], [-90.585214, 38.867899], [-90.661891, 38.928146], [-90.727615, 39.256762], [-91.061708, 39.470363], [-91.368417, 39.727779], [-91.494386, 40.034488], [-91.50534, 40.237135], [-91.417709, 40.379535], [-91.401278, 40.560274], [-91.121954, 40.669813], [-91.09457, 40.823167], [-90.963123, 40.921752], [-90.946692, 41.097014], [-91.111001, 41.239415], [-91.045277, 41.414677], [-90.656414, 41.463969], [-90.344229, 41.589939], [-90.311367, 41.743293], [-90.179921, 41.809016], [-90.141582, 42.000709], [-90.168967, 42.126679], [-90.393521, 42.225264], [-90.420906, 42.329326], [-90.639984, 42.510065]]] },
  },
  {
    stateTerr: 'IN',
    area: 22955520,
    geometry: { type: "Polygon", coordinates: [[[-85.990061, 41.759724], [-84.807042, 41.759724], [-84.807042, 41.694001], [-84.801565, 40.500028], [-84.817996, 39.103408], [-84.894673, 39.059592], [-84.812519, 38.785745], [-84.987781, 38.780268], [-85.173997, 38.68716], [-85.431413, 38.730976], [-85.42046, 38.533806], [-85.590245, 38.451652], [-85.655968, 38.325682], [-85.83123, 38.27639], [-85.924338, 38.024451], [-86.039354, 37.958727], [-86.263908, 38.051835], [-86.302247, 38.166851], [-86.521325, 38.040881], [-86.504894, 37.931343], [-86.729448, 37.893004], [-86.795172, 37.991589], [-87.047111, 37.893004], [-87.129265, 37.788942], [-87.381204, 37.93682], [-87.512651, 37.903958], [-87.600282, 37.975158], [-87.682436, 37.903958], [-87.934375, 37.893004], [-88.027483, 37.799896], [-88.060345, 37.865619], [-88.000098, 38.101128], [-87.923421, 38.15042], [-87.950806, 38.27639], [-87.83579, 38.292821], [-87.655051, 38.506421], [-87.62219, 38.637868], [-87.49622, 38.780268], [-87.512651, 38.95553], [-87.63862, 39.169131], [-87.529082, 39.34987], [-87.523605, 41.710431], [-87.42502, 41.644708], [-87.118311, 41.644708], [-86.822556, 41.759724], [-85.990061, 41.759724]]] },
  },
  {
    stateTerr: 'OH',
    area: 26206720,
    geometry: { type: "Polygon", coordinates: [[[-80.518598, 41.978802], [-80.518598, 40.636951], [-80.666475, 40.582182], [-80.595275, 40.472643], [-80.600752, 40.319289], [-80.737675, 40.078303], [-80.830783, 39.711348], [-81.219646, 39.388209], [-81.345616, 39.344393], [-81.455155, 39.410117], [-81.57017, 39.267716], [-81.685186, 39.273193], [-81.811156, 39.0815], [-81.783771, 38.966484], [-81.887833, 38.873376], [-82.03571, 39.026731], [-82.221926, 38.785745], [-82.172634, 38.632391], [-82.293127, 38.577622], [-82.331465, 38.446175], [-82.594358, 38.424267], [-82.731282, 38.561191], [-82.846298, 38.588575], [-82.890113, 38.758361], [-83.032514, 38.725499], [-83.142052, 38.626914], [-83.519961, 38.703591], [-83.678792, 38.632391], [-83.903347, 38.769315], [-84.215533, 38.807653], [-84.231963, 38.895284], [-84.43461, 39.103408], [-84.817996, 39.103408], [-84.801565, 40.500028], [-84.807042, 41.694001], [-83.454238, 41.732339], [-83.065375, 41.595416], [-82.933929, 41.513262], [-82.835344, 41.589939], [-82.616266, 41.431108], [-82.479343, 41.381815], [-82.013803, 41.513262], [-81.739956, 41.485877], [-81.444201, 41.672093], [-81.011523, 41.852832], [-80.518598, 41.978802], [-80.518598, 41.978802]]] },
  },
  {
    stateTerr: 'MS',
    area: 30049280,
    geometry: { type: "Polygon", coordinates: [[[-88.471115, 34.995703], [-88.202745, 34.995703], [-88.098683, 34.891641], [-88.241084, 33.796253], [-88.471115, 31.895754], [-88.394438, 30.367688], [-88.503977, 30.323872], [-88.744962, 30.34578], [-88.843547, 30.411504], [-89.084533, 30.367688], [-89.418626, 30.252672], [-89.522688, 30.181472], [-89.643181, 30.285534], [-89.681519, 30.449842], [-89.845827, 30.66892], [-89.747242, 30.997536], [-91.636787, 30.997536], [-91.565587, 31.068736], [-91.636787, 31.265906], [-91.516294, 31.27686], [-91.499863, 31.643815], [-91.401278, 31.621907], [-91.341032, 31.846462], [-91.105524, 31.988862], [-90.985031, 32.218894], [-91.006939, 32.514649], [-91.154816, 32.640618], [-91.143862, 32.843265], [-91.072662, 32.887081], [-91.16577, 33.002096], [-91.089093, 33.13902], [-91.143862, 33.347144], [-91.056231, 33.429298], [-91.231493, 33.560744], [-91.072662, 33.867453], [-90.891923, 34.026284], [-90.952169, 34.135823], [-90.744046, 34.300131], [-90.749522, 34.365854], [-90.568783, 34.420624], [-90.585214, 34.617794], [-90.481152, 34.661609], [-90.409952, 34.831394], [-90.251121, 34.908072], [-90.311367, 34.995703], [-88.471115, 34.995703]]] },
  }
];

const atLargeOfficeData: { [key: string]: OfficeBoundary } = {};
AtLargeOffices.forEach(glo => {
  const projectedPath = albersPath(glo.geometry as GeoPermissibleObjects);
  const bounds = albersPath.bounds(glo.geometry as GeoPermissibleObjects);
  const [left, top, right, bottom] = getSVGBounds(projectedPath) as [number, number, number, number];
  // calculate the rotation
  const opposite = 512 - (right + left) / 2;
  const adjacent = (top + bottom) / 2 + 975.4066;
  const rotation = radiansToDegrees(Math.atan(opposite / adjacent)) * -1;
  atLargeOfficeData[glo.stateTerr] = {
    d: (projectedPath as string).replace(/(\d+\.\d\d\d)\d*/g, ($0: string, $1: number) => (Math.round($1 * 100) / 100).toString()),
    tile_id: null,
    bounds,
    rotation,
    area: geojsonArea.geometry(glo.geometry) / 4046.85642,
  }
});

const projectedTownships: { [year: string]: ProjectedTownship[] } = {};

const getFiscalYear = (year: number, month: number) => (month >= 7) ? year + 1 : year;




const getStateAbbr = (officeName: string): string => {
  let stateAbbr = (!officeName.includes('GLO'))
    ? officeName.substring(officeName.length - 2)
    : US.lookup(officeName.replace('GLO', '')).abbr;
  return stateAbbr;
}

const getTownshipFeaturesForOffice = (townshipData: TownshipData): TownshipFeature[] => {
  return Townships.features
    .filter(d => US.lookup(d.properties.STATENAM).abbr === getStateAbbr(townshipData.office)
      && townshipData.office.includes(d.properties.Office)
      && overlapsWithFiscalYear(d.properties.Start, d.properties.End, townshipData.year));
}

// gets the end of fiscal year features for given state/territory and year
const getTownshipFeaturesOnDate = (year: number, month: number, day: number, stateTerr?: string): TownshipFeature[] => {
  return Townships.features
    .filter(d => {
      const { year: startYear, month: startMonth, day: startDay } = parseSingleDate(d.properties.Start);
      const { year: endYear, month: endMonth, day: endDay } = parseSingleDate(d.properties.End);
      const dateValue = getDateValue(year, month, day);
      const startDateValue = getDateValue(startYear, startMonth, startDay);
      const endDateValue = getDateValue(endYear, endMonth, endDay);
      return (!stateTerr || US.lookup(d.properties.STATENAM).abbr === stateTerr)
        && dateValue >= startDateValue && dateValue <= endDateValue;
    });
}

// sort the township data into an object by year; this speeds the processing as it allows comparisons within a year--a considerably smaller set
console.log('sortying townshipsData by year')
const townshipsDataByYear: { [index: string]: TownshipData[] } = {};
TownshipsData.forEach(d => {
  projectedTownships[d.year.toString()] = [];
  townshipsDataByYear[d.year.toString()] = townshipsDataByYear[d.year.toString()] || [];
  townshipsDataByYear[d.year.toString()].push(d);
});

Object.keys(townshipsDataByYear).forEach(yearStr => {
  console.log(`creating projectedTownships for ${yearStr}`);
  townshipsDataByYear[yearStr]
    // sort so you're handling these in reverse chronological order; you need to do this so you that you have calculated values for later districts that you can add to for districts that end before the fiscal year and thus aren't displayed on the map as a district
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
        acres_claimed: td.claims_ac,
        claims_indian_lands: td.claims_num_indian_lands,
        acres_claimed_indian_lands: td.claims_ac_indian_lands,
        patents: td.patents_num,
        acres_patented: td.patents_ac,
        patents_indian_lands: td.patents_num_indian_lands,
        acres_patented_indian_lands: td.patents_ac_indian_lands,
        commutations_2301: td.commutations_num_2301,
        acres_commuted_2301: td.commutations_ac_2301,
        commutations_18800615: td.commutations_num_18800615,
        acres_commuted_18800615: td.commutations_ac_18800615,
        commutations_indian_lands: td.commutations_num_indian_lands,
        acres_commuted_indian_lands: td.commutations_ac_indian_lands,
        adjustedForMap: false,
      }];

      // the state
      let stateAbbr = getStateAbbr(td.office);

      // create the office boundaries
      const office_boundaries: OfficeBoundary[] = (Object.keys(atLargeOfficeData).includes(stateAbbr))
        ? [atLargeOfficeData[stateAbbr]]
        : // get spatial data for the township
        getTownshipFeaturesForOffice(td)
          .map(d => {
            // if (stateAbbr === 'FL') {
            //   console.log(d, makeJSONFileNames(d));
            // }
            const tile_id = makeJSONFileNames(d)
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
                  (startValue < fiscalYearEnd && endValue >= fiscalYearEnd) ||
                  (startValue >= fiscalYearStart && endValue <= fiscalYearEnd);
              });
            if (!tile_id) {
              console.log(td, d, makeJSONFileNames(d), parseSingleDate(d.properties.Start), parseSingleDate(d.properties.End));
              makeJSONFileNames(d)
                // find for those tiles that overlap with the current fiscal year
                .forEach(_d => {
                  let [stateAbbr, officeStub, startNumStr, endNumStr] = _d.split('-');
                  let [startYear, startMonth, startDate] = [startNumStr.substr(0, 4), startNumStr.substr(4, 2), startNumStr.substr(6, 2)].map(__d => parseInt(__d));
                  let [endYear, endMonth, endDate] = [endNumStr.substr(0, 4), endNumStr.substr(4, 2), endNumStr.substr(6, 2)].map(__d => parseInt(__d));
                  const startValue = getDateValue(startYear, startMonth, startDate);
                  const endValue = getDateValue(endYear, endMonth, endDate);
                  const fiscalYearStart = getDateValue(td.year - 1, 7, 1);
                  const fiscalYearEnd = getDateValue(td.year, 6, 30);
                  console.log(startValue, endValue, fiscalYearStart, fiscalYearEnd);
                  console.log((startValue < fiscalYearStart && endValue > fiscalYearStart) ||
                    (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
                    (startValue > fiscalYearStart && endValue < fiscalYearEnd));
                });
            }

            const projectedPath = (d.properties.STATENAM !== 'Alaska') ? albersPath(rewind(d.geometry, true)) : alaskaPath(rewind(d.geometry, true));
            const bounds = (d.properties.STATENAM !== 'Alaska') ? albersPath.bounds(rewind(d.geometry, true)) : alaskaPath.bounds(rewind(d.geometry, true));
            const [left, top, right, bottom] = getSVGBounds(projectedPath) as [number, number, number, number];
            // calculate the rotation
            const opposite = 512 - (right + left) / 2;
            const adjacent = (top + bottom) / 2 + 975.4066;
            const rotation = radiansToDegrees(Math.atan(opposite / adjacent)) * -1;
            return {
              d: (projectedPath as string).replace(/(\d+\.\d\d\d)\d*/g, ($0: string, $1: number) => (Math.round($1 * 100) / 100).toString()),
              tile_id,
              bounds,
              rotation,
              area: geojsonArea.geometry(d.geometry) / 4046.85642,
            }
          });


      if (office_boundaries.length > 0 && projectedTownships[yearStr].filter(x => x.office === td.office.slice(0, -4) && x.state === stateAbbr).length === 0) {
        // if the district ends before the fiscal year, you need to distribute it's data to other offices
        if (office_boundaries.every(_d => _d.tile_id && _d.tile_id.slice(-8) < `${yearStr}0630`)) {
          console.log(td.office, `${yearStr}0630`, office_boundaries.map(_d => _d.tile_id.slice(-8)));
          const townshipFeatures = getTownshipFeaturesForOffice(td);
          // if it's a multipolygon, you need to iterate through them one-by-one
          const totalArea = turf.area(townshipFeatures[0].geometry);
          const polygons = makeIntoTurfPolygons(townshipFeatures[0]);

          // if (townshipFeatures[0].properties.Office === 'Tallahassee') {
          //   console.log(polygons);
          // }


          // get the other polygons for the end of the fiscal year
          getTownshipFeaturesOnDate(td.year, 6, 30, stateAbbr).forEach(eofyFeature => {
            makeIntoTurfPolygons(eofyFeature).forEach(otherPolygon => {
              polygons.forEach(aPolygon => {
                const intersection = turf.intersect(aPolygon, otherPolygon);
                // if (td.office === 'Tallahassee') {
                //   console.log(aPolygon, otherPolygon);
                // }
                if (intersection) {
                  const areaOfIntersection = turf.area(intersection);
                  const proportionToAttribute = areaOfIntersection / (turf.area(aPolygon) / totalArea);
                  // get the matching office
                  const districtToAdjust = projectedTownships[yearStr].find(_d => _d.state === stateAbbr && _d.office === eofyFeature.properties.Office);
                  // add an adjusted for map array to data if it doesn't already exist
                  if (districtToAdjust) {

                    const idx = districtToAdjust.data.findIndex(__d => __d.adjustedForMap === true);
                    if (idx === -1) {
                      districtToAdjust.data.push({
                        claims: districtToAdjust.data[0].claims + data[0].claims * proportionToAttribute,
                        acres_claimed: districtToAdjust.data[0].acres_claimed + data[0].acres_claimed * proportionToAttribute,
                        claims_indian_lands: districtToAdjust.data[0].claims_indian_lands + data[0].claims_indian_lands * proportionToAttribute,
                        acres_claimed_indian_lands: districtToAdjust.data[0].acres_claimed_indian_lands + data[0].acres_claimed_indian_lands * proportionToAttribute,
                        patents: districtToAdjust.data[0].patents + data[0].patents * proportionToAttribute,
                        acres_patented: districtToAdjust.data[0].acres_patented + data[0].acres_patented * proportionToAttribute,
                        patents_indian_lands: districtToAdjust.data[0].patents_indian_lands + data[0].patents_indian_lands * proportionToAttribute,
                        acres_patented_indian_lands: districtToAdjust.data[0].acres_patented_indian_lands + data[0].acres_patented_indian_lands * proportionToAttribute,
                        commutations_2301: districtToAdjust.data[0].commutations_2301 + data[0].commutations_2301 * proportionToAttribute,
                        acres_commuted_2301: districtToAdjust.data[0].acres_commuted_2301 + data[0].acres_commuted_2301 * proportionToAttribute,
                        commutations_18800615: districtToAdjust.data[0].acres_commuted_18800615 + data[0].acres_commuted_18800615 * proportionToAttribute,
                        acres_commuted_18800615: districtToAdjust.data[0].acres_commuted_18800615 + data[0].acres_commuted_18800615 * proportionToAttribute,
                        commutations_indian_lands: districtToAdjust.data[0].commutations_indian_lands + data[0].commutations_indian_lands * proportionToAttribute,
                        acres_commuted_indian_lands: districtToAdjust.data[0].acres_commuted_indian_lands + data[0].acres_commuted_indian_lands * proportionToAttribute,
                        adjustedForMap: true,
                      });
                    } else {
                      districtToAdjust.data[idx].claims += data[0].claims * proportionToAttribute;
                      districtToAdjust.data[idx].acres_claimed += data[0].acres_claimed * proportionToAttribute;
                      districtToAdjust.data[idx].claims_indian_lands += data[0].claims_indian_lands * proportionToAttribute;
                      districtToAdjust.data[idx].acres_claimed_indian_lands += data[0].acres_claimed_indian_lands * proportionToAttribute;
                      districtToAdjust.data[idx].patents += data[0].patents * proportionToAttribute;
                      districtToAdjust.data[idx].acres_patented += data[0].acres_patented * proportionToAttribute;
                      districtToAdjust.data[idx].patents_indian_lands += data[0].patents_indian_lands * proportionToAttribute;
                      districtToAdjust.data[idx].acres_patented_indian_lands += data[0].acres_patented_indian_lands * proportionToAttribute;
                      districtToAdjust.data[idx].commutations_2301 += data[0].commutations_2301 * proportionToAttribute;
                      districtToAdjust.data[idx].acres_commuted_2301 += data[0].acres_commuted_2301 * proportionToAttribute;
                      districtToAdjust.data[idx].commutations_18800615 += data[0].acres_commuted_18800615 * proportionToAttribute;
                      districtToAdjust.data[idx].acres_commuted_18800615 += data[0].acres_commuted_18800615 * proportionToAttribute;
                      districtToAdjust.data[idx].commutations_indian_lands += data[0].commutations_indian_lands * proportionToAttribute;
                      districtToAdjust.data[idx].acres_commuted_indian_lands += data[0].acres_commuted_indian_lands * proportionToAttribute;
                    }
                    if (td.office.includes('Tallahassee')) {
                      console.log(districtToAdjust.data, proportionToAttribute);
                    }
                  }

                }
              });
            });

          });



        }
        projectedTownships[yearStr].push({
          office: td.office.slice(0, -4),
          state: ((stateAbbr === 'ND' || stateAbbr === 'SD') && td.year < 1889) ? 'DK' : stateAbbr,
          data,
          office_boundaries,
        });
      }
    });
});

//console.log(JSON.stringify(projectedTownships['1878']));

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
  const yearData = {
    offices: projectedTownships[year],
    conflicts: conflictsData.filter(cd => cd.start_date.year === parseInt(year)),
  };

  fs.writeFileSync(`../../build/data/yearData/${year}.json`, JSON.stringify(yearData));
  fs.writeFileSync(`../../public/data/yearData/${year}.json`, JSON.stringify(yearData));
  fs.writeFileSync('../data-input/conflictsDataWithOffices.json', JSON.stringify(conflictsData));
  console.log(`wrote ${year}.json projected`);
});
