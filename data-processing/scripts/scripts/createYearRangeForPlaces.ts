import fs from 'fs';
// @ts-ignore: Unreachable code error
import us from '../../src/us.js';
// @ts-ignore: Unreachable code error
import { MapDate, 
  TownshipFeature,
  YMD,
  ConflictRaw,
  ConflictData,
  ProjectedTownship,
  TownshipFeatureOrganized,
  TownshipData
} from '../index.d';
import { parseDate, getFileNameForYear, makeJSONFileNames, albersPath, albersProjection } from '../functions.js';


interface OfficeData {
    stub: string;
    firstYear: number;
    lastYear: number;
}

interface StateTerritoryData extends OfficeData {
    offices: OfficeData[];
}

const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../data-input/townships_data.json', 'utf8'));

const statesTerrsData: StateTerritoryData[] = [];

TownshipsData.forEach(d => {
    let stateAbbr = d.land_office.substr(-2);
    if (d.land_office.includes('GLO')) {
        stateAbbr = us.lookup(d.land_office.replace('GLO', '')).abbr;
    }
    if ((stateAbbr === 'ND' || stateAbbr === 'SD') && d.year < 1889) {
        stateAbbr = 'DK';
    }
    const idx = statesTerrsData.findIndex(d => d.stub === stateAbbr);
    const officeStub = d.land_office.substr(0, d.land_office.length - 4);
    if (idx === -1) {
        statesTerrsData.push({
            stub: stateAbbr,
            firstYear: d.year,
            lastYear: d.year,
            offices: [{
                stub: officeStub,
                firstYear: d.year,
                lastYear: d.year,
            }]
        });
    } else {
        if (d.year < statesTerrsData[idx].firstYear) {
            statesTerrsData[idx].firstYear = d.year;
        }
        if (d.year > statesTerrsData[idx].lastYear) {
            statesTerrsData[idx].lastYear = d.year;
        }

        const officeIdx = statesTerrsData[idx].offices.findIndex(d => d.stub === officeStub);
        if (officeIdx === -1) {
            statesTerrsData[idx].offices.push({
                stub: officeStub,
                firstYear: d.year,
                lastYear: d.year,
            });
        } else {
            if (d.year < statesTerrsData[idx].offices[officeIdx].firstYear) {
                statesTerrsData[idx].offices[officeIdx].firstYear = d.year;
            }
            if (d.year > statesTerrsData[idx].offices[officeIdx].lastYear) {
                statesTerrsData[idx].offices[officeIdx].lastYear = d.year;
            }
        }
    }
});

fs.writeFileSync("../../data/placesDateRanges.json", JSON.stringify(statesTerrsData));
