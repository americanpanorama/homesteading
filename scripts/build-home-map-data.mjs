import fs from 'fs';
import path from 'path';

const START_YEAR = 1863;
const END_YEAR = 1912;
const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, index) => START_YEAR + index);
const yearDataDir = path.join(process.cwd(), 'public', 'data', 'yearData');
const outputPath = path.join(process.cwd(), 'public', 'static', 'homeMapClaims.json');

const officesByKey = new Map();

for (const year of years) {
  const yearDataPath = path.join(yearDataDir, `${year}.json`);
  const yearData = JSON.parse(fs.readFileSync(yearDataPath, 'utf8'));

  for (const office of yearData.offices || []) {
    const key = `${office.state}-${office.office}`;
    if (!officesByKey.has(key)) {
      officesByKey.set(key, {
        office: office.office,
        state: office.state,
        d: office.d,
        values: Array(years.length).fill(0),
      });
    }

    const claimsPercent = office.area ? (office.acres_claimed || 0) / office.area : 0;
    officesByKey.get(key).values[year - START_YEAR] = Math.round(claimsPercent * 100000) / 100000;
  }
}

const payload = {
  years,
  offices: [...officesByKey.values()],
};

fs.writeFileSync(outputPath, JSON.stringify(payload));
console.log(`Wrote ${payload.offices.length} offices to ${outputPath}`);
