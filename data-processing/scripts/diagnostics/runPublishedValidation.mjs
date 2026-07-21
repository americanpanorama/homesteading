/*
 * Runs a full temporary regeneration, publishes app-facing temp outputs in
 * YEAR_DATA_MODE=map, and writes a focused validation report for historically
 * sensitive cases before replacing checked-in app data.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const repoRoot = process.cwd();
const reportsDir = path.join(repoRoot, 'data-processing', 'reports');
const yearsArg = Array.from({ length: 50 }, (_, idx) => idx + 1863).join(',');

function runNodeScript(scriptPath, args = [], env = {}) {
  const result = spawnSync('node', [scriptPath, ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: node ${scriptPath} ${args.join(' ')}`.trim());
  }

  return result.stdout || '';
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeOfficeName(name) {
  return name.replace(/,\s*[A-Z]{2}$/, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
}

function findPublishedOffice(yearDataRoot, year, state, office) {
  const file = path.join(yearDataRoot, `${year}.json`);
  const data = readJson(file);
  return (data.offices || []).find(
    (row) =>
      row.state === state &&
      normalizeOfficeName(row.office) === normalizeOfficeName(office)
  ) || null;
}

function findRawOffice(rawRows, year, officeWithState) {
  return rawRows.find((row) => row.year === year && row.office === officeWithState) || null;
}

function officeEndsBeforeFiscalYear(boundary, year) {
  if (!boundary?.tile_id) {
    return false;
  }
  const endDate = boundary.tile_id.slice(-8);
  return endDate < `${year}0630`;
}

function makeComparison(raw, published) {
  return {
    raw: raw
      ? {
          claims: raw.claims_num,
          patents: raw.patents_num,
          acres_claimed: raw.claims_ac,
          acres_patented: raw.patents_ac,
        }
      : null,
    published: published
      ? {
          claims: published.claims,
          patents: published.patents,
          acres_claimed: published.acres_claimed,
          acres_patented: published.acres_patented,
          tile_id: published.tile_id,
        }
      : null,
  };
}

fs.mkdirSync(reportsDir, { recursive: true });

const trialOutput = runNodeScript('data-processing/scripts/diagnostics/runTrialRegeneration.mjs', [yearsArg]);
const trialRootMatch = trialOutput.match(/Trial regeneration root:\s*(.+)/);
if (!trialRootMatch) {
  throw new Error('Could not determine trial regeneration root from wrapper output.');
}

const trialRoot = trialRootMatch[1].trim();
const publishRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'homesteads2-published-'));

runNodeScript('data-processing/scripts/publishBuildData.mjs', [], {
  BUILD_DATA_ROOT: path.join(trialRoot, 'build', 'data'),
  PUBLIC_DATA_ROOT: publishRoot,
  YEAR_DATA_MODE: 'map',
});

const rawRows = readJson(path.join(repoRoot, 'data-processing', 'data-input', 'townships_data.json'));

const validation = {
  years: yearsArg,
  trialRoot,
  publishRoot,
  cases: {
    idaho1868: makeComparison(
      findRawOffice(rawRows, 1868, 'Boise, ID'),
      findPublishedOffice(path.join(publishRoot, 'yearData'), 1868, 'ID', 'Boise')
    ),
    oklahoma1902: {
      elReno: makeComparison(
        findRawOffice(rawRows, 1902, 'El Reno, OK'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), 1902, 'OK', 'El Reno')
      ),
      oklahomaCity: makeComparison(
        findRawOffice(rawRows, 1902, 'Oklahoma City, OK'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), 1902, 'OK', 'Oklahoma City')
      ),
      perry: makeComparison(
        findRawOffice(rawRows, 1902, 'Perry, OK'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), 1902, 'OK', 'Perry')
      ),
    },
    nevada1886to1893: Array.from({ length: 8 }, (_, idx) => idx + 1886).map((year) => ({
      year,
      carsonCity: makeComparison(
        findRawOffice(rawRows, year, 'Carson City, NV'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), year, 'NV', 'Carson City')
      ),
      eureka: makeComparison(
        findRawOffice(rawRows, year, 'Eureka, NV'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), year, 'NV', 'Eureka')
      ),
    })),
    fullStateCases: {
      ohio1863: makeComparison(
        findRawOffice(rawRows, 1863, 'Chillicothe, OH'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), 1863, 'OH', 'Chillicothe')
      ),
      illinois1863: makeComparison(
        findRawOffice(rawRows, 1863, 'Springfield, IL'),
        findPublishedOffice(path.join(publishRoot, 'yearData'), 1863, 'IL', 'Springfield')
      ),
    },
  },
};

const build1902 = readJson(path.join(trialRoot, 'build', 'data', 'yearData', '1902.json'));
const perryBuildOffice = (build1902.offices || []).find(
  (row) => row.state === 'OK' && normalizeOfficeName(row.office) === normalizeOfficeName('Perry')
);
const perryBoundary = perryBuildOffice?.office_boundaries?.[0] || null;
const perryExcludedForMap = Boolean(
  perryBuildOffice &&
  perryBoundary &&
  officeEndsBeforeFiscalYear(perryBoundary, 1902) &&
  validation.cases.oklahoma1902.perry.published === null
);

validation.cases.oklahoma1902.perryBuildPresence = {
  buildOfficePresent: Boolean(perryBuildOffice),
  boundaryTile: perryBoundary?.tile_id || null,
  excludedForMap: perryExcludedForMap,
};

const reportLines = [
  '# Published Temp Validation',
  '',
  `Years regenerated: \`${yearsArg}\``,
  '',
  `Temporary regeneration root: \`${trialRoot}\``,
  `Temporary published root: \`${publishRoot}\``,
  '',
  '## Idaho 1868',
  '',
  `- Raw Boise claims/patents: ${validation.cases.idaho1868.raw?.claims ?? 'missing'} / ${validation.cases.idaho1868.raw?.patents ?? 'missing'}`,
  `- Published Boise claims/patents: ${validation.cases.idaho1868.published?.claims ?? 'missing'} / ${validation.cases.idaho1868.published?.patents ?? 'missing'}`,
  '',
  '## Oklahoma 1902',
  '',
  '| Office | Raw claims | Published claims | Raw patents | Published patents | Tile |',
  '| --- | ---: | ---: | ---: | ---: | --- |',
  ...Object.entries(validation.cases.oklahoma1902).map(([office, row]) =>
    office === 'perryBuildPresence'
      ? `| perry (build status) | ${row.buildOfficePresent ? 'present in build' : 'missing in build'} | ${row.excludedForMap ? 'excluded for map' : 'not excluded'} | - | - | ${row.boundaryTile ?? 'missing'} |`
      : `| ${office} | ${row.raw?.claims ?? 'missing'} | ${row.published?.claims ?? 'missing'} | ${row.raw?.patents ?? 'missing'} | ${row.published?.patents ?? 'missing'} | ${row.published?.tile_id ?? 'missing'} |`
  ),
  '',
  '## Nevada 1886-1893',
  '',
  '| Year | Carson raw claims | Carson published claims | Eureka raw claims | Eureka published claims |',
  '| --- | ---: | ---: | ---: | ---: |',
  ...validation.cases.nevada1886to1893.map((row) =>
    `| ${row.year} | ${row.carsonCity.raw?.claims ?? 'missing'} | ${row.carsonCity.published?.claims ?? 'missing'} | ${row.eureka.raw?.claims ?? 'missing'} | ${row.eureka.published?.claims ?? 'missing'} |`
  ),
  '',
  '## Full-State Cases',
  '',
  '| Case | Raw claims | Published claims | Raw patents | Published patents | Tile |',
  '| --- | ---: | ---: | ---: | ---: | --- |',
  ...Object.entries(validation.cases.fullStateCases).map(([label, row]) =>
    `| ${label} | ${row.raw?.claims ?? 'missing'} | ${row.published?.claims ?? 'missing'} | ${row.raw?.patents ?? 'missing'} | ${row.published?.patents ?? 'missing'} | ${row.published?.tile_id ?? 'missing'} |`
  ),
  '',
  '## Notes',
  '',
  '- These checks use the published app-facing shape produced by `publishBuildData.mjs` in `YEAR_DATA_MODE=map`.',
  '- Map-mode publication prefers `adjustedForMap` values when they exist, so exact equality with the raw office table is not always expected for redistributed districts.',
  '- Offices whose boundary ends before June 30 of the fiscal year can still exist in nested build outputs but be intentionally excluded from the app-facing published map data.',
];

fs.writeFileSync(
  path.join(reportsDir, 'published-temp-validation.md'),
  `${reportLines.join('\n')}\n`
);
fs.writeFileSync(
  path.join(reportsDir, 'published-temp-validation.json'),
  JSON.stringify(validation, null, 2)
);

console.log(`Wrote ${path.join(reportsDir, 'published-temp-validation.md')}`);
console.log(`Wrote ${path.join(reportsDir, 'published-temp-validation.json')}`);
