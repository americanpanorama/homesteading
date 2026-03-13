import d3 from 'd3';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('../../data-input/continentalUS.json', 'utf-8'));

export const albersProjection = d3.geoConicEqualArea()
  .scale(1070 / 960 * 1024)
  .translate([512, 512])
  .parallels([29.5, 45.5])
  .rotate([96, 0])
  .center([0, 37.5]);

export const albersPath = d3.geoPath(albersProjection);

const projected = albersPath(data);

console.log(projected);