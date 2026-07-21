/*
 * Compares published office-level timeline files in public/data/timelineData
 * against published office rows in public/data/yearData. This helps locate
 * whether inconsistencies are only at the state aggregate level or already
 * present in office-level outputs. Input/output roots can be overridden via
 * environment variables for regenerated trial output audits.
 */
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const yearDataDir = process.env.YEAR_DATA_DIR || path.join(repoRoot, 'public', 'data', 'yearData');
const timelineDataDir = process.env.TIMELINE_DATA_DIR || path.join(repoRoot, 'public', 'data', 'timelineData');
const reportsDir = process.env.REPORTS_DIR || path.join(repoRoot, 'data-processing', 'reports');
const reportBaseName = process.env.REPORT_BASENAME || 'published-office-audit';
const reportTitle = process.env.REPORT_TITLE || 'Published Office-Level Audit';
const reportDescription =
  process.env.REPORT_DESCRIPTION ||
  'This report compares June 30 map-adjusted office rows in `public/data/yearData/*.json` against raw reported-office rows in `public/data/timelineData/<STATE>.json`. Office-level differences are expected when a reporting office closed during the fiscal year and its totals were allocated to successor districts.';

const years = Array.from({ length: 50 }, (_, idx) => idx + 1863);
const metrics = ['claims', 'acres_claimed', 'patents', 'acres_patented'];
const aliasMap = {
  CO: { GoldenCity: 'Golden' },
  ID: { BoiseCity: 'Boise', Boise: 'Boise' },
  KS: { HaysCity: 'Hays', Hays: 'Hays' },
  MN: { DetroitLakes: 'Detroit', Detroit: 'Detroit' },
  NE: { OmahaCity: 'Omaha', Omaha: 'Omaha' },
  NM: {
    FtSumner: 'FortSumner',
    FortSumner: 'FortSumner',
    LaCruces: 'LasCruces',
    LasCruces: 'LasCruces',
  },
  UT: { BeaverCity: 'Beaver', Beaver: 'Beaver' },
  WA: { SpokaneFalls: 'Spokane', Spokane: 'Spokane' },
};

function getOfficeMetricSource(office) {
  if (Array.isArray(office.data)) {
    return office.data.find((entry) => !entry.adjustedForMap) || office.data[0] || {};
  }
  return office;
}

function normalizeOfficeName(name, state) {
  const withoutStateSuffix = name.replace(/,\s*[A-Z]{2}$/, '');
  const compact = withoutStateSuffix.replace(/[^a-zA-Z]/g, '');
  const mapped = aliasMap[state]?.[compact] || compact;
  return mapped.toLowerCase();
}

function makeEmptyOfficeRow({ year, state, office }) {
  return { year, state, office, claims: 0, acres_claimed: 0, patents: 0, acres_patented: 0 };
}

const timelineRows = new Map();
for (const filename of fs.readdirSync(timelineDataDir)) {
  if (!filename.endsWith('.json') || filename === 'national.json') {
    continue;
  }
  const state = filename.replace('.json', '');
  const offices = JSON.parse(fs.readFileSync(path.join(timelineDataDir, filename), 'utf8'));
  for (const office of offices) {
    for (const yearData of office.yearData || []) {
      const key = `${yearData.year}-${state}-${normalizeOfficeName(office.name, state)}`;
      timelineRows.set(key, {
        year: yearData.year,
        state,
        office: office.name,
        claims: yearData.claims || 0,
        acres_claimed: yearData.acres_claimed || 0,
        patents: yearData.patents || 0,
        acres_patented: yearData.acres_patented || 0,
      });
    }
  }
}

const mismatches = [];

for (const year of years) {
  const yearDataPath = path.join(yearDataDir, `${year}.json`);
  if (!fs.existsSync(yearDataPath)) {
    continue;
  }

  const yearData = JSON.parse(fs.readFileSync(yearDataPath, 'utf8'));
  const aggregated = new Map();

  for (const office of yearData.offices || []) {
    const state = office.state;
    const normalized = normalizeOfficeName(office.office, state);
    const officeMetrics = getOfficeMetricSource(office);
    const key = `${year}-${state}-${normalized}`;
    const existing = aggregated.get(key) || makeEmptyOfficeRow({ year, state, office: office.office });
    existing.claims += officeMetrics.claims || 0;
    existing.acres_claimed += officeMetrics.acres_claimed || 0;
    existing.patents += officeMetrics.patents || 0;
    existing.acres_patented += officeMetrics.acres_patented || 0;
    aggregated.set(key, existing);
  }

  for (const [key, yearOffice] of aggregated.entries()) {
    const timeline = timelineRows.get(key) || makeEmptyOfficeRow({ year, state: yearOffice.state, office: yearOffice.office });
    const diff = {
      claims: yearOffice.claims - timeline.claims,
      acres_claimed: yearOffice.acres_claimed - timeline.acres_claimed,
      patents: yearOffice.patents - timeline.patents,
      acres_patented: yearOffice.acres_patented - timeline.acres_patented,
    };

    if (metrics.some((metric) => Math.abs(diff[metric]) > 0.000001)) {
      mismatches.push({
        year,
        state: yearOffice.state,
        office: yearOffice.office,
        normalizedOffice: key.split('-').slice(2).join('-'),
        yearData: yearOffice,
        timelineData: timeline,
        diff,
      });
    }
  }
}

const countsByState = new Map();
for (const mismatch of mismatches) {
  countsByState.set(mismatch.state, (countsByState.get(mismatch.state) || 0) + 1);
}

const topStates = [...countsByState.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 15)
  .map(([state, count]) => ({ state, count }));

const idahoExamples = mismatches
  .filter((row) => row.state === 'ID')
  .sort((a, b) => a.year - b.year)
  .slice(0, 12);

const oklahomaExamples = mismatches
  .filter((row) => row.state === 'OK')
  .sort((a, b) => a.year - b.year)
  .slice(0, 12);

const largestClaimDiffs = [...mismatches]
  .sort((a, b) => Math.abs(b.diff.claims) - Math.abs(a.diff.claims))
  .slice(0, 20);

const reportLines = [
  `# ${reportTitle}`,
  '',
  reportDescription,
  '',
  '## Summary',
  '',
  `- Office-year rows with at least one mismatch: ${mismatches.length}`,
  '',
  '## States With The Most Office-Level Mismatches',
  '',
  '| State | Mismatch rows |',
  '| --- | ---: |',
  ...topStates.map((row) => `| ${row.state} | ${row.count} |`),
  '',
  '## Largest Claim Count Differences',
  '',
  '| Year | State | Office | yearData claims | timeline claims | Diff |',
  '| --- | --- | --- | ---: | ---: | ---: |',
  ...largestClaimDiffs.map(
    (row) =>
      `| ${row.year} | ${row.state} | ${row.office} | ${row.yearData.claims} | ${row.timelineData.claims} | ${row.diff.claims} |`
  ),
  '',
  '## Idaho Examples',
  '',
  '| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |',
  '| --- | --- | ---: | ---: | ---: | ---: |',
  ...idahoExamples.map(
    (row) =>
      `| ${row.year} | ${row.office} | ${row.yearData.claims} | ${row.timelineData.claims} | ${row.yearData.acres_claimed.toFixed(2)} | ${row.timelineData.acres_claimed.toFixed(2)} |`
  ),
  '',
  '## Oklahoma Examples',
  '',
  '| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |',
  '| --- | --- | ---: | ---: | ---: | ---: |',
  ...oklahomaExamples.map(
    (row) =>
      `| ${row.year} | ${row.office} | ${row.yearData.claims} | ${row.timelineData.claims} | ${row.yearData.acres_claimed.toFixed(2)} | ${row.timelineData.acres_claimed.toFixed(2)} |`
  ),
  '',
  '## Interpretation',
  '',
  '- Office-level differences are not conservation failures: map rows use June 30 district allocations while timelines preserve the office that originally reported the annual totals.',
  '- Use `published-data-audit` or the generator’s `mapDataConservation.json` to detect activity that was lost or duplicated at the state-year level.',
  '- Investigate an office-level difference only when its allocation is historically or geographically unexpected.',
];

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, `${reportBaseName}.md`), `${reportLines.join('\n')}\n`);
fs.writeFileSync(
  path.join(reportsDir, `${reportBaseName}.json`),
  JSON.stringify({ topStates, largestClaimDiffs, idahoExamples, oklahomaExamples, mismatches }, null, 2)
);

console.log(`Wrote ${path.join(reportsDir, `${reportBaseName}.md`)}`);
console.log(`Wrote ${path.join(reportsDir, `${reportBaseName}.json`)}`);
