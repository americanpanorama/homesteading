import fs from 'fs';
// @ts-ignore: Unreachable code error
import us from '../../src/us.js';
// @ts-ignore: Unreachable code error
import {
    MapDate,
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

TownshipsData
    .filter(d => d.land_office)
    .filter(d => {
        let stateAbbr = d.land_office.substr(-2);
        if (
            (d.state === 'AL' && d.year < 1865) ||
            (d.state === 'FL' && d.year < 1866) ||
            (d.state === 'AR' && d.year < 1866) ||
            (d.state === 'LA' && d.year < 1866) ||
            (d.state === 'MS' && d.year < 1866) ||
            (d.state === 'NV' && d.year < 1867) ||
            (d.state === 'ID' && d.year < 1868) ||
            (d.state === 'UT' && d.year < 1869) ||
            (d.state === 'MT' && d.year < 1869) ||
            (d.state === 'WY' && d.year < 1871) ||
            (d.state === 'AK' && d.year < 1900) ||
            (d.state === 'OH' && d.year > 1902) ||
            (d.state === 'IL' && d.year > 1905) ||
            (d.state === 'IN' && d.year > 1902) ||
            (d.state === 'IL' && d.year > 1905) ||
            (d.state === 'IA' && d.year > 1908)
        ) {
            return false;
        }
        return true;
    })
    .forEach(d => {
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
