const fs = require('fs');

// get the files from ../../../public/data/yearData
const dataDir = '../../../public/data/yearData';
const files = fs.readdirSync(dataDir);

const statsByYear = [];


files
  .filter((file) => {
    if (!file.endsWith('.json')) return false;
    const year = file.replace('.json', '');
    return !isNaN(parseInt(year, 10)) && parseInt(year, 10) >= 1863 && parseInt(year, 10) <= 1912;
  })
  .forEach((file) => {
    if (file.endsWith('.json')) {
      const year = file.replace('.json', '');
      const filePath = `${dataDir}/${file}`;
      const rawData = fs.readFileSync(filePath);
      const yearData = JSON.parse(rawData);

      yearData.offices.forEach((offices) => {
        const percentClaim = Math.round(offices.acres_claimed * 1000 / offices.area) / 1000;
        const percentPatented = Math.round(offices.acres_patented * 1000 / offices.area) / 1000;
        statsByYear.push({
          year: parseInt(year, 10),
          percent_claimed: percentClaim,
          percent_patented: percentPatented,
        });
      });
    }
  });


const claimCounts = new Map();
const patentCounts = new Map();

for (const stat of statsByYear) {
  if (Number.isFinite(stat.percent_claimed) && stat.percent_claimed > 0) {
    const key = Math.round(stat.percent_claimed * 1000); // thousandths as int
    claimCounts.set(key, (claimCounts.get(key) ?? 0) + 1);
  }

  if (Number.isFinite(stat.percent_patented) && stat.percent_patented > 0) {
    const key = Math.round(stat.percent_patented * 1000);
    patentCounts.set(key, (patentCounts.get(key) ?? 0) + 1);
  }
}

// Convert to arrays sorted by key
const claimsBins = [...claimCounts.entries()]
  .map(([k, count]) => ({ key: k, percent: k / 1000, count }))
  .sort((a, b) => a.key - b.key);

const patentBins = [...patentCounts.entries()]
  .map(([k, count]) => ({ key: k, percent: k / 1000, count }))
  .sort((a, b) => a.key - b.key);




// find max count for scaling
const maxCount = Math.max(...claimsBins.filter(bin => !isNaN(bin.percent) && bin.percent > 0).map(d => d.count));
const MAX_BAR_WIDTH = 40;

console.log('\nClaims Percent Distribution:\n');
claimsBins
  .filter(bin => !isNaN(bin.percent) && bin.percent > 0)
  .forEach(bin => {
    
    const barLength = Math.round((bin.count / maxCount) * MAX_BAR_WIDTH);
    const bar = "█".repeat(barLength);

    console.log(
      `${(bin.percent * 100).toFixed(1).padStart(6)}% | ${bar} ${bin.count}`
    );
  });

const patentMaxCount = Math.max(...patentBins.filter(bin => !isNaN(bin.percent) && bin.percent > 0).map(d => d.count));

console.log('\nPatent Percent Distribution:\n');
patentBins
  .filter(bin => !isNaN(bin.percent) && bin.percent > 0)
  .forEach(bin => {
    
    const barLength = Math.round((bin.count / patentMaxCount) * MAX_BAR_WIDTH);
    const bar = "█".repeat(barLength);

    console.log(
      `${(bin.percent * 100).toFixed(1).padStart(6)}% | ${bar} ${bin.count}`
    );
  });
