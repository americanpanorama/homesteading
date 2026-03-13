const d3 = require('d3');
const Polylabel = require('polylabel');
const st = require('geojson-bounds');
const townships = require('../../data-input/townships.json');
const joins = require('../../data-input/join_table.json');

const projection = d3.geoAlbers()
  .translate([0.5, 0.5])
  .scale(1070 / 960);
const path = d3.geoPath(projection); 

const features = townships.features.map(f => {
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
  //console.log(join);
  if (join) {
    sliverIds = join
      .sliv_array
      .replace(/[{}]/g, "")
      .split(',')
      .map(idStr => parseInt(idStr, 10));
  }

  return {
    d: path(f.geometry),
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
    gisJoin: f.properties.id, 
    id: f.properties.sh_id,
    sliverIds,
  };
}) ;



console.log(JSON.stringify(features));
