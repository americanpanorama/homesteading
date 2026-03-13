const fs = require('fs');
const d3 = require('d3');
const d3_composite = require("d3-composite-projections");
const rewind = require('geojson-rewind');
const States = require('../../../data/states.json');
const Illinois = require('../../data-input/IL_townships_mesh.json');
const Indiana = require('../../data-input/IN_townships_mesh.json');
const Ohio = require('../../data-input/OH_townships_mesh.json');
const Mississippi = require('../../data-input/MS_townships_mesh.json');
const Florida = require('../../data-input/FL_townships_mesh.json');
const TownshipData = require('../../data-input/townships_data.json');

const projection = d3.geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale(1070 / 960 * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

const ILfeatures = Illinois.features
    .map(f => {
        const detailedPath = path(f.geometry, true);
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        return d;
    });

const getStateData = (abbr) => States.find(s => s.abbr === abbr);

// find the data for each year
const ILYearsData = [];
const ILarea = 55593 * 640;
for (let year = 1863; year <= 1912; year++) {
    const ILyearData = TownshipData.find(td => td.office.slice(-2) === 'IL');
    if (ILyearData && ILyearData.claims_ac && ILyearData.claims_ac > 0) {
        ILYearsData.push({
            year,
            opacity: Math.round(100 * (0.1 + 0.9 * ILyearData.claims_ac * 100 / ILarea)) / 100,
        });
    }
}

fs.writeFileSync('../../../data/GLOs/IL.json', JSON.stringify({
    features: ILfeatures,
    yearData: ILYearsData,
    office: 'Springfield',
    labelRotation: getStateData('IL').labelRotation,
    labelCoords: getStateData('IL').labelCoords,
}));
console.log('wrote IL');

const INfeatures = Indiana.features
    .map(f => {
        const detailedPath = path(f.geometry, true);
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        return d;
    });

// find the data for each year
const INYearsData = [];
const INarea = 36418 * 640;
for (let year = 1863; year <= 1912; year++) {
    const INyearData = TownshipData.find(td => td.office.slice(-2) === 'IN');
    if (INyearData && INyearData.claims_ac && INyearData.claims_ac > 0) {
        INYearsData.push({
            year,
            opacity: Math.round(100 * (0.1 + 0.9 * INyearData.claims_ac * 100 / INarea)) / 100,
        });
    }
}

fs.writeFileSync('../../../data/GLOs/IN.json', JSON.stringify({
    features: INfeatures,
    yearData: INYearsData,
    office: 'Indianapolis',
    labelRotation: getStateData('IN').labelRotation,
    labelCoords: getStateData('IN').labelCoords,
}));
console.log('wrote IN');

const OHfeatures = Ohio.features
    .map(f => {
        const detailedPath = path(f.geometry, true);
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        return d;
    });

// find the data for each year
const OHYearsData = [];
const OHarea = 44825 * 640;
for (let year = 1863; year <= 1912; year++) {
    const OHyearData = TownshipData.find(td => td.office.slice(-2) === 'OH');
    if (OHyearData && OHyearData.claims_ac && OHyearData.claims_ac > 0) {
        OHYearsData.push({
            year,
            opacity: Math.round(100 * (0.1 + 0.9 * OHyearData.claims_ac * 100 / OHarea)) / 100,
        });
    }
}

fs.writeFileSync('../../../data/GLOs/OH.json', JSON.stringify({
    features: OHfeatures,
    yearData: OHYearsData,
    office: 'Chillicothe',
    labelRotation: getStateData('OH').labelRotation,
    labelCoords: getStateData('OH').labelCoords,
}));
console.log('wrote OH');

const MSfeatures = Mississippi.features
    .map(f => {
        const detailedPath = path(f.geometry, true);
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        return d;
    });

// find the data for each year
const MSYearsData = [];
const MSarea = 48430 * 640;
for (let year = 1863; year <= 1912; year++) {
    const MSyearData = TownshipData.find(td => td.office.slice(-2) === 'MS');
    if (MSyearData && MSyearData.claims_ac && MSyearData.claims_ac > 0) {
        MSYearsData.push({
            year,
            opacity: Math.round(100 * (0.1 + 0.9 * MSyearData.claims_ac * 100 / MSarea)) / 100,
        });
    }
}

fs.writeFileSync('../../../data/GLOs/MS.json', JSON.stringify({
    features: MSfeatures,
    yearData: MSYearsData,
    office: 'Jackson',
    labelRotation: getStateData('MS').labelRotation,
    labelCoords: getStateData('MS').labelCoords,
}));
console.log('wrote MS');

const FLfeatures = Florida.features
    .map(f => {
        const detailedPath = path(f.geometry, true);
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        return d;
    });

// find the data for each year
const FLYearsData = [];
const FLarea = 65758 * 640;
for (let year = 1863; year <= 1912; year++) {
    const FLyearData = TownshipData.find(td => td.office.slice(-2) === 'FL');
    if (FLyearData && FLyearData.claims_ac && FLyearData.claims_ac > 0) {
        FLYearsData.push({
            year,
            opacity: Math.round(100 * (0.1 + 0.9 * FLyearData.claims_ac * 100 / FLarea)) / 100,
        });
    }
}

fs.writeFileSync('../../../data/GLOs/FL.json', JSON.stringify({
    features: FLfeatures,
    yearData: FLYearsData,
    office: 'Tallahassee',
    labelRotation: getStateData('FL').labelRotation,
    labelCoords: getStateData('FL').labelCoords,
}));
console.log('wrote FL');