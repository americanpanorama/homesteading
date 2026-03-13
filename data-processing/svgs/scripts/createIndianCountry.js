const d3 = require('d3');
// ts-ignore
const rewind = require('geojson-rewind');
const IndianCountry = require('../../data-input/May_Reservations_Combined_simplified.json');

const projection = d3.geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale(1070 / 960 * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

IndianCountry.features.forEach(f => {
    if (f.geometry.type === 'Polygon') {
        f.geometry.coordinates[0] = (path(f.geometry).includes('-')) ? f.geometry.coordinates[0].reverse() : f.geometry.coordinates[0];
    }
    if (f.geometry.type === 'MultiPolygon') {
        f.geometry.coordinates = f.geometry.coordinates.map((coordinates, idx) => {
            const polygon = {
                type: 'Polygon',
                coordinates,
            };
            // if ((path(polygon).includes('-'))) {
            //     console.log(polygon);
            // }
            return (path(polygon).includes('-')) ? [coordinates[0].reverse()] : coordinates;
        });
    }
});

const d = path(IndianCountry).replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100);

console.log(d);