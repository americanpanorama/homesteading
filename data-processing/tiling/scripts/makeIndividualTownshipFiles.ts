import fs from 'fs';
// @ts-ignore: Unreachable code error
import US from '../../../src/us.js';
import { TownshipFeature } from '../../index.d';
import { makeJSONFileNames } from '../../functions.js';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../../data-input/townshipssimplified.json', 'utf8'));
const townships: TownshipFeature[] = Townships.features.filter(township => (
    (process.argv.length > 2) ? US.lookup(township.properties.STATENAM).abbr === process.argv[2] : true)
  );
townships.forEach(township => {
  if (township.properties.STATENAM.includes('Dakota') && township.properties.End < new Date(1889, 0, 1, 0, 0, 0).valueOf()) {
    township.properties.STATENAM = 'Dakota';
  }
})
  // .filter((township: TownshipFeature) => township.properties.Office.includes('Winn') && township.properties.STATENAM === 'Minnesota');

console.log(townships);
townships
  .forEach((township: TownshipFeature) => {
    const filenames = makeJSONFileNames(township);
    filenames.forEach(filename => {
      fs.writeFileSync(`../data/townshipFiles/${filename}.json`, JSON.stringify(township));
      console.log(`wrote ${filename}.json`);
    });
  });
