const d3 = require('d3');
// ts-ignore
const us = require('us');
const Polylabel = require('polylabel');
const GeojsonArea = require('@mapbox/geojson-area');
const rewind = require('geojson-rewind');
const states = require('../../data-input/homestead_states.json');

// const projection = d3.geoAlbersUsa()
//   .translate([512, 512])
//   .scale(1070/960 * 1024);
const projection = d3.geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale(1070 / 960 * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

// EPSG:3338 scaled at 1/4 the size of the continental US canvas
const alaskaAlbers = d3.geoConicEqualArea()
    .scale(1070 / 960 * 256)
    .parallels([55, 65])
    .rotate([154, 0])
    .translate([64, 640])
    .center([-2, 58.5]);

const alaskaPath = d3.geoPath(alaskaAlbers);

const calculateLabelPosition = (geojson) => {
    let labelCoords;
    let theCoords;
    if (geojson && geojson.coordinates) {
        // find the largest polygon
        let largest = 0;
        let iOfLargest = 0;
        if (geojson.type === 'MultiPolygon') {
            geojson.coordinates.forEach((coordinates, j) => {
                const area = GeojsonArea.geometry({ type: 'Polygon', coordinates });
                if (area > largest) {
                    iOfLargest = j;
                    largest = area;
                }
            });
            theCoords = geojson.coordinates[iOfLargest];
        } else if (geojson.type === 'Polygon') {
            theCoords = geojson.coordinates;
        }

        // calculate the point
        if (theCoords) {
            labelCoords = Polylabel(theCoords, 1);
            //labelCoords = [labelCoords[1], labelCoords[0]].map(c => Math.round(c * 100) / 100);
        }
    }
    return labelCoords;
};

const exclude = ['Connecticut', 'Delaware', 'District of Columbia', 'Georgia', 'Hawaii', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'New Hampshire', 'New Jersey', 'New York', 'North Carolina', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'Tennessee', 'Texas', 'Vermont', 'Virginia', 'West Virginia'];

function radiansToDegrees(radians) { return radians * 180 / Math.PI; }

const features = states.features
    .filter(f => !exclude.includes(f.properties.STATENAM))
    .map(f => {
        const detailedPath = (f.properties.STATENAM === 'Alaska') ? alaskaPath(rewind(f.geometry, true)) : path(rewind(f.geometry, true));
        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;

        const detailedLabelCoords = (f.properties.STATENAM === 'Alaska') ? alaskaAlbers(calculateLabelPosition(f.geometry)) : projection(calculateLabelPosition(f.geometry));
        const labelCoords = (detailedLabelCoords) ? detailedLabelCoords.map(c => Math.round(c * 100) / 100) : detailedLabelCoords;

        const detailedBounds = (f.properties.STATENAM === 'Alaska') ? alaskaPath.bounds(rewind(f.geometry, true)) : path.bounds(rewind(f.geometry, true));
        const bounds = (detailedBounds) ? detailedBounds.map(b => b.map(c => Math.round(c * 100) / 100)) : detailedBounds;

        const opposite = 512 - (bounds[0][0] + bounds[1][0]) / 2;
        const adjacent = (bounds[0][1] + bounds[1][1]) / 2 + 975.4066;
        const rotation = radiansToDegrees(Math.atan(opposite / adjacent)) * -1;

        const labelOpposite = 512 - labelCoords[0];
        const labelAdjacent = labelCoords[1] + 975.4066;
        const labelRotation = radiansToDegrees(Math.atan(labelOpposite / labelAdjacent)) * -1;
        return {
            abbr: (f.properties.STATENAM === 'Dakota') ? 'DK' : us.lookup(f.properties.STATENAM).abbr,
            name: f.properties.STATENAM,
            labelCoords,
            labelRotation,
            bounds,
            rotation,
            d,
        };
    });

console.log(JSON.stringify(features));