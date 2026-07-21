/*
 * Runs a limited regeneration of yearData and timelineData into a temporary
 * output directory. This is intended for safe comparison work and does not
 * overwrite the checked-in build/public data trees.
 *
 * Usage:
 *   node data-processing/scripts/diagnostics/runTrialRegeneration.mjs 1868,1902
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const yearArg = process.argv[2] || '1868,1902';
const years = yearArg
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

if (years.length === 0) {
  console.error('No years provided.');
  process.exit(1);
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'homesteads2-trial-'));
const repoRoot = process.cwd();
const dataProcessingCwd = path.join(repoRoot, 'data-processing');
const runRoot = path.join(tempRoot, 'runroot');
const compiledDataProcessingRoot = path.join(runRoot, 'data-processing');
const compiledSrcRoot = path.join(runRoot, 'src');
const buildDataRoot = path.join(tempRoot, 'build', 'data');
const publicDataRoot = path.join(tempRoot, 'public', 'data');
const diagnosticsRoot = path.join(tempRoot, 'diagnostics');
const conflictsOutputPath = path.join(tempRoot, 'conflictsDataWithOffices.json');

fs.mkdirSync(runRoot, { recursive: true });
fs.mkdirSync(compiledDataProcessingRoot, { recursive: true });
fs.mkdirSync(compiledSrcRoot, { recursive: true });
fs.mkdirSync(buildDataRoot, { recursive: true });
fs.mkdirSync(publicDataRoot, { recursive: true });
fs.mkdirSync(diagnosticsRoot, { recursive: true });
fs.writeFileSync(
  path.join(compiledDataProcessingRoot, 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2)
);
fs.symlinkSync(path.join(dataProcessingCwd, 'node_modules'), path.join(compiledDataProcessingRoot, 'node_modules'));
fs.symlinkSync(path.join(repoRoot, 'node_modules'), path.join(runRoot, 'node_modules'));

const compileRun = spawnSync(
  path.join(dataProcessingCwd, 'node_modules', '.bin', 'tsc'),
  [
    'functions.ts',
    'scripts/createYearGeojsonFilesWithClashes.ts',
    'scripts/makeStateTimelineData.ts',
    '--outDir',
    compiledDataProcessingRoot,
    '--module',
    'es2020',
    '--target',
    'es2020',
    '--moduleResolution',
    'node',
    '--esModuleInterop',
    '--skipLibCheck',
    '--resolveJsonModule',
    '--declaration',
    'false',
    '--sourceMap',
    'false',
  ],
  {
    cwd: dataProcessingCwd,
    stdio: 'inherit',
  }
);

if (compileRun.status !== 0) {
  process.exit(compileRun.status || 1);
}

fs.symlinkSync(path.join(dataProcessingCwd, 'data-input'), path.join(compiledDataProcessingRoot, 'data-input'));
fs.copyFileSync(path.join(repoRoot, 'src', 'us.js'), path.join(compiledSrcRoot, 'us.js'));
fs.writeFileSync(
  path.join(compiledSrcRoot, 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2)
);
fs.symlinkSync(path.join(dataProcessingCwd, 'data-input'), path.join(runRoot, 'data-input'));

const commonEnv = {
  ...process.env,
  YEAR_FILTER: years.join(','),
  BUILD_DATA_ROOT: buildDataRoot,
  PUBLIC_DATA_ROOT: publicDataRoot,
  DIAGNOSTICS_ROOT: diagnosticsRoot,
  CONFLICTS_OUTPUT_PATH: conflictsOutputPath,
};

const yearDataRun = spawnSync(
  'node',
  ['scripts/createYearGeojsonFilesWithClashes.js'],
  {
    cwd: compiledDataProcessingRoot,
    env: commonEnv,
    stdio: 'inherit',
  }
);

if (yearDataRun.status !== 0) {
  process.exit(yearDataRun.status || 1);
}

const timelineRun = spawnSync(
  'node',
  ['scripts/makeStateTimelineData.js'],
  {
    cwd: compiledDataProcessingRoot,
    env: {
      ...commonEnv,
      CONFLICTS_INPUT_PATH: conflictsOutputPath,
    },
    stdio: 'inherit',
  }
);

if (timelineRun.status !== 0) {
  process.exit(timelineRun.status || 1);
}

console.log(`Trial regeneration root: ${tempRoot}`);
console.log(`Compiled trial scripts: ${compiledDataProcessingRoot}`);
console.log(`Trial build data: ${buildDataRoot}`);
console.log(`Trial public data: ${publicDataRoot}`);
