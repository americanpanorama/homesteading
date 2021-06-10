const fs = require('fs');
// @ts-ignore: Unreachable code error
const us = require('us');
// @ts-ignore: Unreachable code error
//import { TimelineYearPlaceData, TimelinePlaceData } from '../../src/index.d';
const TownshipsData = require('../data-input/townships_data_cleaned.json');
const Townships = require('../data-input/townshipsNormalizedFeatures.json');
const Conflicts = require('../data-input/conflictsDataWithOffices.json');


type PlaceType = 'office' | 'stateOrTerritory';

interface YMD {
  year: number;
  month: number;
  day: number;
}

interface ConflictData {
  x: number;
  y: number;
  names: string;
  office: string;
  state: string;
  nations: string[];
  us_casualties: number;
  native_casualties: number;
  start_date: YMD;
  end_date: YMD;
}

interface TimelineConflictData {
  names: string;
  nations: string[];
  us_casualties: number;
  native_casualties: number;
  start_date: YMD;
  end_date: YMD;
}

interface TimelineYearPlaceData {
  year: number;
  acres_claimed: number;
  claims: number;
  acres_patented: number;
  patents: number;
  area: number;
  conflicts?: TimelineConflictData[];
}

interface TimelinePlaceData {
  name: string;
  abbr?: string;
  stateOrTerritory?: string;
  type: PlaceType;
  medianYearClaimsAcres: number;
  yearData: TimelineYearPlaceData[];
}

interface TownshipData {
  office: string;
  state: string;
  claims: number;
  patents: number;
  acres_patented: number;
  acres_claimed: number;
  year: number;
  id: string;
}

interface TownshipFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    id: string;
    name: string;
    state: string;
    year: number;
    tile_id: string;
    map_id: number;
    claims: number;
    acres_claimed: number;
    patents: number;
    acres_patented: number;
    area: number;
  };
}

interface TownshipFeatures {
  [index: string]: TownshipFeature[];
}

console.log((Townships as TownshipFeatures)[1889].find((tfr) => tfr.properties.name.includes('Spok')));

// `state`, of course, can refer to state or territory
const stateOfficeTimelineData: { [state: string]: TimelinePlaceData[]; } = {};
(TownshipsData as TownshipData[]).forEach((d: TownshipData) => {
  // the `land_office` field either has the state as the last two characters, but there are some where there's a general land office for the whole state that will have the characters 'GLO' in the land_office
  const stateAbbr = d.state;
  stateOfficeTimelineData[stateAbbr] = stateOfficeTimelineData[stateAbbr] || [];

  const officeName = d.office.replace(`, ${stateAbbr}`, '');

  const geoJson: TownshipFeature | undefined = (Townships as TownshipFeatures)[d.year].find((tfr) => {
    // some exceptions
    // spokane falls should be read as spokane
    if (d.id === 'G5305') {
      return tfr.properties.id && (tfr.properties.id === 'G5305' || tfr.properties.id === 'G5310');
    }
    return tfr.properties.id && tfr.properties.id === d.id;
  });

  if (d.id === 'G5305') {
    console.log(geoJson);
  }

  const yearData: TimelineYearPlaceData = {
    year: d.year,
    acres_claimed: d.acres_claimed,
    acres_patented: d.acres_patented,
    claims: d.claims,
    patents: d.patents,
    area: (geoJson) ? geoJson.properties.area : 0,
  };

  // find the existing land office if it exists
  const loIdx = stateOfficeTimelineData[stateAbbr].findIndex(d1 => d1.name === officeName);
  if (loIdx === -1) {
    stateOfficeTimelineData[stateAbbr].push({
      name: officeName,
      stateOrTerritory: stateAbbr,
      type: 'office',
      medianYearClaimsAcres: null,
      yearData: [yearData],
    });
  } else {
    stateOfficeTimelineData[stateAbbr][loIdx].yearData.push(yearData);
  }


  // const stIdx = statesTimelineData.findIndex(std => std.abbr === stateAbbr);
  // if (stIdx === -1) {
  //   statesTimelineData.push({
  //     name: us.lookup(stateAbbr).name,
  //     abbr: stateAbbr,
  //     type: 'stateOrTerritory',
  //     yearData: [yearData],
  //   });
  // } else {
  //   statesTimelineData[stIdx].yearData.push(yearData);
  // }
});

// add the conflicts data
(Conflicts as ConflictData[]).forEach(conflict => {
  const office = stateOfficeTimelineData[us.lookup(conflict.state).abbr].find(d => d.name === conflict.office);
  if (office) {
    // find the year data
    const yearData = office.yearData.find(yd => yd.year === conflict.start_date.year);
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


// aggregate this data up to the state level
stateOfficeTimelineData.AL.forEach(office => {
  console.log(office.name);
  console.log(office.yearData.find(yd => yd.year === 1896));
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
        if (stateAbbr === 'AL' && yd.year === 1896) console.log(yd.acres_claimed);
        yearData2.push(yd);
      } else {
        if (stateAbbr === 'AL' && yd.year === 1896) console.log(yearData2[yIdx].acres_claimed, yd.acres_claimed);
        yearData2[yIdx].acres_claimed = yearData2[yIdx].acres_claimed + yd.acres_claimed;
        yearData2[yIdx].claims += yd.claims;
        yearData2[yIdx].acres_patented += yd.acres_patented;
        yearData2[yIdx].patents += yd.patents;
        yearData2[yIdx].area += yd.area;
        if (stateAbbr === 'AL' && yd.year === 1896) console.log(yearData2[yIdx].acres_claimed, yd.acres_claimed);

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


