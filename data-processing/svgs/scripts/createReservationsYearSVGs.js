const d3 = require("d3");
// var dissolve = require('geojson-dissolve')
const turf = require("@turf/turf");
const st = require("geojson-bounds");
const rewind = require("geojson-rewind");
const reservations = require("../../data-input/reservationSimplified.json");

const projection = d3
    .geoConicEqualArea()
    .parallels([29.5, 45.5])
    .scale((1070 / 960) * 1024)
    .translate([512, 512])
    .rotate([96, 0])
    .center([0, 37.5]);
const path = d3.geoPath(projection);

const getDateValue = (year, month, day) => year * 10000 + month * 100 + day;

const overlapsWithFiscalYear = (start, end, fiscalYear) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth() + 1;
    const startDay = startDate.getUTCDate();
    const endYear = endDate.getUTCFullYear();
    const endMonth = endDate.getUTCMonth() + 1;
    const endDay = endDate.getUTCDate();
    const startValue = getDateValue(startYear, startMonth, startDay);
    const endValue = getDateValue(endYear, endMonth, endDay);
    const fiscalYearStart = getDateValue(fiscalYear - 1, 7, 1);
    const fiscalYearEnd = getDateValue(fiscalYear, 6, 30);
    return (
        (startValue < fiscalYearStart && endValue > fiscalYearStart) ||
        (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
        (startValue > fiscalYearStart && endValue < fiscalYearEnd)
    );
};

const fixIntersections = (polygon) => {
    const start = polygon[0][0];
    // look for that first coordinate amongst all of them and tweek it a bit to offset it to avoid duplicate vertice
    const adjustedCoordinates = polygon[0].map((coord, idx, self) => {
        // don't change the first of the last
        if (idx === 0 || idx === polygon[0].length - 1) {
            return coord;
        }
        // don't change it if it's the first instance within the array
        if (
            self.findIndex(
                (coord2) => coord2[0] === coord[0] && coord2[1] === coord[1]
            ) === idx
        ) {
            return coord;
        }
        // otherwise tweak it every so slightly
        return [coord[0] * 1.0000001, coord[1] * 0.9999];
    });
    return [adjustedCoordinates];
};

var options = { tolerance: 0.0001, highQuality: true };
for (let y = 1863; y <= 1863; y++) {
    const unceded = reservations.features.filter(
        (d) =>
        overlapsWithFiscalYear(
            d.properties.date_start,
            d.properties.date_end,
            y
        ) &&
        d.geometry &&
        d.properties.type === "unceded land"
    );
    //console.log(JSON.stringify(dissolve(...unceded)));
    const polygons = [];
    unceded.forEach((f) => {
        if (f.geometry.type === "Polygon") {
            f.geometry.coordinates = fixIntersections(f.geometry.coordinates);
            var kinks = turf.kinks(f.geometry);
            if (kinks.features.length) {
                turf
                    .unkinkPolygon(turf.cleanCoords(f.geometry))
                    .features.forEach((d) => {
                        polygons.push(d.geometry.coordinates);
                    });
            } else {
                polygons.push(f.geometry.coordinates);
            }
        } else if (f.geometry.type === "MultiPolygon") {
            f.geometry.coordinates.forEach((coordinates) => {
                const fixedPolygon = turf.polygon(fixIntersections(coordinates));
                var kinks = turf.kinks(fixedPolygon);
                if (kinks.features.length) {
                    turf
                        .unkinkPolygon(turf.cleanCoords(fixedPolygon))
                        .features.forEach((d) => {
                            console.log(turf.area(d));
                            polygons.push(d.geometry.coordinates);
                        });
                } else {
                    polygons.push(fixedPolygon.geometry.coordinates);
                }
            });
        }
    });

    const getSets = (polygons, sets) => {
        const setsCombined = [...sets];
        const set = [polygons[0]];
        // check to see if any of the sets overlap. If they do, merge them
        setsCombined.forEach((set, idx) => {
            if (idx !== sets.length - 1) {
                const dissolvedSet = turf.dissolve(
                    turf.featureCollection(set.map((d) => turf.polygon(d)))
                );
                setsCombined.slice(idx + 1).forEach((otherSet, idx2) => {
                    const otherDissolvedSet = turf.dissolve(
                        turf.featureCollection(otherSet.map((d) => turf.polygon(d)))
                    );

                    console.log(JSON.stringify(dissolvedSet));
                    console.log(JSON.stringify(otherDissolvedSet));

                    if (turf.intersect(dissolvedSet, otherDissolvedSet)) {
                        setsCombined[idx].push(...set, ...otherSet);
                        setsCombined.splice(idx + 1 + idx2);
                    }
                });
            }
        });

        const remainingPolygons = [];
        polygons.slice(1).forEach((candidatePolygon) => {
            if (
                set.some((polygon) =>
                    turf.intersect(turf.polygon(polygon), turf.polygon(candidatePolygon))
                )
            ) {
                set.push(candidatePolygon);
            } else {
                remainingPolygons.push(candidatePolygon);
            }
        });
        setsCombined.push(set);
        if (remainingPolygons.length > 0) {
            return getSets(remainingPolygons, setsCombined);
        } else {
            return setsCombined;
        }
    };

    // make sets of polygons that intersect with one another
    const intersectingSets = getSets(polygons, []);
    // const featureCollection = turf.featureCollection(
    //     sets[4].map((d) => turf.buffer(turf.polygon(d), 0.1))
    // );
    // console.log(JSON.stringify(turf.dissolve(featureCollection)));
    // let remainingPolygons = [...polygons];
    // polygons.forEach((polygon) => {
    //     const idx = intersectingSets.findIndex((polygons) =>
    //         polygons.some((aPolygon) =>
    //             turf.intersect(
    //                 turf.buffer(turf.polygon(polygon), 100),
    //                 turf.buffer(turf.polygon(aPolygon), 100)
    //             )
    //         )
    //     );
    //     if (idx === -1) {
    //         intersectingSets.push([polygon]);
    //     } else {
    //         intersectingSets[idx].push(polygon);
    //     }
    // });

    //console.log(intersectingSets.length);

    // const featureCollection = turf.featureCollection(
    //     intersectingSets[4].map((d) => turf.buffer(turf.polygon(d), 0.1))
    // );
    //console.log(JSON.stringify(turf.dissolve(featureCollection)));

    // dissolve each set
    const dissolved = intersectingSets.map((polygons, idx) => {
        const featureCollection = turf.featureCollection(
            polygons.map((d) => turf.buffer(turf.polygon(d), 1))
        );
        return turf.dissolve(featureCollection);
    });

    const mergedFeatures = [];
    dissolved.forEach((fc) => {
        fc.features.forEach((f) => {
            mergedFeatures.push(f);
        });
    });

    console.log(
        JSON.stringify(
            turf.truncate(turf.featureCollection([...mergedFeatures]), {
                precision: 2,
            })
        )
    );

    // var tfs = turf.featureCollection(polygons.map(d => turf.polygon(d)));

    // console.log(turf.dissolve(tfs));
}

// const features = reservations.features
//     .filter((f) => {
//         const endDate = new Date(f.properties.date_end);
//         return f.geometry && endDate.getUTCFullYear() > 1861;
//     })
//     .map((f) => {
//         const startDate = new Date(f.properties.date_start);
//         const endDate = new Date(f.properties.date_end);
//         if (f.geometry.type === "Polygon") {
//             f.geometry.coordinates[0] = path(f.geometry).includes("-") ?
//                 f.geometry.coordinates[0].reverse() :
//                 f.geometry.coordinates[0];
//         }
//         if (f.geometry.type === "MultiPolygon") {
//             f.geometry.coordinates = f.geometry.coordinates.map(
//                 (coordinates, idx) => {
//                     const polygon = {
//                         type: "Polygon",
//                         coordinates,
//                     };
//                     // if ((path(polygon).includes('-'))) {
//                     //     console.log(polygon);
//                     // }
//                     return path(polygon).includes("-") ? [coordinates[0].reverse()] :
//                         coordinates;
//                 }
//             );
//         }
//         const detailedPath = path(f.geometry);

//         const openYear = parseInt(f.properties.date_open.slice(0, 4));
//         const openMonth = parseInt(f.properties.date_open.slice(5, 7));
//         const openDay = parseInt(f.properties.date_open.slice(-2));

//         const d = detailedPath ?
//             detailedPath.replace(
//                 /(\d+\.\d\d\d)\d*/g,
//                 ($0, $1) => Math.round($1 * 100) / 100
//             ) :
//             detailedPath;
//         const reservationSVG = {
//             d,
//             startYear: startDate.getUTCFullYear(),
//             startMonth: startDate.getUTCMonth() + 1,
//             startDay: startDate.getUTCDate(),
//             endYear: endDate.getUTCFullYear(),
//             endMonth: endDate.getUTCMonth() + 1,
//             endDay: endDate.getUTCDate(),
//             type: f.properties.type,
//             id: f.properties.fid,
//             opened: endDate.getUTCFullYear() === openYear,
//         };
//         return reservationSVG;
//     });

//console.log(JSON.stringify(features));