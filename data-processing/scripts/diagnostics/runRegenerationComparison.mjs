/*
 * Runs a safe regeneration into a temporary output tree, audits the regenerated
 * outputs, and compares the mismatch counts against the checked-in published
 * outputs. By default it covers the full 1863-1912 year range.
 *
 * Usage:
 *   node data-processing/scripts/diagnostics/runRegenerationComparison.mjs
 *   node data-processing/scripts/diagnostics/runRegenerationComparison.mjs 1868,1902
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const reportsDir = path.join(repoRoot, 'data-processing', 'reports');
const yearsArg =
  process.argv[2] ||
  Array.from({ length: 50 }, (_, idx) => idx + 1863).join(',');

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

function percentageReduction(before, after) {
  if (before === 0) {
    return after === 0 ? 0 : null;
  }
  return ((before - after) / before) * 100;
}

function formatReduction(before, after) {
  const reduction = percentageReduction(before, after);
  if (reduction === null) {
    return 'n/a';
  }
  return `${reduction.toFixed(1)}%`;
}

fs.mkdirSync(reportsDir, { recursive: true });

runNodeScript('data-processing/scripts/diagnostics/auditPublishedDataConsistency.mjs');
runNodeScript('data-processing/scripts/diagnostics/auditPublishedOfficeTimelineConsistency.mjs');

const trialOutput = runNodeScript('data-processing/scripts/diagnostics/runTrialRegeneration.mjs', [yearsArg]);
const trialRootMatch = trialOutput.match(/Trial regeneration root:\s*(.+)/);
if (!trialRootMatch) {
  throw new Error('Could not determine trial regeneration root from wrapper output.');
}

const trialRoot = trialRootMatch[1].trim();
const regeneratedYearDataDir = path.join(trialRoot, 'build', 'data', 'yearData');
const regeneratedTimelineDataDir = path.join(trialRoot, 'build', 'data', 'timelineData');

runNodeScript('data-processing/scripts/diagnostics/auditPublishedDataConsistency.mjs', [], {
  YEAR_DATA_DIR: regeneratedYearDataDir,
  TIMELINE_DATA_DIR: regeneratedTimelineDataDir,
  REPORTS_DIR: reportsDir,
  REPORT_BASENAME: 'regenerated-data-audit',
  REPORT_TITLE: 'Regenerated Data Audit',
  REPORT_DESCRIPTION:
    `This report compares regenerated temporary yearData under \`${regeneratedYearDataDir}\` against regenerated temporary state timeline data under \`${regeneratedTimelineDataDir}\`.`,
});

runNodeScript('data-processing/scripts/diagnostics/auditPublishedOfficeTimelineConsistency.mjs', [], {
  YEAR_DATA_DIR: regeneratedYearDataDir,
  TIMELINE_DATA_DIR: regeneratedTimelineDataDir,
  REPORTS_DIR: reportsDir,
  REPORT_BASENAME: 'regenerated-office-audit',
  REPORT_TITLE: 'Regenerated Office-Level Audit',
  REPORT_DESCRIPTION:
    `This report compares regenerated temporary office rows under \`${regeneratedYearDataDir}\` against regenerated temporary office timeline files under \`${regeneratedTimelineDataDir}\`.`,
});

const publishedDataAudit = readJson(path.join(reportsDir, 'published-data-audit.json'));
const publishedOfficeAudit = readJson(path.join(reportsDir, 'published-office-audit.json'));
const regeneratedDataAudit = readJson(path.join(reportsDir, 'regenerated-data-audit.json'));
const regeneratedOfficeAudit = readJson(path.join(reportsDir, 'regenerated-office-audit.json'));

const publishedStateRows = publishedDataAudit.mismatchCounts.rowCount;
const regeneratedStateRows = regeneratedDataAudit.mismatchCounts.rowCount;
const publishedOfficeRows = publishedOfficeAudit.mismatches.length;
const regeneratedOfficeRows = regeneratedOfficeAudit.mismatches.length;

const comparisonSummary = {
  years: yearsArg,
  trialRoot,
  published: {
    stateMismatchRows: publishedStateRows,
    officeMismatchRows: publishedOfficeRows,
  },
  regenerated: {
    stateMismatchRows: regeneratedStateRows,
    officeMismatchRows: regeneratedOfficeRows,
  },
  reduction: {
    stateMismatchRows: {
      absolute: publishedStateRows - regeneratedStateRows,
      percent: percentageReduction(publishedStateRows, regeneratedStateRows),
    },
    officeMismatchRows: {
      absolute: publishedOfficeRows - regeneratedOfficeRows,
      percent: percentageReduction(publishedOfficeRows, regeneratedOfficeRows),
    },
  },
  publishedTopStates: publishedDataAudit.topStates,
  regeneratedTopStates: regeneratedDataAudit.topStates,
  publishedTopOfficeStates: publishedOfficeAudit.topStates,
  regeneratedTopOfficeStates: regeneratedOfficeAudit.topStates,
};

const reportLines = [
  '# Regeneration Comparison',
  '',
  `Years regenerated: \`${yearsArg}\``,
  '',
  `Temporary regeneration root: \`${trialRoot}\``,
  '',
  '## Summary',
  '',
  '| Audit | Published mismatches | Regenerated mismatches | Reduction |',
  '| --- | ---: | ---: | ---: |',
  `| State-level rows | ${publishedStateRows} | ${regeneratedStateRows} | ${formatReduction(publishedStateRows, regeneratedStateRows)} |`,
  `| Office-level rows | ${publishedOfficeRows} | ${regeneratedOfficeRows} | ${formatReduction(publishedOfficeRows, regeneratedOfficeRows)} |`,
  '',
  '## Published vs Regenerated Top States',
  '',
  '### State-level mismatches',
  '',
  '| Rank | Published | Count | Regenerated | Count |',
  '| --- | --- | ---: | --- | ---: |',
];

const maxStateRows = Math.max(
  publishedDataAudit.topStates.length,
  regeneratedDataAudit.topStates.length
);
for (let idx = 0; idx < maxStateRows; idx += 1) {
  const published = publishedDataAudit.topStates[idx];
  const regenerated = regeneratedDataAudit.topStates[idx];
  reportLines.push(
    `| ${idx + 1} | ${published?.state || ''} | ${published?.count ?? ''} | ${regenerated?.state || ''} | ${regenerated?.count ?? ''} |`
  );
}

reportLines.push(
  '',
  '### Office-level mismatches',
  '',
  '| Rank | Published | Count | Regenerated | Count |',
  '| --- | --- | ---: | --- | ---: |'
);

const maxOfficeRows = Math.max(
  publishedOfficeAudit.topStates.length,
  regeneratedOfficeAudit.topStates.length
);
for (let idx = 0; idx < maxOfficeRows; idx += 1) {
  const published = publishedOfficeAudit.topStates[idx];
  const regenerated = regeneratedOfficeAudit.topStates[idx];
  reportLines.push(
    `| ${idx + 1} | ${published?.state || ''} | ${published?.count ?? ''} | ${regenerated?.state || ''} | ${regenerated?.count ?? ''} |`
  );
}

reportLines.push(
  '',
  '## Notes',
  '',
  '- This comparison only measures internal consistency between regenerated `yearData` and regenerated `timelineData`.',
  '- It does not yet prove that every regenerated value is historically correct.',
  '- It does show whether the current top-level generator produces outputs that reconcile better than the checked-in published data.'
);

fs.writeFileSync(
  path.join(reportsDir, 'regeneration-comparison.md'),
  `${reportLines.join('\n')}\n`
);
fs.writeFileSync(
  path.join(reportsDir, 'regeneration-comparison.json'),
  JSON.stringify(comparisonSummary, null, 2)
);

console.log(`Wrote ${path.join(reportsDir, 'regeneration-comparison.md')}`);
console.log(`Wrote ${path.join(reportsDir, 'regeneration-comparison.json')}`);
