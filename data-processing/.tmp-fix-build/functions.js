import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore: Unreachable code error
import US from '../src/us.js';
import d3 from 'd3-geo';
// @ts-ignore: Unreachable code error
import rewind from 'geojson-rewind';
// @ts-ignore: Unreachable code error
import getSVGBounds from 'svg-path-bounds';
// @ts-ignore: Unreachable code error
import geojsonArea from '@mapbox/geojson-area';
const dataProcessingDir = path.dirname(fileURLToPath(import.meta.url));
const MapDates = JSON.parse(fs.readFileSync(`${dataProcessingDir}/data-input/mapDates.json`, 'utf8'));
const officeMappings = JSON.parse(fs.readFileSync(`${dataProcessingDir}/data-input/officeMappings.json`, 'utf8'));
const Townships = JSON.parse(fs.readFileSync(`${dataProcessingDir}/data-input/townshipssimplified.json`, 'utf8'));
const TownshipsData = JSON.parse(fs.readFileSync(`${dataProcessingDir}/data-input/townships_data.json`, 'utf8'));
export const exceptions = {
    CO: {
        'Golden City': 'Golden',
        'GoldenCity': 'Golden',
    },
    ID: {
        'Boise City': 'Boise',
        'BoiseCity': 'Boise',
        'Boise': 'Boise City',
    },
    KS: {
        'Hays City': 'Hays',
        'HaysCity': 'Hays',
        'Hays': 'Hays City',
    },
    MN: {
        'Detroit': 'Detroit Lakes',
        'DetroitLakes': 'Detroit',
        'Detroit Lakes': 'Detroit',
    },
    NE: {
        'Omaha City': 'Omaha',
        'OmahaCity': 'Omaha',
        'Omaha': 'Omaha City',
    },
    NM: {
        'Ft. Sumner': 'Fort Sumner',
        'Ft.Sumner': 'Fort Sumner',
        'Fort Sumner': 'Ft. Sumner',
        'FortSumner': 'Ft. Sumner',
        'La Cruces': 'Las Cruces',
        'LaCruces': 'Las Cruces',
        'Las Cruces': 'La Cruces',
        'LasCruces': 'La Cruces',
    },
    UT: {
        'Beaver City': 'Beaver',
        'BeaverCity': 'Beaver',
    },
    WA: {
        'Spokane Falls': 'Spokane',
        'SpokaneFalls': 'Spokane',
        'Spokane': 'Spokane Falls',
    },
};
const onlyUnique = (value, index, self) => self.indexOf(value) === index;
export function radiansToDegrees(radians) { return radians * 180 / Math.PI; }
/**
 * Normalizes historical numeric fields that occasionally contain annotations
 * or locale punctuation in the raw source tables.
 *
 * Examples seen in the source data:
 * - `5729,66` -> `5729.66`
 * - `835.9?` -> `835.9`
 * - `151.873.06` -> `151873.06`
 * - `mislaid?` / `ponca` / `?` -> `0`
 */
export function normalizeDataNumber(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    if (typeof value !== 'string') {
        return 0;
    }
    let normalized = value.trim();
    if (!normalized) {
        return 0;
    }
    if (/^\d+,\d+$/.test(normalized)) {
        normalized = normalized.replace(',', '.');
    }
    normalized = normalized.replace(/\?/g, '');
    normalized = normalized.replace(/[^0-9.\-]/g, '');
    if (!normalized || normalized === '.' || normalized === '-' || normalized === '-.') {
        return 0;
    }
    const decimalParts = normalized.split('.');
    if (decimalParts.length > 2) {
        normalized = `${decimalParts.slice(0, -1).join('')}.${decimalParts[decimalParts.length - 1]}`;
    }
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}
export const parseDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return {
        startYear: startDate.getUTCFullYear(),
        startMonth: startDate.getUTCMonth() + 1,
        startDay: startDate.getUTCDate(),
        endYear: endDate.getUTCFullYear(),
        endMonth: endDate.getUTCMonth() + 1,
        endDay: endDate.getUTCDate(),
        endYearToUse: (endDate.getUTCMonth() + 1 === 12 && endDate.getUTCDate() === 31) ? endDate.getUTCFullYear() : endDate.getUTCFullYear() - 1,
    };
};
export const parseSingleDate = (utcValue) => {
    const date = new Date(utcValue);
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
};
export const getMapsToCut = (township) => {
    const { STATENAM, Office, map_n, Start, End } = township.properties;
    const stateAbbr = US.lookup(STATENAM).abbr;
    const { startYear, endYear, endYearToUse } = parseDate(Start, End);
    const mapsToCut = MapDates
        .filter(md => startYear <= 1912 && md.state === stateAbbr
        && ((startYear >= md.startYear && startYear < md.endYear)
            || (endYearToUse >= md.startYear && endYearToUse < md.endYear)
            || startYear < md.startYear && endYearToUse > md.endYear))
        .map(md => md.map_n.toString());
    return mapsToCut;
};
export const getDataForYearFromTileID = (tile_id, year) => {
    const [stateAbbr, officeStub, startYearStr, endYearStr] = tile_id.split('-');
    const officeName = (exceptions[stateAbbr] && exceptions[stateAbbr][officeStub]) ? exceptions[stateAbbr][officeStub] : officeStub;
    // if (officeStub.includes('Detroit')) {
    //   console.log(officeName, `${officeName.replace(/[^a-zA-Z]/g, '')}${stateAbbr}`.toLowerCase(), TownshipsData.find(td => {
    //     if (stateAbbr === 'DK') {
    //       return td.year === year && (td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName.replace(/[^a-zA-Z]/g, '')}ND`.toLowerCase() || td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName.replace(/[^a-zA-Z]/)}SD`.toLowerCase());
    //     }
    //     return td.year === year && td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName.replace(/[^a-zA-Z]/g, '')}${stateAbbr}`.toLowerCase()
    //   }));
    // };
    return TownshipsData.find(td => {
        if (stateAbbr === 'DK') {
            return td.year === year && (td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName}ND`.toLowerCase().replace(/[^a-zA-Z]/g, '') || td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName}SD`.toLowerCase().replace(/[^a-zA-Z]/g, ''));
        }
        return td.year === year && td.office.toLowerCase().replace(/[^a-zA-Z]/g, '') === `${officeName}${stateAbbr}`.toLowerCase().replace(/[^a-zA-Z]/g, '');
    });
};
export function getStandardizedOfficeName(name, state) {
    const abbr = US.lookup(state).abbr;
    return (exceptions[abbr] && exceptions[abbr][name]) ? exceptions[abbr][name] : name;
}
export function getTownshipFeaturesForOffice(townshipData) {
    // exceptions name in spatial data to name in  data
    return Townships.features
        .filter(d => {
        const spaceStateTerr = US.lookup(d.properties.STATENAM).abbr;
        const dataStateTerr = getStateAbbr(townshipData.office);
        const statesMatch = spaceStateTerr === dataStateTerr || spaceStateTerr === 'DK' && ['ND', 'SD'].includes(dataStateTerr);
        const spaceOffice = d.properties.Office.toLowerCase().replace(/[^a-zA-Z]/g, '');
        const spaceOfficeAdjusted = (exceptions[spaceStateTerr] && exceptions[spaceStateTerr][d.properties.Office])
            ? exceptions[spaceStateTerr][d.properties.Office].toLowerCase().replace(/[^a-zA-Z]/g, '')
            : d.properties.Office.toLowerCase().replace(/[^a-zA-Z]/g, '');
        const dataOffice = townshipData.office.toLowerCase().replace(/[^a-zA-Z]/g, '');
        const officesMatch = dataOffice.includes(spaceOffice) || dataOffice.includes(spaceOfficeAdjusted);
        // if (d.properties.Office.replace(/[^a-zA-Z]/g, '') === 'Marysville' && getStateAbbr(townshipData.office) === 'CA' && (
        //     (townshipData.office.includes(officeNameToMatch) || townshipData.office.includes(d.properties.Office.replace(/[^a-zA-Z]/g, '')))
        //     || overlapsWithFiscalYear(d.properties.Start, d.properties.End, townshipData.year)
        //   )) {
        //   console.log(
        //     US.lookup(d.properties.STATENAM).abbr,
        //     getStateAbbr(townshipData.office),
        //     townshipData.office, 
        //     officeNameToMatch,
        //     townshipData.office.includes(officeNameToMatch),
        //     overlapsWithFiscalYear(d.properties.Start, d.properties.End, townshipData.year)
        //   );
        // }
        return statesMatch && officesMatch && overlapsWithFiscalYear(d.properties.Start, d.properties.End, townshipData.year);
    });
}
export function overlapsWithFiscalYear(start, end, fiscalYear, debug = false) {
    const { year: startYear, month: startMonth, day: startDay } = parseSingleDate(start);
    const { year: endYear, month: endMonth, day: endDay } = parseSingleDate(end);
    const startValue = getDateValue(startYear, startMonth, startDay);
    const endValue = getDateValue(endYear, endMonth, endDay);
    const fiscalYearStart = getDateValue(fiscalYear - 1, 7, 1);
    const fiscalYearEnd = getDateValue(fiscalYear, 6, 30);
    return (startValue <= fiscalYearStart && endValue >= fiscalYearStart) ||
        (startValue <= fiscalYearEnd && endValue >= fiscalYearEnd) ||
        (startValue >= fiscalYearStart && endValue <= fiscalYearEnd);
}
export function overlapsWithFiscalYear2(startYMD, endYMD, fiscalYear, debug = false) {
    const { year: startYear, month: startMonth, day: startDay } = startYMD;
    const { year: endYear, month: endMonth, day: endDay } = endYMD;
    const startValue = getDateValue(startYear, startMonth, startDay);
    const endValue = getDateValue(endYear, endMonth, endDay);
    const fiscalYearStart = getDateValue(fiscalYear - 1, 7, 1);
    const fiscalYearEnd = getDateValue(fiscalYear, 6, 30);
    return (startValue <= fiscalYearStart && endValue >= fiscalYearStart) ||
        (startValue <= fiscalYearEnd && endValue >= fiscalYearEnd) ||
        (startValue >= fiscalYearStart && endValue <= fiscalYearEnd);
}
// gets the end of fiscal year features for given state/territory and year
export function getTownshipFeaturesOnDate(year, month, day, stateTerr) {
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
export const makeJSONFileNames = (township) => {
    const { STATENAM: statenam, Office: office, Start: start, End: end } = township.properties;
    const { startYear, startMonth, startDay, endYear, endMonth, endDay, endYearToUse } = parseDate(start, end);
    const stateAbbr = (statenam.includes('Dakota') && endYear <= 1889) ? 'DK' : US.lookup(statenam).abbr;
    // look for overlaps. If the office start year is the same as the map end year, don't use it but use the next one. Same with the office endyear. If it matches the map start year, use the previous one.
    const mapsToCut = MapDates
        .filter(md => startYear <= 1912 && md.state === stateAbbr
        && (
        // start date is after the map's start date and before it's end
        (getDateValue(startYear, startMonth, startDay) >= getDateValue(md.startYear, 7, 1) &&
            getDateValue(startYear, startMonth, startDay) < getDateValue(md.endYear, 6, 30))
            ||
                // end date is after the map's start date and before it's end
                (getDateValue(endYear, endMonth, endDay) > getDateValue(md.startYear, 7, 1) &&
                    getDateValue(endYear, endMonth, endDay) <= getDateValue(md.endYear, 6, 30))
            ||
                // the start date is before the map's start date and it's end date is afer the maps end date 
                (getDateValue(startYear, startMonth, startDay) <= getDateValue(md.startYear, 7, 1) &&
                    getDateValue(endYear, endMonth, endDay) >= getDateValue(md.endYear, 6, 30))));
    return mapsToCut
        .filter(mapToCut => Math.max(18630101, getDateValue(mapToCut.startYear, 7, 1), startYear * 10000 + startMonth * 100 + startDay) <= 19130701)
        .map(mapToCut => {
        let officeStub = office.replace(/[^a-zA-Z]/g, '');
        let startNum = Math.max(18630101, getDateValue(((stateAbbr === 'MN' && mapToCut.map_n === 0) || (stateAbbr !== 'MN' && mapToCut.map_n === 1)) ? mapToCut.startYear - 10 : mapToCut.startYear, (mapToCut.map_n === 1) ? 1 : 7, 1), startYear * 10000 + startMonth * 100 + startDay);
        let endNum = Math.min(19121231, getDateValue(mapToCut.endYear, 6, 30), getDateValue(endYear, endMonth, endDay));
        // some exceptions/corrections for geoTiffFileNames
        if (officeStub.includes('Spokane')) {
            officeStub = 'Spokane';
        }
        const filenamePieces = [
            stateAbbr,
            officeStub,
            startNum.toString(),
            endNum.toString(),
        ];
        return filenamePieces.join('-');
    })
        .filter(d => {
        const [stateAbbr, officeStub, startNum, endNum] = d.split('-');
        return endNum > startNum;
    })
        // remove alaska before 1900
        .filter(d => {
        const [stateAbbr, officeStub, startNum, endNum] = d.split('-');
        return stateAbbr !== 'AK' || parseInt(endNum) > 19000000;
    })
        .filter(onlyUnique);
};
export const getDateValue = (year, month, day) => year * 10000 + month * 100 + day;
export const getFileNameForYear = (township, year) => {
    const possibleFileNames = makeJSONFileNames(township);
    let fileName;
    possibleFileNames.forEach(possibleFileName => {
        const [stateAbbr, office, startYear, endYear] = possibleFileName.split('-');
        if (year >= parseInt(startYear) && year < parseInt(endYear)) {
            fileName = possibleFileName;
        }
    });
    return fileName;
};
export const getMapPath = (fileName) => {
    const [stateAbbr, office, startNum, endNum] = fileName.split('-');
    const startYear = Math.floor(parseInt(startNum) / 10000);
    const endYear = Math.floor(parseInt(endNum) / 10000);
    // the mappings use the original short file name, which was just startyear-endyear, not yyyymmdd-yyymmdd.
    const shortenedFileName = [stateAbbr, office, startYear.toString(), endYear.toString()].join('-');
    if (endYear >= startYear) {
        const mapN = (fileName in officeMappings) ? officeMappings[fileName] // exceptions where it's better to use a different map from the next or a previous map than the current year
            : (shortenedFileName in officeMappings) ? officeMappings[shortenedFileName] // exceptions where it's better to use a different map from the next or a previous map than the current year
                : MapDates.find(md => md.state === stateAbbr && endYear >= md.startYear && startYear < md.endYear).map_n;
        return `${stateAbbr}_map${mapN}`;
    }
    else {
        return null;
    }
};
export const makeTileNames = (township) => {
    const { STATENAM: statenam, Office: office, Start: start, End: end } = township.properties;
    const stateAbbr = US.lookup(statenam).abbr;
    const { startYear, endYear, endYearToUse } = parseDate(start, end);
    const mapsToCut = getMapsToCut(township);
};
export const albersProjection = d3.geoConicEqualArea()
    .scale(1070 / 960 * 1024)
    .translate([512, 512])
    .parallels([29.5, 45.5])
    .rotate([96, 0])
    .center([0, 37.5]);
export const albersPath = d3.geoPath(albersProjection);
export const mercatorProjection = d3.geoMercator()
    .scale(1024 * 152.94790031131143 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 -- edit: the scale in the source code is 961 / tau, which is what this number is.
    //.scale(1024 * 152.788745368 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 
    .translate([1024 / 2, 1024 / 2]);
// EPSG:3338 scaled at 1/4 the size of the continental US canvas
const alaskaAlbersFunc = d3.geoConicEqualArea()
    .scale(1070 / 960 * 256)
    .parallels([55, 65])
    .rotate([154, 0])
    .center([-2, 58.5]);
const alaskaAlbersFunc2 = d3.geoConicEqualArea()
    .scale(1070 / 960 * 256)
    .parallels([55, 65])
    .rotate([154, 0])
    .center([-2, 58.5]);
export const alaskaProjection = alaskaAlbersFunc.translate([128, 128]);
// the path is offset to position it to the southwest of CA on the canvas
export const alaskaPath = d3.geoPath(alaskaAlbersFunc2.translate([64, 640]));
export const mercatorAlaskaProjection = d3.geoMercator()
    .scale(256 * 152.94790031131143 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 -- edit: the scale in the source code is 961 / tau, which is what this number is.
    //.scale(256 * 152.788745368 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 
    .translate([256 / 2, 256 / 2]);
export const project = (district) => {
    const projectedPath = (district.properties.STATENAM !== 'Alaska') ? albersPath(rewind(district.geometry, true)) : alaskaPath(rewind(district.geometry, true));
    const [left, top, right, bottom] = getSVGBounds(projectedPath);
    // calculate the rotation
    const opposite = 512 - (right + left) / 2;
    const adjacent = (top + bottom) / 2 + 975.4066;
    return {
        d: projectedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => (Math.round($1 * 100) / 100).toString()),
        bounds: (district.properties.STATENAM !== 'Alaska') ? albersPath.bounds(rewind(district.geometry, true)) : alaskaPath.bounds(rewind(district.geometry, true)),
        rotation: radiansToDegrees(Math.atan(opposite / adjacent)) * -1,
        area: geojsonArea.geometry(district.geometry) / 4046.85642
    };
};
// this finds the name used in the data from the stub
export const getOfficeNameFromStub = (stub, stateAbbr) => {
    const anyData = TownshipsData.find(td => td.office.trim().toLowerCase().slice(0, -4).replace(/[^a-zA-Z]/g, '') === stub.toLowerCase() && (td.office.slice(-2) === stateAbbr
        || (['DK', 'ND', 'SD'].includes(stateAbbr) && ['ND', 'SD'].includes(td.office.slice(-2)))));
    return (anyData) ? anyData.office.trim().slice(0, -4) : null;
};
export function getStateAbbr(officeName, year = null) {
    let stateAbbr = (!officeName.includes('GLO'))
        ? officeName.substring(officeName.length - 2)
        : US.lookup(officeName.replace('GLO', '')).abbr;
    if ((stateAbbr === 'SD' || stateAbbr === 'ND') && year && year < 1889) {
        stateAbbr = 'DK';
    }
    return stateAbbr;
}
