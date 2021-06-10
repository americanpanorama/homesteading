import * as fs from 'fs';
// @ts-ignore: Unreachable code error
import US from 'us';
import d3 from 'd3-geo';
import { MapDate, TownshipFeature, OfficeMappings } from './index.d';

const MapDates: MapDate[] = JSON.parse(fs.readFileSync('/Users/rnelson2/Documents/projects/Digital Atlas/panorama/homesteads/data-processing/data-input/mapDates.json', 'utf8'));
const officeMappings: OfficeMappings = JSON.parse(fs.readFileSync('/Users/rnelson2/Documents/projects/Digital Atlas/panorama/homesteads/data-processing/data-input/officeMappings.json', 'utf8'));


export const parseDate = (start: number, end: number) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return {
    startYear: startDate.getUTCFullYear(),
    endYear: endDate.getUTCFullYear(),
    endMonth: endDate.getUTCMonth() + 1,
    endDay: endDate.getUTCDate(),
    endYearToUse: (endDate.getUTCMonth() + 1 === 12 && endDate.getUTCDate() === 31) ? endDate.getUTCFullYear() : endDate.getUTCFullYear() - 1,
  };
} 

export const getMapsToCut = (township: TownshipFeature): string[] => {
  const { STATENAM, Office, map_n, Start, End } = township.properties;
  const stateAbbr = US.lookup(STATENAM).abbr;
  const { startYear, endYear, endYearToUse } = parseDate(Start, End);
  const mapsToCut = (MapDates as MapDate[])
    .filter(md => startYear <= 1912 && md.state === stateAbbr
      && ((startYear >= md.startYear && startYear < md.endYear)
      || (endYearToUse >= md.startYear && endYearToUse < md.endYear)
      || startYear < md.startYear && endYearToUse > md.endYear))
    .map(md => md.map_n.toString());
  return mapsToCut;
}

export const makeJSONFileNames = (township: TownshipFeature): string[] => {
  const { STATENAM: statenam, Office: office, Start: start, End: end } = township.properties;
  const stateAbbr = US.lookup(statenam).abbr;
  const { startYear, endYear, endYearToUse } = parseDate(start, end);
  // look for overlaps. If the office start year is the same as the map end year, don't use it but use the next one. Same with the office endyear. If it matches the map start year, use the previous one.
  const mapsToCut = (MapDates as MapDate[])
    .filter(md => startYear <= 1912 && md.state === stateAbbr
      && ((startYear >= md.startYear && startYear < md.endYear)
      || (endYear > md.startYear && endYear <= md.endYear)
      || startYear <= md.startYear && endYear >= md.endYear));
  //console.log(startYear, endYear, endYearToUse, mapsToCut);
  return mapsToCut
    .filter(mapToCut => Math.max(mapToCut.startYear, startYear) < Math.min(1912, mapToCut.endYear, endYear))
    .map(mapToCut => {
      let officeStub = office.replace(/[^a-zA-Z]/g, '');
      // some exceptions/corrections for geoTiffFileNames
      if (officeStub.includes('Spokane')) {
        officeStub = 'Spokane';
      }
      const filenamePieces = [
        stateAbbr,
        officeStub,
        Math.max(mapToCut.startYear, startYear).toString(),
        Math.min(1912, mapToCut.endYear, endYear).toString(),
      ];
      return filenamePieces.join('-');
    })
}

export const getFileNameForYear = (township: TownshipFeature, year: number) => {
  const possibleFileNames = makeJSONFileNames(township);
  let fileName: string;
  possibleFileNames.forEach(possibleFileName => {
    const [stateAbbr, office, startYear, endYear] = possibleFileName.split('-');
    if (year >= parseInt(startYear) && year < parseInt(endYear)) {
      fileName = possibleFileName;
    }
  });
  return fileName;
}

export const getMapPath = (fileName: string): string => {
  const [stateAbbr, office, startYear, endYear] = fileName.split('-');
  const mapN = (officeMappings as OfficeMappings)[fileName] || MapDates.find(md => md.state === stateAbbr && parseInt(endYear) >= md.startYear && parseInt(startYear) < md.endYear ).map_n;
  // exceptions where it's better to use a different map from the next or a previous map than the current year
  return `${stateAbbr}_map${mapN}`;
};

export const makeTileNames = (township: TownshipFeature) => {
  const { STATENAM: statenam, Office: office, Start: start, End: end } = township.properties;
  const stateAbbr = US.lookup(statenam).abbr;
  const { startYear, endYear, endYearToUse } = parseDate(start, end);
  const mapsToCut = getMapsToCut(township);
}

export const albersProjection = d3.geoConicEqualArea()
  .scale(1070/960 * 1024)
  .translate([512, 512])
  //.translate([512, 522.057])
  .parallels([29.5, 45.5])
  .rotate([96, 0])
  .center([0, 37.5]);

export const albersPath = d3.geoPath(albersProjection);

export const mercatorProjection = d3.geoMercator()
  .scale(1024 * 152.94790031131143 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 -- edit: the scale in the source code is 961 / tau, which is what this number is.
  //.scale(1024 * 152.788745368 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 
  .translate([1024 / 2, 1024 / 2]);

