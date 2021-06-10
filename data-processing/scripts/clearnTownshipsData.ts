const fs = require('fs');
const newData = require('../data-input/townships_data2.json');
const oldData = require('../data-input/townships_data.json');

interface Data {
  office: string;
  claims_num: number;
  claims_ac: number;
  patents_num: number;
  patents_ac: number;
  year: number;
  of_id?: string;  
}

interface CleanedData {
  office: string;
  state: string;
  id: string;
  year: number;
  acres_claimed: number;
  acres_patented: number;
  claims: number;
  patents: number;
}


const cleanedData: CleanedData[] = (newData as Data[]).map(nd => {
  let office = nd.office.slice(0, -4);
  let state = nd.office.slice(-2);
  if (nd.office === 'Illinois (GLO)') {
    office = 'Sprinfield';
    state = 'IL';
  }
  if (nd.office.includes('Indiana (GLO')) {
    office = 'Indianapolis';
    state = 'IN';
  }
  if (nd.office.includes('Ohio (GLO')) {
    office = 'Chillicothe';
    state = 'OH';
  }
  return {
    office,
    state,
    id: (oldData as Data[]).find(od => od.office === nd.office && od.year === nd.year).of_id,
    year: nd.year,
    acres_claimed: typeof nd.claims_ac === 'number' ? nd.claims_ac : 0,
    acres_patented: typeof nd.patents_ac === 'number' ? nd.patents_ac : 0,
    claims: typeof nd.claims_num === 'number' ? nd.claims_num : 0,
    patents: typeof nd.patents_num === 'number' ? nd.patents_num : 0,
  }
}); 

fs.writeFileSync('../data-input/townships_data_cleaned.json', JSON.stringify(cleanedData));
