const d3 = require('d3');
const slivers = require('../../data-input/slivers_simplfied.json');

const projection = d3.geoAlbers()
  .translate([0.5, 0.5])
  .scale(1070 / 960);
const path = d3.geoPath(projection); 

const features = slivers.features.map((f, i) => {
  const geometry = {
    type: 'Polygon',
    coordinates: f.geometry.coordinates, // [f.geometry.coordinates[0][0].reverse()],
  }
  return {
    d: path(geometry),
    id: f.properties.sliv_id,
  };
});


console.log(JSON.stringify(features));
