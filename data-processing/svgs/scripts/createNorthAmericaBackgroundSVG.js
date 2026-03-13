const d3 = require('d3');
const d3_composite = require("d3-composite-projections");
const rewind = require('geojson-rewind');
const northAmerica = require('../../data-input/North_America_Great_Lakes.json');

const projection = d3.geoConicEqualArea()
  .parallels([29.5, 45.5])
  .scale(1070/960 * 1024)
  .translate([512, 512])
  .rotate([96, 0])
  .center([0, 37.5]);
const path = d3.geoPath(projection); 

const features = northAmerica.features
  .map(f => {
    const detailedPath = path(rewind(f.geometry, true), true);
    const d = (detailedPath) ? detailedPath.replace(/(\d+\.\d\d\d)\d*/g, ($0,$1) => Math.round($1 * 100) / 100) : detailedPath;
    return d;
  }) ;

console.log(JSON.stringify(features));
