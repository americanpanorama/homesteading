const d3 = require('d3');
const st = require('geojson-bounds');
const rewind = require('geojson-rewind');
const reservations = require('../../data-input/reservationSimplified.json');

const projection = d3.geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale(1070 / 960 * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

const features = reservations.features
    .filter(f => {
        const endDate = new Date(f.properties.date_end);
        return (f.geometry && endDate.getUTCFullYear() > 1861);
    })
    .map(f => {
        const startDate = new Date(f.properties.date_start);
        const endDate = new Date(f.properties.date_end);
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
        const detailedPath = path(f.geometry);

        const openYear = parseInt(f.properties.date_open.slice(0, 4));
        const openMonth = parseInt(f.properties.date_open.slice(5, 7));
        const openDay = parseInt(f.properties.date_open.slice(-2));

        const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0, $1) => Math.round($1 * 100) / 100) : detailedPath;
        const reservationSVG = {
            d,
            startYear: startDate.getUTCFullYear(),
            startMonth: startDate.getUTCMonth() + 1,
            startDay: startDate.getUTCDate(),
            endYear: endDate.getUTCFullYear(),
            endMonth: endDate.getUTCMonth() + 1,
            endDay: endDate.getUTCDate(),
            type: f.properties.type,
            id: f.properties.fid,
            opened: endDate.getUTCFullYear() === openYear,
        };
        return reservationSVG;
    });



console.log(JSON.stringify(features));