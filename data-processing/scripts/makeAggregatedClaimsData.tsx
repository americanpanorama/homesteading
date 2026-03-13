// for the Indian Country map on the Indigenous Disposession explanation
import fs from 'fs';
import US from '../../src/us.js';
import { TownshipData } from '../index.d';

interface TotalStateClaims {
    state?: string;
    acresClaimed?: number;
    point?: [number, number];
    radius?: number;
}

const TownshipsData: TownshipData[] = JSON.parse(fs.readFileSync('../data-input/townships_data.json', 'utf8'));

const aggregatedStateData: TotalStateClaims[] = [];
TownshipsData.forEach(d => {
    const state = (d.office.includes('GLO') && US.lookup(d.office.replace('(GLO)', ''))) ? US.lookup(d.office.replace('(GLO)', '')).abbr : d.office.slice(-2);
    const idx = aggregatedStateData.findIndex(d1 => d1.state === state);
    if (idx === -1) {
        aggregatedStateData.push({
            state,
            acresClaimed: parseInt(d.claims_ac.toString()),
        });
    } else {
        aggregatedStateData[idx].acresClaimed += parseInt(d.claims_ac.toString());
    }
});

console.log(JSON.stringify(aggregatedStateData));