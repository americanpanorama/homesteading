import fs from 'fs';
import { parseDate, overlapsWithFiscalYear2, getTownshipFeaturesOnDate, getTownshipFeaturesForOffice, getStateAbbr, project, radiansToDegrees, getDateValue, makeJSONFileNames, albersProjection, getDataForYearFromTileID, getStandardizedOfficeName, getOfficeNameFromStub } from '../functions.js';
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

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../data-input/townshipssimplified.json', 'utf8'));

const readable = Townships.features.map(d => {
  const { startYear, startMonth, startDay, endYear, endMonth, endDay } = parseDate(d.properties.Start, d.properties.End);
  return {
    office: d.properties.Office,
    state: d.properties.STATENAM,
    startUTC: d.properties.Start,
    endUTC: d.properties.End,
    start: {
      startYear,
      startMonth,
      startDay,
    },
    end: {
      endYear,
      endMonth,
      endDay,
    }
  }
});

fs.writeFileSync('./readableDistricts.json', JSON.stringify(readable));