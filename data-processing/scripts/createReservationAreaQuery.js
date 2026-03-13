const startYear = 1862;
const endYear = 1914;

const queries = [...Array(endYear - startYear + 1).keys()]
  .map(n => n + startYear)
  .map(y => `SELECT ${y} as year, st_area(st_makevalid(st_union(st_makevalid(the_geom_webmercator)))) * 0.3048 ^ 2 sqm FROM digitalscholarshiplab.reservation_1 where date_start < '${y}-12-31' and date_end >= '${y}-12-31'`);

console.log(queries.join(' union '));
