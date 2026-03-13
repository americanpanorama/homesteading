const turf = require('@turf/turf');
const Offices = require('../data-input/townships.json');
const OfficeData = require('../../public/data/townships_data.json');

const getDataForOffice = (gisjoin, year) => OfficeData.find(od => od.of_id === gisjoin && od.year === year);

const intersections = [];

// sort the offices into an array of states
const officesByState = {};
Offices.features.forEach(office => {
  const { STATENAM: stateName, Start: startTimestamp, End: endTimestamp, id: gisjoin, Office: location } = office.properties;
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);
  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth() + 1;
  const startDay = startDate.getUTCDate();
  const endYear = endDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth() + 1;
  const endDay = endDate.getUTCDate();
  const endYearToUse = (endMonth === 12 && endDay === 31) ? endYear : endYear - 1;
  officesByState[stateName] = officesByState[stateName] || {};
  for (let y = startYear; y <= endYearToUse; y++) {
    officesByState[stateName][y] = officesByState[stateName][y] || [];

    // find the claims data
    const dataForOffice = getDataForOffice(gisjoin, y);
    let claims_num = 0;
    let claims_ac = 0;
    if (dataForOffice) {
      ({ claims_num, claims_ac } = dataForOffice);
    }

    officesByState[stateName][y].push({
      geometry: office.geometry,
      location,
      gisjoin,
      start: startYear * 10000 + startMonth * 100 + startDay,
      end: endYear * 10000 + endMonth * 100 + endDay,
      claims_num,
      claims_ac,
    });
  }
});

// iterate over each state and year
Object.keys(officesByState).forEach(state => {
  // make a list of years 
  const years = Object.keys(officesByState[state])
    .map(yStr => parseInt(yStr))
    .sort((a, b) => b - a);

  // iterate over the years
  years.forEach(year => {
    // iterate over each office
    officesByState[state][year].forEach((office, idx) => {
      // see if iteracts with any offices later in the array
      officesByState[state][year].slice(idx + 1, 10000).forEach(otherOffice => {
        // calculate whether they intersect and get that intersection shape
        const intersectionGeojson = turf.intersect(office.geometry, otherOffice.geometry);
        if (intersectionGeojson) {
          const intersectionArea = turf.area(intersectionGeojson);
          if (intersectionArea > 100000) {
            // calculate the intersection's proportion of the future offices area

            // get the polygon
            const geometry = (intersectionGeojson.geometry.type === 'GeometryCollection')
            ? intersectionGeojson.geometry.geometries.find(g => g.type === 'Polygon')
            : intersectionGeojson.geometry;
            intersections.push({
              type: 'Feature',
              geometry,
              properties: {
                year,
                intersectionArea,
                office1: office.location,
                office2: otherOffice.location,
                gisjoin1: office.gisjoin,
                gisjoin2: otherOffice.gisjoin,
                office1Start: office.start,
                office2Start: otherOffice.start,
                office1End: office.end,
                office2End: otherOffice.end,
              }
            });
          }
        }
      });
    });
  });
});


console.log(JSON.stringify({
  type: "FeatureCollection",
  features: intersections
}));
