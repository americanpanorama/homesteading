import fs from 'fs';
import d3 from 'd3-geo';
// @ts-ignore: Unreachable code error
import Polylabel from 'polylabel';
// @ts-ignore: Unreachable code error
import rewind from 'geojson-rewind';
// @ts-ignore: Unreachable code error
import getSVGBounds from 'svg-path-bounds';
// @ts-ignore: Unreachable code error
import st from 'geojson-bounds';
// @ts-ignore: Unreachable code error
import US from 'us';
import turf from '@turf/turf';
// @ts-ignore: Unreachable code error
import geojsonArea from '@mapbox/geojson-area';
import { MapDate, 
    TownshipFeature,
    YMD,
    ConflictRaw,
    ConflictData,
    ProjectedTownship,
    YearsData, 
    TownshipFeatureOrganized,
    TownshipData
  } from '../index.d';
import { parseDate, getFileNameForYear, makeJSONFileNames, albersPath, albersProjection } from '../functions.js';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../data-input/townshipssimplified.json', 'utf8'));
const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../data-input/townships_data.json', 'utf8'));
const MapDates: MapDate[] = JSON.parse(fs.readFileSync('../data-input/mapDates.json', 'utf8'));
const Conflicts: ConflictRaw[] = JSON.parse(fs.readFileSync('../data-input/clashes.json', 'utf8'));

function degreesToRadians(degrees: number) { return degrees * Math.PI / 180; }
function radiansToDegrees(radians: number) { return radians * 180 / Math.PI; }

const AtLargeOffices = [
  {
    stateTerr: 'IL',
    area: 35579520,
    geometry: {type: "Polygon", coordinates: [[[-90.639984, 42.510065 ], [-88.788778, 42.493634 ], [-87.802929, 42.493634 ], [-87.83579, 42.301941 ], [-87.682436, 42.077386 ], [-87.523605, 41.710431 ], [-87.529082, 39.34987 ], [-87.63862, 39.169131 ], [-87.512651, 38.95553 ], [-87.49622, 38.780268 ], [-87.62219, 38.637868 ], [-87.655051, 38.506421 ], [-87.83579, 38.292821 ], [-87.950806, 38.27639 ], [-87.923421, 38.15042 ], [-88.000098, 38.101128 ], [-88.060345, 37.865619 ], [-88.027483, 37.799896 ], [-88.15893, 37.657496 ], [-88.065822, 37.482234 ], [-88.476592, 37.389126 ], [-88.514931, 37.285064 ], [-88.421823, 37.153617 ], [-88.547792, 37.071463 ], [-88.914747, 37.224817 ], [-89.029763, 37.213863 ], [-89.183118, 37.038601 ], [-89.133825, 36.983832 ], [-89.292656, 36.994786 ], [-89.517211, 37.279587 ], [-89.435057, 37.34531 ], [-89.517211, 37.537003 ], [-89.517211, 37.690357 ], [-89.84035, 37.903958 ], [-89.949889, 37.88205 ], [-90.059428, 38.013497 ], [-90.355183, 38.216144 ], [-90.349706, 38.374975 ], [-90.179921, 38.632391 ], [-90.207305, 38.725499 ], [-90.10872, 38.845992 ], [-90.251121, 38.917192 ], [-90.470199, 38.961007 ], [-90.585214, 38.867899 ], [-90.661891, 38.928146 ], [-90.727615, 39.256762 ], [-91.061708, 39.470363 ], [-91.368417, 39.727779 ], [-91.494386, 40.034488 ], [-91.50534, 40.237135 ], [-91.417709, 40.379535 ], [-91.401278, 40.560274 ], [-91.121954, 40.669813 ], [-91.09457, 40.823167 ], [-90.963123, 40.921752 ], [-90.946692, 41.097014 ], [-91.111001, 41.239415 ], [-91.045277, 41.414677 ], [-90.656414, 41.463969 ], [-90.344229, 41.589939 ], [-90.311367, 41.743293 ], [-90.179921, 41.809016 ], [-90.141582, 42.000709 ], [-90.168967, 42.126679 ], [-90.393521, 42.225264 ], [-90.420906, 42.329326 ], [-90.639984, 42.510065 ] ] ] },
  },
  {
    stateTerr: 'IN',
    area: 22955520,
    geometry: {type: "Polygon", coordinates: [[[-85.990061, 41.759724 ], [-84.807042, 41.759724 ], [-84.807042, 41.694001 ], [-84.801565, 40.500028 ], [-84.817996, 39.103408 ], [-84.894673, 39.059592 ], [-84.812519, 38.785745 ], [-84.987781, 38.780268 ], [-85.173997, 38.68716 ], [-85.431413, 38.730976 ], [-85.42046, 38.533806 ], [-85.590245, 38.451652 ], [-85.655968, 38.325682 ], [-85.83123, 38.27639 ], [-85.924338, 38.024451 ], [-86.039354, 37.958727 ], [-86.263908, 38.051835 ], [-86.302247, 38.166851 ], [-86.521325, 38.040881 ], [-86.504894, 37.931343 ], [-86.729448, 37.893004 ], [-86.795172, 37.991589 ], [-87.047111, 37.893004 ], [-87.129265, 37.788942 ], [-87.381204, 37.93682 ], [-87.512651, 37.903958 ], [-87.600282, 37.975158 ], [-87.682436, 37.903958 ], [-87.934375, 37.893004 ], [-88.027483, 37.799896 ], [-88.060345, 37.865619 ], [-88.000098, 38.101128 ], [-87.923421, 38.15042 ], [-87.950806, 38.27639 ], [-87.83579, 38.292821 ], [-87.655051, 38.506421 ], [-87.62219, 38.637868 ], [-87.49622, 38.780268 ], [-87.512651, 38.95553 ], [-87.63862, 39.169131 ], [-87.529082, 39.34987 ], [-87.523605, 41.710431 ], [-87.42502, 41.644708 ], [-87.118311, 41.644708 ], [-86.822556, 41.759724 ], [-85.990061, 41.759724 ] ] ] },
  },
  {
    stateTerr: 'OH',
    area: 26206720,
    geometry: {type: "Polygon", coordinates: [[[-80.518598, 41.978802 ], [-80.518598, 40.636951 ], [-80.666475, 40.582182 ], [-80.595275, 40.472643 ], [-80.600752, 40.319289 ], [-80.737675, 40.078303 ], [-80.830783, 39.711348 ], [-81.219646, 39.388209 ], [-81.345616, 39.344393 ], [-81.455155, 39.410117 ], [-81.57017, 39.267716 ], [-81.685186, 39.273193 ], [-81.811156, 39.0815 ], [-81.783771, 38.966484 ], [-81.887833, 38.873376 ], [-82.03571, 39.026731 ], [-82.221926, 38.785745 ], [-82.172634, 38.632391 ], [-82.293127, 38.577622 ], [-82.331465, 38.446175 ], [-82.594358, 38.424267 ], [-82.731282, 38.561191 ], [-82.846298, 38.588575 ], [-82.890113, 38.758361 ], [-83.032514, 38.725499 ], [-83.142052, 38.626914 ], [-83.519961, 38.703591 ], [-83.678792, 38.632391 ], [-83.903347, 38.769315 ], [-84.215533, 38.807653 ], [-84.231963, 38.895284 ], [-84.43461, 39.103408 ], [-84.817996, 39.103408 ], [-84.801565, 40.500028 ], [-84.807042, 41.694001 ], [-83.454238, 41.732339 ], [-83.065375, 41.595416 ], [-82.933929, 41.513262 ], [-82.835344, 41.589939 ], [-82.616266, 41.431108 ], [-82.479343, 41.381815 ], [-82.013803, 41.513262 ], [-81.739956, 41.485877 ], [-81.444201, 41.672093 ], [-81.011523, 41.852832 ], [-80.518598, 41.978802 ], [-80.518598, 41.978802 ] ] ] },
  },
  {
    stateTerr: 'MS',
    area: 30049280,
    geometry: {type: "Polygon", coordinates: [[[-88.471115, 34.995703 ], [-88.202745, 34.995703 ], [-88.098683, 34.891641 ], [-88.241084, 33.796253 ], [-88.471115, 31.895754 ], [-88.394438, 30.367688 ], [-88.503977, 30.323872 ], [-88.744962, 30.34578 ], [-88.843547, 30.411504 ], [-89.084533, 30.367688 ], [-89.418626, 30.252672 ], [-89.522688, 30.181472 ], [-89.643181, 30.285534 ], [-89.681519, 30.449842 ], [-89.845827, 30.66892 ], [-89.747242, 30.997536 ], [-91.636787, 30.997536 ], [-91.565587, 31.068736 ], [-91.636787, 31.265906 ], [-91.516294, 31.27686 ], [-91.499863, 31.643815 ], [-91.401278, 31.621907 ], [-91.341032, 31.846462 ], [-91.105524, 31.988862 ], [-90.985031, 32.218894 ], [-91.006939, 32.514649 ], [-91.154816, 32.640618 ], [-91.143862, 32.843265 ], [-91.072662, 32.887081 ], [-91.16577, 33.002096 ], [-91.089093, 33.13902 ], [-91.143862, 33.347144 ], [-91.056231, 33.429298 ], [-91.231493, 33.560744 ], [-91.072662, 33.867453 ], [-90.891923, 34.026284 ], [-90.952169, 34.135823 ], [-90.744046, 34.300131 ], [-90.749522, 34.365854 ], [-90.568783, 34.420624 ], [-90.585214, 34.617794 ], [-90.481152, 34.661609 ], [-90.409952, 34.831394 ], [-90.251121, 34.908072 ], [-90.311367, 34.995703 ], [-88.471115, 34.995703 ] ] ] },
  }, 
];

console.log('creating townshipFeatures');
const townshipFeatures: { [year: string]: TownshipFeatureOrganized[] } = {};

// trying something different--going from the tiles to the data instead of vice versa
Townships.features.forEach(township => {
  const tile_ids = makeJSONFileNames(township);
  tile_ids.forEach(tile_id => {
    const [stateAbbr, officeStub, startYearStr, endYearStr] = tile_id.split('-');
    const startYear = parseInt(startYearStr);
    const endYear = (parseInt(endYearStr) === 1912) ? 1913 : parseInt(endYearStr);
    for (let y = startYear; y < endYear; y++) {
      townshipFeatures[y.toString()] = townshipFeatures[y.toString()] || [];
      // look for the data
      const officeDataForYear = TownshipsData.find(td => td.year === y && td.office.replace(/[^a-zA-Z]/g, '') === `${officeStub}${stateAbbr}`);
      townshipFeatures[y.toString()].push({
        type: 'Feature',
        geometry: JSON.parse(JSON.stringify(township.geometry).replace(/(\d+\.\d\d\d)\d*/g, ($0,$1: string) => (Math.round(parseFloat($1) * 100) / 100).toString())),
        properties: {
          id: township.properties.GISJOIN,
          name: township.properties.Office,
          state: stateAbbr,
          year: y,
          tile_id,
          map_id: 0,
          claims: (officeDataForYear && officeDataForYear.claims_num !== '') ? officeDataForYear.claims_num : 0,
          acres_claimed: (officeDataForYear && officeDataForYear.claims_ac !== '') ? officeDataForYear.claims_ac : 0,
          patents: (officeDataForYear && officeDataForYear.patents_num !== '') ? officeDataForYear.patents_num : 0,
          acres_patented: (officeDataForYear && officeDataForYear.patents_ac !== '') ? officeDataForYear.patents_ac : 0,
          area: geojsonArea.geometry(township.geometry) / 4046.85642,
        },
      });
    };
  });
});

// (TownshipsData as TownshipData[])
//   .forEach((townshipData: TownshipData) => {
//     const yearStr = townshipData.year.toString();
//     townshipFeatures[yearStr] = townshipFeatures[yearStr] || [];
//     const townshipFeatureRaw = Townships.features.find((tfr) => {
//       const { startYear, endYear, endMonth, endDay, endYearToUse } = parseDate(tfr.properties.Start, tfr.properties.End);
//       // some exceptions
//       // spokane falls should be read as spokane
//       if (townshipData.of_id === 'G5305') {
//         return tfr.properties.id && tfr.properties.id === 'G5310' && townshipData.year >= startYear && townshipData.year < endYear;
//       }
//       return tfr.properties.id === townshipData.of_id && townshipData.year >= startYear && townshipData.year <= endYear
//     });

//     if (townshipFeatureRaw && townshipData.year) {
//       const { STATENAM, Office, map_n, Start, End } = townshipFeatureRaw.properties;
//       const stateAbbr = US.lookup(STATENAM).abbr;
//       if (!['IL', 'IN', 'MS', 'OH'].includes(stateAbbr)) {
//         const tile_id = getFileNameForYear(townshipFeatureRaw, townshipData.year);
//         if (tile_id) {
//           townshipFeatures[yearStr].push({
//             type: 'Feature',
//             geometry: JSON.parse(JSON.stringify(townshipFeatureRaw.geometry).replace(/(\d+\.\d\d\d)\d*/g, ($0,$1: string) => (Math.round(parseFloat($1) * 100) / 100).toString())),
//             properties: {
//               id: townshipData.of_id,
//               name: Office,
//               state: stateAbbr,
//               year: townshipData.year,
//               tile_id,
//               map_id: 0,
//               claims: (townshipData.claims_num !== '') ? townshipData.claims_num : 0,
//               acres_claimed: (townshipData.claims_ac !== '') ? townshipData.claims_ac : 0,
//               patents: (townshipData.patents_num !== '') ? townshipData.patents_num : 0,
//               acres_patented: (townshipData.patents_ac !== '') ? townshipData.patents_ac : 0,
//               area: geojsonArea.geometry(townshipFeatureRaw.geometry) / 4046.85642,
//             },
//           });
//         };
//       }
//     } else if (townshipData.year && ['IL', 'IN', 'MS', 'OH'].includes(townshipData.office.slice(-2))) {
//         const atLargeStateData = AtLargeOffices.find(atl => atl.stateTerr === townshipData.office.slice(-2));
//         townshipFeatures[townshipData.year].push({
//           type: 'Feature',
//           geometry: JSON.parse(JSON.stringify(atLargeStateData.geometry).replace(/(\d+\.\d\d\d)\d*/g, ($0,$1: string) => (Math.round(parseFloat($1) * 100) / 100).toString())),
//           properties: {
//             id: townshipData.of_id,
//             name: townshipData.office.slice(0, -4),
//             state: townshipData.office.slice(-2),
//             year: townshipData.year,
//             tile_id: null,
//             map_id: 0,
//             claims: (townshipData.claims_num !== '') ? townshipData.claims_num : 0,
//             acres_claimed: (townshipData.claims_ac !== '') ? townshipData.claims_ac : 0,
//             patents: (townshipData.patents_num !== '') ? townshipData.patents_num : 0,
//             acres_patented: (townshipData.patents_ac !== '') ? townshipData.patents_ac : 0,
//             area: atLargeStateData.area,
//           },
//         });
//     }
//   });

// process the conflicts
console.log('creating conflicts data');
const conflictsData: ConflictData[] = (Conflicts as ConflictRaw[])
   // filter out conflicts before or after our year range
  .filter((d: ConflictRaw) => townshipFeatures[d.date_begin.substr(0, 4)])
  .map((d: ConflictRaw) => {
    const startDate: YMD = {
      year: parseInt(d.date_begin.substr(0, 4)),
      month: parseInt(d.date_begin.substr(5, 2)),
      day: parseInt(d.date_begin.substr(8, 2)),
    }
    const endDate: YMD = {
      year: parseInt(d.date_end.substr(0, 4)),
      month: parseInt(d.date_end.substr(5, 2)),
      day: parseInt(d.date_end.substr(8, 2)),
    }

    // find the office where the conflict happened
    let office: string;
    const point = turf.point([d.x, d.y]);
    let polygon;
    //yearsData[startDate.year.toString()].offices.forEach(yearOffices => {
    const candidates: TownshipFeatureOrganized[] = townshipFeatures[startDate.year.toString()].filter(d1 => {
      return d1.properties.state === US.lookup(d.state).abbr && d1.properties.year === startDate.year;
    });

    candidates.forEach((d: TownshipFeatureOrganized) => {
      if (d.geometry.type === 'Polygon') {
        // @ts-ignore
        polygon = turf.polygon(d.geometry.coordinates);
        if (turf.inside(point, polygon)) {
          office = d.properties.name; 
        }
      }
      if (d.geometry.type === 'MultiPolygon') {
        (d.geometry.coordinates as number[][][][]).forEach(p => {
          polygon = turf.polygon(p);

          //console.log(polygon);
          if (turf.inside(point, polygon)) {
            office = d.properties.name; 
          }
        });
      }
    });

    return {
      x: albersProjection([d.x, d.y])[0],
      y: albersProjection([d.x, d.y])[1] as number,
      office,
      names: d.name_michno,
      state: US.lookup(d.state).abbr,
      nations: [d["nation 1"], d["nation 2"], d["nation 3"], d["nation 4"]].filter(d => d !== ''),
      us_casualties: d["US casualties"],
      native_casualties: d["Native casualties"],
      start_date: startDate,
      end_date: endDate,
    };
  });

fs.writeFileSync('../data-input/townshipsNormalizedFeatures.json', JSON.stringify(townshipFeatures));

Object.keys(townshipFeatures).forEach((year: string) => {
  const projectedTownships: ProjectedTownship[] = townshipFeatures[year].map((townshipFeature: TownshipFeatureOrganized) => {
    const extent = st.extent(townshipFeature.geometry) as number[]; 
    const bounds =[albersProjection([extent[0], extent[1]]), albersProjection([extent[2], extent[3]])] as [[number, number], [number, number]];
    const d = albersPath(rewind(townshipFeature.geometry, true));
    const [left, top, right, bottom] = getSVGBounds(d) as [number, number, number, number];
    // calculate the rotation
    const opposite = 512 - (right + left) / 2;
    const adjacent = (top + bottom) / 2 + 975.4066;
    const rotation = radiansToDegrees(Math.atan(opposite / adjacent)) * -1;
    return {
      d: d.replace(/(\d+\.\d\d\d)\d*/g, ($0: string, $1: number) => (Math.round($1 * 100) / 100).toString()),
      office: townshipFeature.properties.name,
      state: townshipFeature.properties.state,
      area: townshipFeature.properties.area,
      claims: townshipFeature.properties.claims,
      acres_claimed: townshipFeature.properties.acres_claimed,
      patents: townshipFeature.properties.patents,
      acres_patented: townshipFeature.properties.acres_patented,
      rotation, 
      //labelCoords: (townshipFeature.geometry && townshipFeature.geometry.coordinates) ? albersProjection(Polylabel(townshipFeature.geometry.coordinates, 1) as [number, number]).map((c: number)=> Math.round(c * 1000) / 1000) : [[0, 0], [0, 0]],
      labelCoords: [0, 0],
      bounds: albersPath.bounds(rewind(townshipFeature.geometry, true)),
      gisJoin: townshipFeature.properties.id,
      tile_id: townshipFeature.properties.tile_id,
      map_id: townshipFeature.properties.map_id,
    };
  });

  const yearData = {
    offices: projectedTownships,
    conflicts: conflictsData.filter(cd => cd.start_date.year === parseInt(year)),
  };

  fs.writeFileSync(`../../build/data/yearData/${year}.json`, JSON.stringify(yearData));
  fs.writeFileSync(`../../public/data/yearData/${year}.json`, JSON.stringify(yearData));
  fs.writeFileSync('../data-input/conflictsDataWithOffices.json', JSON.stringify(conflictsData));
  console.log(`wrote ${year}.json projected`);
});
