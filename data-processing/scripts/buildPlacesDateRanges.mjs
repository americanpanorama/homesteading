/**
 * Regenerates data/placesDateRanges.json from the canonical published timeline
 * data using a current Node-compatible compile-and-run path.
 *
 * The legacy data-processing ts-node loader setup is brittle on current Node
 * versions, so this wrapper compiles just createYearRangeForPlaces.ts into a
 * temporary local directory and executes the emitted module.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const dataProcessingRoot = path.resolve(scriptDir, '..');
const tempBuildDir = path.join(dataProcessingRoot, '.tmp-script-build');
const sourceScript = path.join(scriptDir, 'createYearRangeForPlaces.ts');
const compiledScript = path.join(tempBuildDir, 'createYearRangeForPlaces.js');
const compiledModule = path.join(tempBuildDir, 'createYearRangeForPlaces.mjs');
const tscPath = path.join(dataProcessingRoot, 'node_modules', '.bin', 'tsc');

fs.rmSync(tempBuildDir, { recursive: true, force: true });
fs.mkdirSync(tempBuildDir, { recursive: true });

execFileSync(tscPath, [
  sourceScript,
  '--module', 'es2020',
  '--target', 'es2020',
  '--moduleResolution', 'node',
  '--esModuleInterop',
  '--skipLibCheck',
  '--resolveJsonModule',
  '--outDir', tempBuildDir,
], {
  cwd: dataProcessingRoot,
  stdio: 'inherit',
});

fs.copyFileSync(compiledScript, compiledModule);
execFileSync(process.execPath, [compiledModule], {
  cwd: dataProcessingRoot,
  stdio: 'inherit',
});
