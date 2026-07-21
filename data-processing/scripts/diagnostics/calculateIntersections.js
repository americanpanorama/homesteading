/*
 * Diagnostic script for measuring how office polygons overlap across time.
 * This appears to have been used to estimate how claims/patents should be
 * redistributed when offices changed shape or were replaced by later offices.
 */
const turf = require('@turf/turf');
const Offices = require('../../data-input/townships.json');
const OfficeData = require('../../../public/data/townships_data.json');

const getDataForOffice = (gisjoin, year) => OfficeData.find(od => od.of_id === gisjoin && od.year === year);

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
      if (office.claims_num > 0) {
        // Is the end date for the office five years from the current year?
        // If so, just find the number of patents for the office five years from this point
        if (office.end > (year + 5) * 10000) {
          const dataForOffice5Years = getDataForOffice(office.gisjoin, year + 5);
          if (dataForOffice5Years) {
            const { patents_num, patents_ac } = dataForOffice5Years;
            officesByState[state][year][idx] = {
              ...officesByState[state][year][idx],
              patents_num,
              patents_ac,
              proportion_num_patented: patents_num / officesByState[state][year][idx].claims_num,
              proportion_ac_patented: patents_ac / officesByState[state][year][idx].claims_ac,
            };
          } 
        } else if (officesByState[state][year + 5]){
          // otherwise, look for overlaps with other office in the state to get the patents proportional to the percentage of overlap
          officesByState[state][year + 5].forEach(futureOffice => {
            // calculate whether they intersect and get that intersection shape
            const intersectionGeojson = turf.intersect(office.geometry, futureOffice.geometry);
            if (intersectionGeojson) {
              const intersectionArea = turf.area(intersectionGeojson);
              if (intersectionArea > 0) {
                // calculate the intersection's proportion of the future offices area
                const proportionOfFutureOfficeArea = intersectionArea / turf.area(futureOffice.geometry);

                
                // get the data for the future office
                const dataForFutureOffice = getDataForOffice(futureOffice.gisjoin, year + 5);
                if (dataForFutureOffice) {
                  const { patents_num: total_patents_num, patents_ac: total_patents_ac } = dataForFutureOffice;
                  // calculate proportion to associate with past office and add to it's total
                  const patents_num = total_patents_num * proportionOfFutureOfficeArea + (officesByState[state][year][idx].patents_num || 0); 
                  const patents_ac = total_patents_ac * proportionOfFutureOfficeArea + (officesByState[state][year][idx].patents_ac || 0); 
                  officesByState[state][year][idx] = {
                    ...officesByState[state][year][idx],
                    patents_num,
                    patents_ac,
                    proportion_num_patented: patents_num / officesByState[state][year][idx].claims_num,
                    proportion_ac_patented: patents_ac / officesByState[state][year][idx].claims_ac,
                    patents_modeled: true,
                  };
                }
              }
            }
          });
        }
      }
    });
  });
});

// drop the geometries 
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
      delete officesByState[state][year][idx].geometry;
    });
  });
});


console.log(JSON.stringify(officesByState));

// // get the offices for ND for 1890
// const ND90 = Offices.features.filter(f => {
//   const startDate = new Date(f.properties.Start);
//   const endDate = new Date(f.properties.End);
//   const startYear = startDate.getUTCFullYear();
//   const startMonth = startDate.getUTCMonth() + 1;
//   const startDay = startDate.getUTCDate();
//   const endYear = endDate.getUTCFullYear();
//   const endMonth = endDate.getUTCMonth() + 1;
//   const endDay = endDate.getUTCDate();
//   return f.properties.STATENAM === 'North Dakota'
//     && startYear <= 1890
//     && endYear > 1890;
// });

// const ND95 = Offices.features.filter(f => {
//   const startDate = new Date(f.properties.Start);
//   const endDate = new Date(f.properties.End);
//   const startYear = startDate.getUTCFullYear();
//   const startMonth = startDate.getUTCMonth() + 1;
//   const startDay = startDate.getUTCDate();
//   const endYear = endDate.getUTCFullYear();
//   const endMonth = endDate.getUTCMonth() + 1;
//   const endDay = endDate.getUTCDate();
//   return f.properties.STATENAM === 'North Dakota'
//     && startYear <= 1895
//     && endYear > 1895;
// });


// ND90.forEach((officeClaim, idx) => {
//   const startDate = new Date(ND90[idx].properties.Start);
//   const endDate = new Date(ND90[idx].properties.End);
//   const startYear = startDate.getUTCFullYear();
//   const startMonth = startDate.getUTCMonth() + 1;
//   const startDay = startDate.getUTCDate();
//   const endYear = endDate.getUTCFullYear();
//   const endMonth = endDate.getUTCMonth() + 1;
//   const endDay = endDate.getUTCDate();
//   ND90[idx].properties = {
//     ...ND90[idx].properties,
//     startYear,
//     startMonth,
//     startDay,
//     endYear,
//     endMonth,
//     endDay,


//   }
//   ND90[idx].properties.intersections = ND90[idx].properties.intersections || [];

//   const officeClaimArea = turf.area(officeClaim.geometry);
//   ND95.forEach((officePatent, opIdx) => {
//     const officePatentArea = turf.area(officePatent.geometry);
//     // calculate the interesection
//     const intersectionGeojson = turf.intersect(officeClaim.geometry, officePatent.geometry);
//     if (intersectionGeojson) {
//       const intersectionArea = turf.area(intersectionGeojson);
//       const percentOfOfficeClaim = Math.round(intersectionArea / officeClaimArea * 10000) / 10000;
//       const percentOfOfficePatents = Math.round(intersectionArea / officePatentArea * 10000) / 10000;  
//       if (intersectionArea > 0 && percentOfOfficeClaim > 0 && percentOfOfficePatents > 0) {
//         const intersection = {
//           geojson: intersectionGeojson,
//           intersectionArea,
//           percentOfOfficeClaim: Math.round(intersectionArea / officeClaimArea * 10000) / 10000,
//           percentOfOfficePatents: Math.round(intersectionArea / officePatentArea * 10000) / 10000,
//           office: officePatent.properties.Office,
//           gisJoin: officePatent.properties.GISJOIN,
//         };
//       ND90[idx].properties.intersections.push(intersection);
//       }
//     }
//   });
// });

//console.log(JSON.stringify(ND90));
