/*
 * One-time patch script that merges corrected 1908-1910 Indian claims values
 * into the main township table. The merged JSON is printed to stdout so it can
 * be redirected into a new file.
 */
import fs from 'fs';
import { TownshipData } from '../../index.d';

const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../../data-input/townships_data.json', 'utf8'));
const UpdatedData: TownshipData[] = JSON.parse(fs.readFileSync('../../data-input/IndianClaims1908_1910.json', 'utf-8'));

const updatedData: TownshipData[] = TownshipsData.map(td => {
  // is there an updated version
  if (UpdatedData.find(_td => _td.office === td.office && _td.year === td.year)) {
    return UpdatedData.find(_td => _td.office === td.office && _td.year === td.year);
  }
  return td;
});

console.log(JSON.stringify(updatedData));
