import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const defaultStates = ['AL', 'MI', 'FL', 'LA'];
const states = process.argv.slice(2).map(state => state.toUpperCase());
const statesToCount = states.length > 0 ? states : defaultStates;

const townshipDataPath = path.join(projectRoot, 'data-processing/townships_data_cleaned.json');
const aggregateDataPath = path.join(projectRoot, 'data/aggregatedClaims.json');

const townshipData = JSON.parse(fs.readFileSync(townshipDataPath, 'utf8'));
const aggregateData = fs.existsSync(aggregateDataPath)
  ? JSON.parse(fs.readFileSync(aggregateDataPath, 'utf8'))
  : [];

const formatNumber = value => value.toLocaleString('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const results = statesToCount.map(state => {
  const rows = townshipData.filter(row => row.state === state);
  const offices = new Set(rows.map(row => `${row.office}, ${row.state}`));
  const years = new Set(rows.map(row => row.year));
  const acresClaimed = rows.reduce((total, row) => total + (Number(row.acres_claimed) || 0), 0);
  const claims = rows.reduce((total, row) => total + (Number(row.claims) || 0), 0);
  const aggregate = aggregateData.find(row => row.state === state);

  return {
    state,
    acresClaimed,
    claims,
    sourceRows: rows.length,
    offices: offices.size,
    years: years.size,
    aggregateAcresClaimed: aggregate?.acresClaimed ?? null,
  };
});

const tableRows = results.map(result => ({
  State: result.state,
  'Acres claimed': formatNumber(result.acresClaimed),
  Claims: result.claims.toLocaleString('en-US'),
  'Source rows': result.sourceRows.toLocaleString('en-US'),
  Offices: result.offices.toLocaleString('en-US'),
  Years: result.years.toLocaleString('en-US'),
  'Existing aggregate acres': result.aggregateAcresClaimed === null
    ? ''
    : result.aggregateAcresClaimed.toLocaleString('en-US'),
}));

console.table(tableRows);

const grandTotal = results.reduce((total, result) => total + result.acresClaimed, 0);
console.log(`\nTotal acres claimed: ${formatNumber(grandTotal)}`);
