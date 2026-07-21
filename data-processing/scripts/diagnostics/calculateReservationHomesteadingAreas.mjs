import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const geojsonArea = require('@mapbox/geojson-area');
const polygonClipping = require('polygon-clipping');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_INPUT_DIR = path.resolve(__dirname, '../../data-input');
const OPEN_RES_YEAR_DIR = path.join(DATA_INPUT_DIR, 'openres_year');
const RESERVATION_YEAR_DIR = path.join(DATA_INPUT_DIR, 'Reservation_Year');
const DEFAULT_START_YEAR = 1891;
const DEFAULT_END_YEAR = 1912;
const DEFAULT_COMPARISON_YEAR = 1912;
const SQUARE_METERS_PER_ACRE = 4046.8564224;
const ACRES_PER_SQUARE_MILE = 640;

const parseYearArg = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const startYear = parseYearArg(process.argv[2], DEFAULT_START_YEAR);
const endYear = parseYearArg(process.argv[3], DEFAULT_END_YEAR);
const comparisonYear = parseYearArg(process.argv[4], DEFAULT_COMPARISON_YEAR);
const normalizedStartYear = Math.min(startYear, endYear);
const normalizedEndYear = Math.max(startYear, endYear);

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

const unionFeatures = (features) => {
  if (features.length === 0) {
    return null;
  }

  if (features.length === 1) {
    return features[0].geometry;
  }

  return {
    type: 'MultiPolygon',
    coordinates: polygonClipping.union(...features.map(featureToMultiPolygonCoordinates)),
  };
};

const acresFromGeometry = (geometry) => (
  geometry ? geojsonArea.geometry(geometry) / SQUARE_METERS_PER_ACRE : 0
);

const formatNumber = (value, maximumFractionDigits = 0) => value.toLocaleString('en-US', {
  maximumFractionDigits,
});

const formatArea = (acres) => ({
  acres,
  squareMiles: acres / ACRES_PER_SQUARE_MILE,
});

const collectOpenReservationFeatures = () => {
  const seenFeatures = new Map();
  let rawFeatureCount = 0;

  yearRange(normalizedStartYear, normalizedEndYear).forEach((year) => {
    const filePath = path.join(OPEN_RES_YEAR_DIR, `openres_${year}.geojson`);
    const featureCollection = readGeoJson(filePath);

    featureCollection.features
      .filter(feature => feature.properties?.type === 'open_res')
      .forEach((feature) => {
        rawFeatureCount += 1;
        const key = featureKey(feature);

        if (!seenFeatures.has(key)) {
          seenFeatures.set(key, {
            feature,
            years: [year],
          });
          return;
        }

        seenFeatures.get(key).years.push(year);
      });
  });

  return {
    rawFeatureCount,
    uniqueFeatureRecords: [...seenFeatures.values()],
  };
};

const getDissolvedReservationFeature = (year, type) => {
  const filePath = path.join(RESERVATION_YEAR_DIR, `res_${year}.geojson`);
  const featureCollection = readGeoJson(filePath);
  return featureCollection.features.find(feature => feature.properties?.type === type);
};

const { rawFeatureCount, uniqueFeatureRecords } = collectOpenReservationFeatures();
const openReservationFeatures = uniqueFeatureRecords.map(record => record.feature);
const dissolvedOpenReservations = unionFeatures(openReservationFeatures);
const openedArea = formatArea(acresFromGeometry(dissolvedOpenReservations));

const comparisonYearOpenFeature = getDissolvedReservationFeature(comparisonYear, 'open_res');
const comparisonYearReservationFeature = getDissolvedReservationFeature(comparisonYear, 'reservation');
const comparisonYearOpenedArea = formatArea(acresFromGeometry(comparisonYearOpenFeature?.geometry));
const comparisonYearReservationArea = formatArea(acresFromGeometry(comparisonYearReservationFeature?.geometry));
const differenceAcres = openedArea.acres - comparisonYearReservationArea.acres;

console.log(`Reservation homesteading area audit (${normalizedStartYear}-${normalizedEndYear})`);
console.log('');
console.log(`Raw annual open_res feature appearances: ${formatNumber(rawFeatureCount)}`);
console.log(`Unique open_res feature records: ${formatNumber(uniqueFeatureRecords.length)}`);
console.log('');
console.log('Reservations opened to homesteading, deduped and unioned across the year range:');
console.log(`  ${formatNumber(openedArea.acres)} acres`);
console.log(`  ${formatNumber(openedArea.squareMiles, 1)} square miles`);
console.log('');
console.log(`Reservations opened to homesteading in dissolved ${comparisonYear} layer:`);
console.log(`  ${formatNumber(comparisonYearOpenedArea.acres)} acres`);
console.log(`  ${formatNumber(comparisonYearOpenedArea.squareMiles, 1)} square miles`);
console.log('');
console.log(`Reservations in ${comparisonYear} not open to homesteading:`);
console.log(`  ${formatNumber(comparisonYearReservationArea.acres)} acres`);
console.log(`  ${formatNumber(comparisonYearReservationArea.squareMiles, 1)} square miles`);
console.log('');
console.log('Comparison using deduped/unioned opened area versus remaining reservation area:');
console.log(`  Difference: ${formatNumber(Math.abs(differenceAcres))} acres (${differenceAcres >= 0 ? 'opened is larger' : 'remaining reservations is larger'})`);
console.log(`  Ratio opened / remaining: ${formatNumber(openedArea.acres / comparisonYearReservationArea.acres, 3)}`);

const notPresentInComparisonYear = uniqueFeatureRecords.filter(record => (
  !record.years.includes(comparisonYear)
));

if (notPresentInComparisonYear.length > 0) {
  console.log('');
  console.log(`Open-reservation records in ${normalizedStartYear}-${normalizedEndYear} that are not present as separate individual records in openres_${comparisonYear}.geojson:`);
  notPresentInComparisonYear.forEach(({ feature, years }) => {
    const acres = acresFromGeometry(feature.geometry);
    console.log(`  ${feature.properties?.historical || feature.properties?.cess_no || 'unnamed'} (${years.join(', ')}): ${formatNumber(acres)} acres`);
  });
}
