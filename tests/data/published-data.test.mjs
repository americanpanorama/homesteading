import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const timelineDirectory = path.join(projectRoot, 'public/data/timelineData');
const yearDataDirectory = path.join(projectRoot, 'public/data/yearData');
const placesDateRangesPath = path.join(projectRoot, 'data/placesDateRanges.json');
const firstYear = 1863;
const lastYear = 1912;

const numericFields = [
  'claims',
  'acres_claimed',
  'claims_indian_lands',
  'acres_claimed_indian_lands',
  'patents',
  'acres_patented',
  'patents_indian_lands',
  'acres_patented_indian_lands',
  'commutations_2301',
  'acres_commuted_2301',
  'commutations_18800615',
  'acres_commuted_18800615',
  'commutations_indian_lands',
  'acres_commuted_indian_lands',
  'area',
];

const readJson = async filePath => JSON.parse(await readFile(filePath, 'utf8'));

const loadStateTimelines = async () => {
  const filenames = (await readdir(timelineDirectory))
    .filter(filename => filename.endsWith('.json') && filename !== 'national.json')
    .sort();

  return Promise.all(filenames.map(async filename => ({
    state: filename.replace(/\.json$/, ''),
    places: await readJson(path.join(timelineDirectory, filename)),
  })));
};

test('every published map year has readable office and conflict arrays', async () => {
  const failures = [];

  for (let year = firstYear; year <= lastYear; year += 1) {
    const data = await readJson(path.join(yearDataDirectory, `${year}.json`));
    if (!Array.isArray(data.offices)) failures.push(`${year}: offices is not an array`);
    if (!Array.isArray(data.conflicts)) failures.push(`${year}: conflicts is not an array`);
  }

  assert.deepEqual(failures, []);
});

test('timeline records contain valid names, years, and nonnegative numeric values', async () => {
  const failures = [];
  const stateTimelines = await loadStateTimelines();

  for (const { state, places } of stateTimelines) {
    if (!Array.isArray(places) || places.length === 0) {
      failures.push(`${state}: timeline is empty`);
      continue;
    }

    for (const place of places) {
      const context = `${state}/${place.name || '(unnamed)'}`;
      if (typeof place.name !== 'string' || place.name.length === 0) failures.push(`${context}: invalid name`);
      if (place.stateOrTerritory !== state) failures.push(`${context}: stateOrTerritory is ${place.stateOrTerritory}`);
      if (place.type !== 'office') failures.push(`${context}: type is ${place.type}`);
      if (!Array.isArray(place.yearData) || place.yearData.length === 0) {
        failures.push(`${context}: yearData is empty`);
        continue;
      }

      for (const yearDatum of place.yearData) {
        const yearContext = `${context}/${yearDatum.year}`;
        if (!Number.isInteger(yearDatum.year) || yearDatum.year < firstYear || yearDatum.year > lastYear) {
          failures.push(`${yearContext}: invalid year`);
        }
        for (const field of numericFields) {
          if (!Number.isFinite(yearDatum[field]) || yearDatum[field] < 0) {
            failures.push(`${yearContext}: invalid ${field} value ${yearDatum[field]}`);
          }
        }
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('date-range metadata covers every state and district and matches timeline endpoints', async () => {
  const failures = [];
  const stateTimelines = await loadStateTimelines();
  const ranges = await readJson(placesDateRangesPath);
  const rangesByState = new Map(ranges.map(state => [state.stub, state]));

  for (const { state, places } of stateTimelines) {
    const stateRange = rangesByState.get(state);
    if (!stateRange) {
      failures.push(`${state}: missing state date range`);
      continue;
    }

    const officeRanges = new Map(stateRange.offices.map(office => [office.stub, office]));
    for (const place of places) {
      const officeRange = officeRanges.get(place.name);
      if (!officeRange) {
        failures.push(`${state}/${place.name}: missing office date range`);
        continue;
      }

      const years = place.yearData.map(yearDatum => yearDatum.year);
      const actualFirstYear = Math.min(...years);
      const actualLastYear = Math.max(...years);
      if (officeRange.firstYear !== actualFirstYear || officeRange.lastYear !== actualLastYear) {
        failures.push(
          `${state}/${place.name}: range ${officeRange.firstYear}-${officeRange.lastYear} does not match ${actualFirstYear}-${actualLastYear}`,
        );
      }
    }

    const timelineOfficeNames = new Set(places.map(place => place.name));
    for (const officeRange of stateRange.offices) {
      if (!timelineOfficeNames.has(officeRange.stub)) {
        failures.push(`${state}/${officeRange.stub}: date range has no timeline office`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('each district has at most one timeline record per year', async () => {
  const duplicates = [];
  const stateTimelines = await loadStateTimelines();

  for (const { state, places } of stateTimelines) {
    for (const place of places) {
      const yearCounts = new Map();
      for (const yearDatum of place.yearData) {
        yearCounts.set(yearDatum.year, (yearCounts.get(yearDatum.year) || 0) + 1);
      }
      for (const [year, count] of yearCounts) {
        if (count > 1) duplicates.push(`${state}/${place.name}/${year} (${count} records)`);
      }
    }
  }

  assert.deepEqual(duplicates, []);
});

test('corrected Spokane and Las Cruces histories retain their real data ranges', async () => {
  const expectations = [
    { state: 'NM', office: 'Las Cruces', firstYear: 1883, lastYear: 1912 },
    { state: 'WA', office: 'Spokane', firstYear: 1884, lastYear: 1912 },
  ];

  for (const expectation of expectations) {
    const places = await readJson(path.join(timelineDirectory, `${expectation.state}.json`));
    const place = places.find(candidate => candidate.name === expectation.office);
    assert.ok(place, `${expectation.state}/${expectation.office} is missing`);

    const years = place.yearData.map(yearDatum => yearDatum.year);
    assert.equal(years[0], expectation.firstYear);
    assert.equal(years.at(-1), expectation.lastYear);
    assert.equal(years.length, expectation.lastYear - expectation.firstYear + 1);
  }
});
