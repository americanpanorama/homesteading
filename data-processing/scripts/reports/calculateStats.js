/*
 * Summary report over the raw tabular township data. This is a quick sanity
 * check for aggregate claims/patents counts and a few simple year ranges.
 */
const officeData = require('../../data-input/townships_data.json');

// # of claims and patents
const numClaims = officeData.reduce((accumulator, office) => (
  (!isNaN(parseInt(office.claims_num))) ? accumulator + parseInt(office.claims_num) : accumulator
), 0);
const numPatents = officeData.reduce((accumulator, office) => (
  (!isNaN(parseInt(office.patents_num))) ? accumulator + parseInt(office.patents_num) : accumulator
), 0);

const acClaims = officeData.reduce((accumulator, office) => (
  (!isNaN(parseInt(office.claims_ac))) ? accumulator + parseInt(office.claims_ac) : accumulator
), 0);
const acPatents = officeData.reduce((accumulator, office) => (
  (!isNaN(parseInt(office.patents_ac))) ? accumulator + parseInt(office.patents_ac) : accumulator
), 0);

const acPatents8690 = officeData.reduce((accumulator, office) => (
  (office.year >= 1886 && office.year <= 1890 && !isNaN(parseInt(office.patents_ac))) ? accumulator + parseInt(office.patents_ac) : accumulator
), 0);
const acPatents9195 = officeData.reduce((accumulator, office) => (
  (office.year >= 1891 && office.year <= 1895 && !isNaN(parseInt(office.patents_ac))) ? accumulator + parseInt(office.patents_ac) : accumulator
), 0);
const acPatents0610 = officeData.reduce((accumulator, office) => (
  (office.year >= 1906 && office.year <= 1910 && !isNaN(parseInt(office.patents_ac))) ? accumulator + parseInt(office.patents_ac) : accumulator
), 0);

const maxClaims = Math.max(...officeData.map(office => office.claims_num));
const maxClaimsYear = officeData.find(office => office.claims_num === maxClaims).year;


const maxPatents = Math.max(...officeData.map(office => office.patents_num));
const maxPatentsYear = officeData.find(office => office.patents_num === maxPatents).year;

const yearData = {};
officeData.forEach(office => {
  const { year, patents_ac: patents_ac_str, patents_num: patents_num_str, claims_ac: claims_ac_str, claims_num: claims_num_str } = office;
  yearData[year] = yearData[year] || {
    numClaims: 0,
    numPatents: 0,
    acClaims: 0,
    acPatents: 0,
    success: 0,
  };

  const patents_ac = parseInt(patents_ac_str);
  const claims_ac = parseInt(claims_ac_str);
  const patents_num = parseInt(patents_num_str);
  const claims_num = parseInt(claims_num_str);

  if (!isNaN(claims_num)) {
    yearData[year].numClaims += claims_num;
  }
  if (!isNaN(patents_num)) {
    yearData[year].numPatents += patents_num;
  }
  if (!isNaN(claims_ac)) {
    yearData[year].acClaims += claims_ac;
  }
  if (!isNaN(patents_num)) {
    yearData[year].acPatents += patents_ac;
  }
});

Object.keys(yearData).forEach(year => {
  if (yearData[parseInt(year) + 5]) {
    yearData[year].success = yearData[parseInt(year) + 5].numPatents / yearData[year].numClaims;
  }
});




console.log(`    number of claims: ${numClaims.toLocaleString()}`);
console.log(`   number of patents: ${numPatents.toLocaleString()}`);
console.log(`       acres claimed: ${acClaims.toLocaleString()}`);
console.log(`      acres patented: ${acPatents.toLocaleString()}`);
console.log(`acres patented 86-90: ${acPatents8690.toLocaleString()}`);
console.log(`acres patented 91-95: ${acPatents9195.toLocaleString()}`);
console.log(`acres patented 06-10: ${acPatents0610.toLocaleString()}`);

console.log(`          max claims: ${maxClaims.toLocaleString()} (${maxClaimsYear})`);

console.log(`         max patents: ${maxPatents.toLocaleString()} (${maxPatentsYear})`);
console.log(yearData);
