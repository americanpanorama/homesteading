import fs from 'fs';
// @ts-ignore: Unreachable code error
import US from 'us';
import { TownshipFeature } from '../../index.d';
import { makeJSONFileNames } from '../../functions.js';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../../data-input/townshipssimplified.json', 'utf8'));
const townships: TownshipFeature[] = Townships.features.filter(township => (
    (process.argv.length > 2) ? US.lookup(township.properties.STATENAM).abbr === process.argv[2] : true)
  );
  //.filter((township: TownshipFeature) => township.properties.Office.includes('Cloud') && township.properties.STATENAM === 'Minnesota');

townships
  .forEach((township: TownshipFeature) => {
    const filenames = makeJSONFileNames(township);
    filenames.forEach(filename => {
      fs.writeFileSync(`../data/townshipFiles/${filename}.json`, JSON.stringify(township));
      console.log(`wrote ${filename}.json`);
    });
  });
