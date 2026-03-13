const Polylabel = require('polylabel');
const st = require('geojson-bounds');
const COGeojson = require('./CO_Townships.json');
const joins = require('./join_table.json');

const features = COGeojson.features.map(f => {
  const startDate = new Date(f.properties.Start);
  const endDate = new Date(f.properties.End);
  // calculate the label position
  let labelCoords = Polylabel(f.geometry.coordinates, 1);
  labelCoords = [labelCoords[1], labelCoords[0]].map(c => Math.round(c * 1000) / 1000);
  const extent = st.extent(f.geometry);
  const bounds =[[extent[1], extent[0]], [extent[3], extent[2]]];
  let coordinates = f.geometry.coordinates;
  if (f.geometry.coordinates[0].length >= 8) {
    coordinates = [
      f.geometry.coordinates[0].map(coord => [
        Math.round(coord[0] * 1000) / 1000,
        Math.round(coord[1] * 1000) / 1000,
      ])
    ];
  }
  let sliverIds = []
  const join = joins
    .find(j => j.sh_id === f.properties.sh_id);
  if (join) {
    sliverIds = join
      .sliver_array
      .replace(/[{}]/g, "")
      .split(',')
      .map(idStr => parseInt(idStr, 10));
  }
  return {
    type: "Feature",
    geometry: {
      type: f.geometry.type,
      coordinates,
    },
    properties: {
      state: f.properties.STATENAM,
      area: f.properties.Shape_Area / 4046.85642,
      office: f.properties.Office,
      startYear: startDate.getUTCFullYear(),
      startMonth: startDate.getUTCMonth() + 1,
      startDay: startDate.getUTCDate(),
      endYear: endDate.getUTCFullYear(),
      endMonth: endDate.getUTCMonth() + 1,
      endDay: endDate.getUTCDate(),
      labelCoords,
      bounds,
      id: f.properties.id,
      sliverIds,
    }
  }
}) ;

const geojson = {
  type: 'FeatureCollection',
  features,
};

console.log(JSON.stringify(geojson));
