/*
 * One-off spreadsheet inspection helper. It opens the legacy claims workbook
 * and prints worksheet contents for manual review.
 */
const XLSX = require('xlsx');

const workbook = XLSX.readFile('../../data-input/claims.xlsx');

for (let y = 1863; y <= 1863; y++) {
  const worksheet = workbook.Sheets[y];
  console.log(worksheet);
}
