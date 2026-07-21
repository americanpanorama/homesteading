/*
 * Compares the published yearData files against the published timelineData
 * files and writes a markdown report plus JSON details. This is an audit of
 * checked-in outputs by default, but the input/output roots can be overridden
 * via environment variables for regenerated trial output audits.
 */
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const yearDataDir = process.env.YEAR_DATA_DIR || path.join(repoRoot, 'public', 'data', 'yearData');
const timelineDataDir = process.env.TIMELINE_DATA_DIR || path.join(repoRoot, 'public', 'data', 'timelineData');
const reportsDir = process.env.REPORTS_DIR || path.join(repoRoot, 'data-processing', 'reports');
const reportBaseName = process.env.REPORT_BASENAME || 'published-data-audit';
const reportTitle = process.env.REPORT_TITLE || 'Published Data Audit';
const reportDescription =
  process.env.REPORT_DESCRIPTION ||
  'This report compares the checked-in published files under `public/data/yearData` against the checked-in published state timeline files under `public/data/timelineData/national.json`.';

const years = Array.from({ length: 50 }, (_, idx) => idx + 1863);
const metrics = ['claims', 'acres_claimed', 'patents', 'acres_patented'];

function getOfficeMetricSource(office) {
  if (Array.isArray(office.data)) {
    return office.data.find((entry) => !entry.adjustedForMap) || office.data[0] || {};
  }
  return office;
}

const nationalTimeline = JSON.parse(
  fs.readFileSync(path.join(timelineDataDir, 'national.json'), 'utf8')
);

const timelineByYearAndState = new Map();
for (const state of nationalTimeline) {
  for (const yearData of state.yearData || []) {
    timelineByYearAndState.set(`${yearData.year}-${state.abbr}`, {
      name: state.name,
      state: state.abbr,
      year: yearData.year,
      claims: yearData.claims || 0,
      acres_claimed: yearData.acres_claimed || 0,
      patents: yearData.patents || 0,
      acres_patented: yearData.acres_patented || 0,
    });
  }
}

const mismatches = [];

for (const year of years) {
  const yearDataPath = path.join(yearDataDir, `${year}.json`);
  if (!fs.existsSync(yearDataPath)) {
    continue;
  }

  const yearData = JSON.parse(fs.readFileSync(yearDataPath, 'utf8'));
  const aggregates = new Map();

  for (const office of yearData.offices || []) {
    const state = office.state;
    if (!state) {
      continue;
    }
    const officeMetrics = getOfficeMetricSource(office);

    const existing = aggregates.get(state) || {
      year,
      state,
      claims: 0,
      acres_claimed: 0,
      patents: 0,
      acres_patented: 0,
    };

    existing.claims += officeMetrics.claims || 0;
    existing.acres_claimed += officeMetrics.acres_claimed || 0;
    existing.patents += officeMetrics.patents || 0;
    existing.acres_patented += officeMetrics.acres_patented || 0;
    aggregates.set(state, existing);
  }

  for (const [state, aggregate] of aggregates.entries()) {
    const timeline = timelineByYearAndState.get(`${year}-${state}`) || {
      year,
      state,
      name: state,
      claims: 0,
      acres_claimed: 0,
      patents: 0,
      acres_patented: 0,
    };

    const diff = {
      claims: aggregate.claims - timeline.claims,
      acres_claimed: aggregate.acres_claimed - timeline.acres_claimed,
      patents: aggregate.patents - timeline.patents,
      acres_patented: aggregate.acres_patented - timeline.acres_patented,
    };

    if (metrics.some((metric) => Math.abs(diff[metric]) > 0.000001)) {
      mismatches.push({
        year,
        state,
        name: timeline.name,
        yearData: aggregate,
        timelineData: timeline,
        diff,
      });
    }
  }
}

const mismatchCountsByState = new Map();
for (const mismatch of mismatches) {
  mismatchCountsByState.set(
    mismatch.state,
    (mismatchCountsByState.get(mismatch.state) || 0) + 1
  );
}

const mismatchCounts = {
  rowCount: mismatches.length,
  byMetric: Object.fromEntries(
    metrics.map((metric) => [
      metric,
      mismatches.filter((mismatch) => Math.abs(mismatch.diff[metric]) > 0.000001)
        .length,
    ])
  ),
};

const topStates = [...mismatchCountsByState.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 15)
  .map(([state, count]) => ({ state, count }));

const largestClaimDiffs = [...mismatches]
  .sort((a, b) => Math.abs(b.diff.claims) - Math.abs(a.diff.claims))
  .slice(0, 20);

const largestAcreDiffs = [...mismatches]
  .sort((a, b) => Math.abs(b.diff.acres_claimed) - Math.abs(a.diff.acres_claimed))
  .slice(0, 20);

const reportLines = [
  `# ${reportTitle}`,
  '',
  reportDescription,
  '',
  'It is intended to show where the published outputs disagree, not to decide',
  'which side is historically correct.',
  '',
  '## Summary',
  '',
  `- State-year rows with at least one mismatch: ${mismatchCounts.rowCount}`,
  `- Rows with claims mismatch: ${mismatchCounts.byMetric.claims}`,
  `- Rows with acres claimed mismatch: ${mismatchCounts.byMetric.acres_claimed}`,
  `- Rows with patents mismatch: ${mismatchCounts.byMetric.patents}`,
  `- Rows with acres patented mismatch: ${mismatchCounts.byMetric.acres_patented}`,
  '',
  '## States With The Most Mismatches',
  '',
  '| State | Mismatch rows |',
  '| --- | ---: |',
  ...topStates.map((row) => `| ${row.state} | ${row.count} |`),
  '',
  '## Largest Claim Count Differences',
  '',
  '| Year | State | Name | yearData claims | timeline claims | Diff |',
  '| --- | --- | --- | ---: | ---: | ---: |',
  ...largestClaimDiffs.map(
    (row) =>
      `| ${row.year} | ${row.state} | ${row.name} | ${row.yearData.claims} | ${row.timelineData.claims} | ${row.diff.claims} |`
  ),
  '',
  '## Largest Acres Claimed Differences',
  '',
  '| Year | State | Name | yearData acres | timeline acres | Diff |',
  '| --- | --- | --- | ---: | ---: | ---: |',
  ...largestAcreDiffs.map(
    (row) =>
      `| ${row.year} | ${row.state} | ${row.name} | ${row.yearData.acres_claimed.toFixed(
        2
      )} | ${row.timelineData.acres_claimed.toFixed(2)} | ${row.diff.acres_claimed.toFixed(
        2
      )} |`
  ),
  '',
  '## Notes',
  '',
  '- This audit only compares state-level aggregates against `national.json`.',
  '- It does not yet compare office-level timeline files against district/year files.',
  '- A zero on one side does not prove that side is wrong. In several cases, the',
  '  discrepancy appears to come from data being dropped between generation stages.',
];

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(
  path.join(reportsDir, `${reportBaseName}.md`),
  `${reportLines.join('\n')}\n`
);
fs.writeFileSync(
  path.join(reportsDir, `${reportBaseName}.json`),
  JSON.stringify(
    {
      mismatchCounts,
      topStates,
      largestClaimDiffs,
      largestAcreDiffs,
      mismatches,
    },
    null,
    2
  )
);

console.log(`Wrote ${path.join(reportsDir, `${reportBaseName}.md`)}`);
console.log(`Wrote ${path.join(reportsDir, `${reportBaseName}.json`)}`);
