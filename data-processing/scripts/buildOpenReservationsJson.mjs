import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const d3 = require('d3');
const polygonClipping = require('polygon-clipping');
const rewind = require('geojson-rewind');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_INPUT_DIR = path.resolve(__dirname, '../data-input');
const OPEN_RES_YEAR_DIR = path.join(DATA_INPUT_DIR, 'openres_year');
const OUTPUT_FILE = path.resolve(__dirname, '../../public/openReservations.json');
const START_YEAR = 1891;
const END_YEAR = 1912;

const projection = d3
  .geoConicEqualArea()
  .parallels([29.5, 45.5])
  .scale((1070 / 960) * 1024)
  .translate([512, 512])
  .rotate([96, 0])
  .center([0, 37.5]);

const pathGenerator = d3.geoPath(projection);

const readGeoJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const yearRange = (start, end) => (
  Array.from({ length: end - start + 1 }, (_value, index) => start + index)
);

const featureKey = (feature) => {
  const properties = feature.properties || {};
  return [
    properties.fid_1,
    properties.cess_no,
    properties.FID,
    properties.cartodb_id,
    JSON.stringify(feature.geometry),
  ].find(value => value !== undefined && value !== null && value !== '')?.toString();
};

const featureToMultiPolygonCoordinates = (feature) => {
  if (feature.geometry.type === 'Polygon') {
    return [feature.geometry.coordinates];
  }

  if (feature.geometry.type === 'MultiPolygon') {
    return feature.geometry.coordinates;
  }

  throw new Error(`Unsupported geometry type: ${feature.geometry.type}`);
};

const getSvgPath = (geometry) => pathGenerator(geometry)?.replace(
  /(\d+\.\d\d\d)\d*/g,
  (_match, value) => (Math.round(Number(value) * 100) / 100).toString(),
) || '';

const collectUniqueOpenReservationFeatures = () => {
  const featuresByKey = new Map();
  let rawFeatureCount = 0;

  yearRange(START_YEAR, END_YEAR).forEach((year) => {
    const featureCollection = readGeoJson(path.join(OPEN_RES_YEAR_DIR, `openres_${year}.geojson`));

    featureCollection.features
      .filter(feature => feature.properties?.type === 'open_res')
      .forEach((feature) => {
        rawFeatureCount += 1;
        const key = featureKey(feature);

        if (!featuresByKey.has(key)) {
          featuresByKey.set(key, {
            feature,
            years: [year],
          });
          return;
        }

        featuresByKey.get(key).years.push(year);
      });
  });

  return {
    rawFeatureCount,
    records: [...featuresByKey.values()],
  };
};

const { rawFeatureCount, records } = collectUniqueOpenReservationFeatures();
const unionedCoordinates = polygonClipping.union(
  ...records.map(({ feature }) => featureToMultiPolygonCoordinates(feature)),
);

const openReservations = unionedCoordinates.map((coordinates, index) => ({
  d: getSvgPath(rewind({
    type: 'MultiPolygon',
    coordinates: [coordinates],
  }, true)),
  type: 'open_res',
  id: `open-res-${index + 1}`,
}));

fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(openReservations)}\n`);

console.log(`Wrote ${openReservations.length} deduped open reservation polygons to ${OUTPUT_FILE}`);
console.log(`Raw annual open_res feature appearances: ${rawFeatureCount}`);
console.log(`Unique open_res feature records before union: ${records.length}`);
