const fs = require("fs");
const d3 = require("d3");
const turf = require("@turf/turf");
const st = require("geojson-bounds");
const rewind = require("geojson-rewind");

const projection = d3
    .geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale((1070 / 960) * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

const geojsonDir = "../../data-input/Reservation_Year";

const yearGeojsonFiles = fs
    .readdirSync(geojsonDir)
    .filter((d) => d.includes("geojson"));

yearGeojsonFiles.forEach((filename) => {
    const year = filename.substr(4, 4);
    const geojson = JSON.parse(
        fs.readFileSync(`${geojsonDir}/${filename}`, "utf-8")
    );

    const polygons = [];
    geojson.features
        .filter(
            (f) =>
            f.properties.type === "reservation" ||
            f.properties.type === "unceded land" ||
            f.properties.type === 'open_res'
        )
        .forEach((f) => {
            if (f.geometry.type === "Polygon") {
                f.geometry.coordinates[0] = path(f.geometry).includes("-") ?
                    f.geometry.coordinates[0].reverse() :
                    f.geometry.coordinates[0];
            }
            if (f.geometry.type === "MultiPolygon") {
                f.geometry.coordinates = f.geometry.coordinates.map(
                    (coordinates, idx) => {
                        const polygon = {
                            type: "Polygon",
                            coordinates,
                        };
                        return path(polygon).includes("-") ? [coordinates[0].reverse()] :
                            coordinates;
                    }
                );
            }
            const detailedPath = path(f.geometry);
            const d = detailedPath ?
                detailedPath.replace(
                    /(\d+\.\d\d\d)\d*/g,
                    ($0, $1) => Math.round($1 * 100) / 100
                ) :
                detailedPath;
            const polygon = {
                d,
                type: f.properties.type,
            };
            if (f.properties.date_open) {
                // polygon.opened = {
                //     year: parseInt(f.properties.date_open.slice(0, 4)),
                //     month: parseInt(f.properties.date_open.slice(5, 7)),
                //     day: parseInt(f.properties.date_open.slice(-2)),
                // };
                const openDate = new Date(f.properties.date_open);
                polygon.opened = {
                    year: openDate.getUTCFullYear(),
                    month: openDate.getUTCMonth() + 1,
                    day: openDate.getUTCDate(),
                };
            }
            polygons.push(polygon);
        });
    fs.writeFileSync(
        `../../../build/data/indianLandsYearData/${year}.json`,
        JSON.stringify(polygons)
    );
    console.log(`wrote ${year}.json`);
});