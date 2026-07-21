/**
 * Audits data/placesDateRanges.json against the canonical published timeline
 * data under public/data/timelineData.
 *
 * It exits non-zero when ranges drift from the published timeline data so it
 * can be used as a post-regeneration guardrail.
 */
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');
const placesPath = path.join(repoRoot, 'data/placesDateRanges.json');
const timelineRoot = path.join(repoRoot, 'public/data/timelineData');

const normalize = (value) => String(value || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const getYearRange = (years) => ({
  firstYear: Math.min(...years),
  lastYear: Math.max(...years),
});

const ranges = readJson(placesPath);
const national = readJson(path.join(timelineRoot, 'national.json'));

const stateIssues = [];
const officeIssues = [];

for (const stateRange of ranges) {
  const stateFile = path.join(timelineRoot, `${stateRange.stub}.json`);
  if (!fs.existsSync(stateFile)) {
    stateIssues.push({
      state: stateRange.stub,
      issue: 'missing_timeline_file',
    });
    continue;
  }

  const stateTimeline = readJson(stateFile);
  const offices = stateTimeline.filter(place => place.type === 'office');
  const officeByNormalizedName = new Map(offices.map(office => [normalize(office.name), office]));
  const stateSummary = national.find(place => place.type === 'stateOrTerritory' && place.abbr === stateRange.stub);

  if (stateSummary?.yearData?.length) {
    const expectedStateRange = getYearRange(stateSummary.yearData.map(yearData => yearData.year));
    if (
      expectedStateRange.firstYear !== stateRange.firstYear
      || expectedStateRange.lastYear !== stateRange.lastYear
    ) {
      stateIssues.push({
        state: stateRange.stub,
        issue: 'state_range_mismatch',
        expected: expectedStateRange,
        actual: {
          firstYear: stateRange.firstYear,
          lastYear: stateRange.lastYear,
        },
      });
    }
  }

  for (const officeRange of stateRange.offices) {
    const timelineOffice = officeByNormalizedName.get(normalize(officeRange.stub));
    if (!timelineOffice) {
      officeIssues.push({
        state: stateRange.stub,
        office: officeRange.stub,
        issue: 'missing_in_timeline',
      });
      continue;
    }

    const expectedOfficeRange = getYearRange(timelineOffice.yearData.map(yearData => yearData.year));
    if (
      timelineOffice.name !== officeRange.stub
      || expectedOfficeRange.firstYear !== officeRange.firstYear
      || expectedOfficeRange.lastYear !== officeRange.lastYear
    ) {
      officeIssues.push({
        state: stateRange.stub,
        office: officeRange.stub,
        issue: 'range_or_name_mismatch',
        expected: {
          name: timelineOffice.name,
          ...expectedOfficeRange,
        },
        actual: {
          name: officeRange.stub,
          firstYear: officeRange.firstYear,
          lastYear: officeRange.lastYear,
        },
      });
    }
  }

  for (const office of offices) {
    const officeRange = stateRange.offices.find(range => normalize(range.stub) === normalize(office.name));
    if (!officeRange) {
      officeIssues.push({
        state: stateRange.stub,
        office: office.name,
        issue: 'missing_in_ranges',
        expected: getYearRange(office.yearData.map(yearData => yearData.year)),
      });
    }
  }
}

const summary = {
  stateIssueCount: stateIssues.length,
  officeIssueCount: officeIssues.length,
  stateIssues,
  officeIssues,
};

console.log(JSON.stringify(summary, null, 2));

if (stateIssues.length > 0 || officeIssues.length > 0) {
  process.exitCode = 1;
}
