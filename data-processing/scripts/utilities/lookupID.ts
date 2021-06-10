const Townships = require('../../data-input/townships_data.json');

interface TownshipData {
  office: string;
  claims_ac: number | '';
  patents_ac: number | '';
  patents_num: number | '';
  claims_num: number | '';
  year: number;
  of_id: string;
  land_office: string;
  [idnums: string]: string | number;
}

const matchingTownships = (Townships as TownshipData[])
  .filter(d => d.office.includes(process.argv[2]));

const ids: TownshipData[] = [];
matchingTownships.forEach(d => {
  if (ids.length === 0 || !ids.find(d1 => d1.office === d.office)) {
    ids.push(d);
  }
});

ids.forEach(d => {
  console.log(`${d.office}: ${d.of_id}`);
});
