/*
 * Core pipeline script that derives first/last year ranges for each
 * state/territory and office from the canonical published timeline data.
 * The app uses the resulting lookup to know when a place is available in the UI.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataProcessingRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(dataProcessingRoot, '..');
const TIMELINE_ROOT = path.join(repoRoot, 'public/data/timelineData');
const OUTPUT_PATH = path.join(repoRoot, 'data/placesDateRanges.json');
const NATIONAL_TIMELINE_PATH = path.join(TIMELINE_ROOT, 'national.json');
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const getYearRange = (years) => ({
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
});
const nationalTimeline = readJson(NATIONAL_TIMELINE_PATH);
const stateTimelineFiles = fs.readdirSync(TIMELINE_ROOT)
    .filter(fileName => fileName.endsWith('.json') && fileName !== 'national.json')
    .map(fileName => fileName.replace(/\.json$/, ''));
const statesTerrsData = stateTimelineFiles.map((stateStub) => {
    const stateSummary = nationalTimeline.find(place => place.type === 'stateOrTerritory' && place.abbr === stateStub);
    const stateTimeline = readJson(path.join(TIMELINE_ROOT, `${stateStub}.json`));
    const offices = stateTimeline
        .filter(place => place.type === 'office')
        .filter(place => place.yearData.length > 0)
        .map((place) => ({
        stub: place.name,
        ...getYearRange(place.yearData.map(yearData => yearData.year)),
    }))
        .sort((a, b) => a.firstYear - b.firstYear || a.stub.localeCompare(b.stub));
    const stateYears = stateSummary?.yearData.map(yearData => yearData.year)
        || offices.flatMap(office => [office.firstYear, office.lastYear]);
    if (stateYears.length === 0) {
        throw new Error(`No year data found for ${stateStub}`);
    }
    return {
        stub: stateStub,
        ...getYearRange(stateYears),
        offices,
    };
}).sort((a, b) => a.firstYear - b.firstYear || a.stub.localeCompare(b.stub));
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(statesTerrsData));
