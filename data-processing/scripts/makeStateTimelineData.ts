import fs from 'fs';
// @ts-ignore: Unreachable code error
import us from '../../src/us.js';
import { 
  ConflictData,
  ProjectedTownship,
  TimelineYearPlaceData,
  TimelinePlaceData,
} from '../index.d';
import { overlapsWithFiscalYear2 } from '../functions.js';

const conflicts: ConflictData[] = JSON.parse(fs.readFileSync('../data-input/conflictsDataWithOffices.json', 'utf8'));

// `state`, of course, can refer to state or territory
const stateOfficeTimelineData: { [state: string]: TimelinePlaceData[]; } = {};
[...Array(50).keys()].map(d => d + 1863).forEach(year => {
  const townshipsData: ProjectedTownship[] = JSON.parse(fs.readFileSync(`../../build/data/yearData/${year}.json`, 'utf8')).offices;

  townshipsData.forEach((d: ProjectedTownship) => {
    // the `land_office` field either has the state as the last two characters, but there are some where there's a general land office for the whole state that will have the characters 'GLO' in the land_office
    const stateAbbr = d.state;
    stateOfficeTimelineData[stateAbbr] = stateOfficeTimelineData[stateAbbr] || [];
    const officeName = d.office.replace(`, ${stateAbbr}`, '');

    if (d.office_boundaries.length === 0 && (d.data[0].claims > 0 || d.data[0].patents > 0)) {
      console.error(`no boundaries for ${d.office} ${d.state} ${year}`);
    }

    const yearData: TimelineYearPlaceData = {
      year: year,
      ...d.data.find(_d => !_d.adjustedForMap),
      area: (d.office_boundaries[0]) ? d.office_boundaries[0].area : 1,
    };

    // find the existing land office if it exists
    const loIdx = stateOfficeTimelineData[stateAbbr].findIndex(d1 => d1.name === officeName);
    if (loIdx === -1) {
      stateOfficeTimelineData[stateAbbr].push({
        name: officeName,
        stateOrTerritory: stateAbbr.toString(),
        type: 'office',
        medianYearClaimsAcres: null,
        yearData: [yearData],
      });
    } else {
      stateOfficeTimelineData[stateAbbr][loIdx].yearData.push(yearData);
    }
  });
});

// add the conflicts data
conflicts.forEach(conflict => {
  const office = stateOfficeTimelineData[us.lookup(conflict.state).abbr].find(d => d.name === conflict.office);
  if (office) {
    // find the year data
    const yearData = office.yearData.find(yd => overlapsWithFiscalYear2(conflict.start_date, conflict.end_date, yd.year));
    if (yearData) {
      if (!yearData.conflicts) {
        yearData.conflicts = [];
      }
      yearData.conflicts.push({
        names: conflict.names,
        nations: conflict.nations,
        us_casualties: conflict.us_casualties,
        native_casualties: conflict.native_casualties,
        start_date: conflict.start_date,
        end_date: conflict.end_date,
        rotation: conflict.rotation,
      })
    }
  }
});

// edit each office data to calculate median year
Object.keys(stateOfficeTimelineData).forEach(stateAbbr => {
  const yearData: TimelineYearPlaceData[] = [];
  stateOfficeTimelineData[stateAbbr].forEach(lod => {
    const totalAcres: number = lod.yearData.reduce((acc: number, yd: TimelineYearPlaceData) => acc + yd.acres_claimed, 0);
    let count: number = 0; 
    for (let y = 1862; y < 1912 && count < totalAcres / 2; y++) {
      const aydIdx = lod.yearData.findIndex((lodyd: TimelineYearPlaceData) => lodyd.year === y);
      if (aydIdx !== -1) {
        count += lod.yearData[aydIdx].acres_claimed;
        lod.medianYearClaimsAcres = y;
      }
    }
  });
});

// write the state files
console.log('wrote national.json');
Object.keys(stateOfficeTimelineData).forEach(stateAbbr => {
  fs.writeFileSync(`../../build/data/timelineData/${stateAbbr}.json`, JSON.stringify(stateOfficeTimelineData[stateAbbr]));
  console.log(`wrote ${stateAbbr}.json`);
});

const statesTimelineData: TimelinePlaceData[] = [];
Object.keys(stateOfficeTimelineData).forEach(stateAbbr => {
  // calculate the total acres in the state
  const totalAcres: number = stateOfficeTimelineData[stateAbbr].reduce((acc: number, lod: TimelinePlaceData) => lod.yearData.reduce((acc: number, yd: TimelineYearPlaceData) => acc + yd.acres_claimed, 0) + acc, 0);
  let count: number = 0; 
  let medianYearClaimsAcres: number;
  for (let y = 1862; y < 1912 && count < totalAcres / 2; y++) {
    medianYearClaimsAcres = y;
    const totalForYear = stateOfficeTimelineData[stateAbbr]
      .reduce((acc: number, lod: TimelinePlaceData) => {
        const aydIdx = lod.yearData.findIndex((lodyd: TimelineYearPlaceData) => lodyd.year === y);
        if (aydIdx !== -1) {
          return lod.yearData[aydIdx].acres_claimed + acc;
        } else {
          return acc;
        }
      }, 0);
     count += totalForYear;
  }
  const yearData2: TimelineYearPlaceData[] = [];
  stateOfficeTimelineData[stateAbbr].forEach(lod => {
    lod.yearData.forEach(yd => {
      // is there data for the year
      const yIdx = yearData2.findIndex(loyd => loyd.year === yd.year);
      if (yIdx === -1) {
        yearData2.push(yd);
      } else {
        yearData2[yIdx].acres_claimed = yearData2[yIdx].acres_claimed + yd.acres_claimed;
        yearData2[yIdx].claims += yd.claims;
        yearData2[yIdx].acres_patented += yd.acres_patented;
        yearData2[yIdx].patents += yd.patents;
        yearData2[yIdx].acres_claimed_indian_lands += yd.acres_claimed_indian_lands;
        yearData2[yIdx].claims_indian_lands += yd.claims_indian_lands;
        yearData2[yIdx].acres_patented_indian_lands += yd.acres_patented_indian_lands;
        yearData2[yIdx].patents_indian_lands += yd.patents_indian_lands;
        yearData2[yIdx].acres_commuted_2301 += yd.acres_commuted_2301;
        yearData2[yIdx].commutations_2301 += yd.commutations_2301;
        yearData2[yIdx].acres_commuted_18800615 += yd.acres_commuted_18800615;
        yearData2[yIdx].commutations_18800615 += yd.commutations_18800615;
        yearData2[yIdx].acres_commuted_indian_lands += yd.acres_commuted_indian_lands;
        yearData2[yIdx].commutations_indian_lands += yd.commutations_indian_lands;
        yearData2[yIdx].area += yd.area;

        if (yd.conflicts) {
          if (!yearData2[yIdx].conflicts) {
            yearData2[yIdx].conflicts = yd.conflicts;
          } else {
            yearData2[yIdx].conflicts.push(...yd.conflicts);
          }
        }
      }
    });
  });

  statesTimelineData.push({
    name: us.lookup(stateAbbr).name,
    abbr: stateAbbr,
    type: 'stateOrTerritory',
    medianYearClaimsAcres,
    yearData: yearData2,
  });
});

// write the files
fs.writeFileSync('../../build/data/timelineData/national.json', JSON.stringify(statesTimelineData));
console.log('wrote national.json');
