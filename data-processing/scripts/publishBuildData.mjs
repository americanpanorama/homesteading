/*
 * Publishes app-facing data from build/data into public/data.
 *
 * The important transform is yearData: the current top-level generator emits a
 * nested office shape in build/data/yearData, while the app reads a flattened
 * office shape from public/data/yearData.
 *
 * Other data trees such as timelineData and districtsData are copied through
 * directly.
 *
 * Optional environment variables:
 * - BUILD_DATA_ROOT=/abs/path overrides ../../build/data
 * - PUBLIC_DATA_ROOT=/abs/path overrides ../../public/data
 * - LEGACY_TIMELINE_ROOT=/abs/path overrides ../../public/timelineData
 * - YEAR_DATA_MODE=map|raw controls whether flattened yearData prefers
 *   adjusted-for-map totals (`map`, default) or the original non-adjusted
 *   office totals (`raw`)
 */
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const buildDataRoot = process.env.BUILD_DATA_ROOT || path.join(repoRoot, 'build', 'data');
const publicDataRoot = process.env.PUBLIC_DATA_ROOT || path.join(repoRoot, 'public', 'data');
const legacyTimelineRoot = process.env.LEGACY_TIMELINE_ROOT || path.join(repoRoot, 'public', 'timelineData');
const yearDataMode = process.env.YEAR_DATA_MODE || 'map';

const passthroughDirs = ['timelineData', 'districtsData', 'indianLandsYearData', 'yearGeojson'];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirContents(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirContents(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function pickBoundaryForYear(boundaries, year, state) {
  if (!Array.isArray(boundaries) || boundaries.length === 0) {
    return null;
  }
  if (['IL', 'IN', 'MS', 'OH'].includes(state)) {
    return boundaries[0];
  }
  return boundaries.find((boundary) => boundary.tile_id && boundary.tile_id.slice(-8) >= `${year}0630`) || null;
}

function pickMetrics(dataEntries) {
  if (!Array.isArray(dataEntries) || dataEntries.length === 0) {
    return null;
  }
  if (yearDataMode === 'raw') {
    return dataEntries.find((entry) => !entry.adjustedForMap) || dataEntries[0];
  }
  return dataEntries.find((entry) => entry.adjustedForMap) || dataEntries.find((entry) => !entry.adjustedForMap) || dataEntries[0];
}

function flattenOffice(office, year) {
  if (!Array.isArray(office.office_boundaries) || !Array.isArray(office.data)) {
    return office;
  }

  const boundary = pickBoundaryForYear(office.office_boundaries, year, office.state);
  const metrics = pickMetrics(office.data);

  if (!boundary || !metrics) {
    return null;
  }

  const { adjustedForMap, ...flattenedMetrics } = metrics;
  void adjustedForMap;

  return {
    office: office.office,
    state: office.state,
    ...boundary,
    ...flattenedMetrics,
  };
}

function flattenYearDataFile(sourcePath, targetPath) {
  const year = path.basename(sourcePath, '.json');
  const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const flattenedOffices = (Array.isArray(raw.offices) ? raw.offices : [])
    .map((office) => flattenOffice(office, year))
    .filter(Boolean);

  const output = {
    offices: flattenedOffices,
    conflicts: Array.isArray(raw.conflicts) ? raw.conflicts : [],
  };

  fs.writeFileSync(targetPath, JSON.stringify(output));
}

function publishYearData() {
  const sourceDir = path.join(buildDataRoot, 'yearData');
  const targetDir = path.join(publicDataRoot, 'yearData');

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing build yearData directory: ${sourceDir}`);
  }

  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      continue;
    }
    flattenYearDataFile(path.join(sourceDir, entry.name), path.join(targetDir, entry.name));
  }
}

publishYearData();

for (const dirname of passthroughDirs) {
  copyDirContents(path.join(buildDataRoot, dirname), path.join(publicDataRoot, dirname));
}

// Keep the legacy public/timelineData tree in sync until it can be removed.
copyDirContents(path.join(buildDataRoot, 'timelineData'), legacyTimelineRoot);

console.log(`Published build data from ${buildDataRoot} to ${publicDataRoot} using YEAR_DATA_MODE=${yearDataMode}`);
