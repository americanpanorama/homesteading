const fs = require('fs');

// this script calculates some total values from the data, total number of claims and patents and total acreage of claims and patents for each

const dataDir = '../../public/data/yearGeojson';

// loop through all the json files in the data directory, load the json, and calculate the totals
let claims = 0;
let patents = 0;
let claimAcreage = 0;
let patentAcreage = 0;
const claimsPerYear = {};
const patentsPerYear = {};
const patentAcreagePerYear = {};

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(`${dataDir}/${file}`));
    data.features.forEach(feature => {
      const { claims: featureClaims, patents: featurePatents, acres_claimed: featureAcresClaimed, acres_patented: featureAcresPatented } = feature.properties;
      const _featureAcresClaimed = parseFloat(featureAcresClaimed);
      claims += featureClaims;
      patents += featurePatents;
      claimAcreage += _featureAcresClaimed;
      patentAcreage += featureAcresPatented;
      const year = parseInt(file.replace('.json', ''));
      if (!claimsPerYear[year]) {
        claimsPerYear[year] = 0;
      }
      claimsPerYear[year] += featureClaims;
      if (!patentsPerYear[year]) {
        patentsPerYear[year] = 0;
      }
      patentsPerYear[year] += featurePatents;
      if (!patentAcreagePerYear[year]) {
        patentAcreagePerYear[year] = 0;
      }
      patentAcreagePerYear[year] += featureAcresPatented;
    });
  }
});


console.log(`Total claims: ${claims}`);
console.log(`Total patents: ${patents}`);
console.log(`Total claim acreage: ${claimAcreage}`);
console.log(`Total patent acreage: ${patentAcreage}`);

console.log('Claims per year:', claimsPerYear);
console.log('Patents per year:', patentsPerYear);
console.log('Patent acreage per year:', patentAcreagePerYear);