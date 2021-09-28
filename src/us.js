import us from 'us';

const extended = us;
const dakotaData = {
  name: "Dakota", 
  metaphones: [ "TKT" ], 
  statehood_year: null, 
  ap_abbr: "Dak.", 
  is_territory: true, 
  fips: "99", 
  abbr: "DK", 
  capital: "Bismark", 
  capital_tz: "America/Chicago",
  time_zones: ["America/Chicago"]
};

extended.TERRITORIES.push(dakotaData);
extended.STATES_AND_TERRITORIES.push(dakotaData);
extended.states.DK = new us.State(dakotaData);

export default extended;
