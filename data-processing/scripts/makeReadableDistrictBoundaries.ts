import fs from 'fs';
import { TownshipFeature, ProjectedTownship } from '../index.d';
import { project, makeJSONFileNames, getOfficeNameFromStub } from '../functions.js';
const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../data-input/townshipssimplified.json', 'utf8'));

const projectedTownships: ProjectedTownship[] = [];

Townships.features.forEach(township => {
  const tile_ids = makeJSONFileNames(township);
  tile_ids.forEach(tile_id => {
    const [stateAbbr, officeStub, startYearStr, endYearStr] = tile_id.split('-');
    const idx = projectedTownships.findIndex(d => d.office === officeStub && d.state === stateAbbr);
    if (idx === -1) {
      projectedTownships.push({
        office: getOfficeNameFromStub(officeStub, stateAbbr),
        state: stateAbbr,
        data: [],
        office_boundaries: [{
          ...project(township),
          tile_id,
        }]
      })
    } else {
      projectedTownships[idx].office_boundaries.push({
        ...project(township),
        tile_id
      });
    }
  });
});

fs.writeFileSync('./readableSpatialData.json', JSON.stringify(projectedTownships));