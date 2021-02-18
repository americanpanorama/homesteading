import { createSelector } from 'reselect';
import * as d3 from 'd3';

import slivers from '../../public/data/slivers.json';
import COGeojson from '../../public/data/CO_Townships.json';
import TownshipsData from '../../public/data/townships_data.json';

import sliversSVG from '../../public/data/sliversSVG.json';
import officesSVG from '../../public/data/officesSVG.json';
import reservationsSVG from '../../public/data/reservationsSVG.json';
import TileTree from '../../public/data/tileTree.json';

const getSelectedYear = state => state.selectedYear;
const getMapDimensions = state => state.dimensions.map;
const getMapPosition = state => state.mapPosition;

const colorRamp = d3.scaleLinear()
    .domain([0, 1])
    .range(["green", "violet"]);


export const getMapParameters = createSelector(
  [getMapDimensions, getMapPosition],
  (mapDimensions, mapPosition) => {
    const params = {};

    const { width, height } = mapDimensions;
    const scale = width * Math.pow(2, mapPosition.z);
    const tileZ = Math.ceil(Math.log2(scale / 256));
    const tileWidth = 256 * (scale/ (256 * Math.pow(2, tileZ)));
    const maxSide = Math.max(width, height);
    const fullMapLongside= maxSide * Math.pow(2, mapPosition.z);
    const translateX = Math.min(0, (width - height) / 2) - (fullMapLongside / 2 - maxSide / 2);
    const translateY = Math.min(0, (height - width) / 2) - (fullMapLongside / 2 - maxSide / 2);

    return {
      width,
      height,
      scale,
      tileZ,
      tileWidth,
      translateX,
      translateY,
    };
  }
);

export const getOfficePolygonsForYear = createSelector(
  [getSelectedYear],
  (selectedYear) => {
    return officesSVG
      .filter(f => {
        const selectedYearNum = selectedYear * 1000 + 1231;
        const startNum = f.startYear * 1000 + f.startMonth * 100 + f.startDay;
        const endNum = f.endYear * 1000 + f.endMonth * 100 + f.endDay;
        return startNum <= selectedYearNum && endNum >= selectedYearNum;
      })
      .map(f => {
        const dataForYear = TownshipsData.find(yd => {
          return yd.of_id ===  f.gisJoin && yd.year === selectedYear;
        });
        const dataForEndYear = TownshipsData.find(yd => {
          return yd.of_id ===  f.gisJoin && yd.year === selectedYear + 5;
        });
        //console.log(f, dataForYear);
        if (dataForYear && dataForEndYear) {
          //f.fill = getFillColor(dataForYear.claims_ac / f.area);
          f.fillOpacity = dataForYear.claims_ac / f.area * 20;
          console.log(dataForEndYear.patents_ac / dataForYear.claims_ac);
          f.fill = colorRamp(dataForEndYear.patents_ac / dataForYear.claims_ac);
        } 
        return f;
      });
  }
);

export const getReservationsPolygonsForYear = createSelector(
  [getSelectedYear],
  (selectedYear) => {
    return reservationsSVG.filter(f => {
      const selectedYearNum = selectedYear * 1000 + 1231;
      const startNum = f.startYear * 1000 + f.startMonth * 100 + f.startDay;
      const endNum = f.endYear * 1000 + f.endMonth * 100 + f.endDay;
      return startNum <= selectedYearNum && endNum >= selectedYearNum;
    });
  }
);

export const getTownshipTiles = createSelector(
  [getMapParameters, getMapPosition, getOfficePolygonsForYear],
  (mapParameters, mapPosition, officePolygonsForYear) => {
    const { width, height, tileZ, tileWidth, translateX, translateY} = mapParameters;
    const officeIds = officePolygonsForYear.map(o => o.id);

    const fullDimension = Math.max(width, height) * Math.pow(2, mapPosition.z);

    // calculate the visible xs on the canvas--those that aren't to the left or right of the viewbox
    const xs = [...Array(fullDimension / tileWidth).keys()]
      .filter(x => x * 256 > -1 * translateX - 256 && x * 256 < -1 * translateX + width + 512);

    const tiles = [];
    Object.keys(TileTree)
      .filter(shId => officeIds.includes(parseInt(shId)))
      .forEach(shId => {
        Object.keys(TileTree[shId])
          .filter(zIdx => parseInt(zIdx, 10) === tileZ)
          .forEach(zIdx => {
            Object.keys(TileTree[shId][zIdx])
              .map(xStr => parseInt(xStr, 10))
              .filter(xIdx => xs.includes(xIdx))
              .forEach(xIdx => {
                TileTree[shId][zIdx][xIdx]
                  .forEach(yIdx => {
                    tiles.push({
                      xlinkHref: `//s3.amazonaws.com/dsl-general/homesteading/${shId}/${zIdx}/${xIdx}/${yIdx}.png`,
                      x: xIdx,
                      y: yIdx,
                      key: `tile-${shId}-${zIdx}-${xIdx}-${yIdx}`,
                    });
                  });
              });
          });
      });

    return tiles;
  }
);

export function getGeojsonForYear(state) {
  const { selectedYear: year} = state;
  const features = COGeojson.features.filter(f => f.properties.startYear <= year && f.properties.endYear >= year);
  return features.map(f => {
    const dataForYear = TownshipsData.find(yd => yd.of_id === f.properties.id && yd.year === year);
    if (dataForYear) {
      f.properties.claims = dataForYear.claims;
      f.properties.claims_ac = dataForYear.claims_ac;
      f.properties.patents = dataForYear.patents;
      f.properties.patents_ac = dataForYear.patents_ac;
      //f.properties.fillOpacity = Math.min(1, dataForYear.claims_ac * 20 / f.properties.area) * 0.5 + 0.5;
      f.properties.fill = getColor(Math.min(1, dataForYear.claims_ac * 20 / f.properties.area));
      f.properties.fillOpacity = 0.5;
    } else {
      f.properties.fillOpacity = 0;
      f.properties.fill = getColor(0);
    }
    return f;
  });
};

export function getStyledPolygonsForYear(state) {
  const { selectedYear: year } = state;
  const features = slivers.features;
  //const officesGeojson = getGeojsonForYear(state);
  const officeFeatures = officesSVG.filter(f => f.startYear <= year && f.endYear >= year);
  return features.map(f => {
    f.fillOpacity = 0;
    f.fill = getColor(0);
    const officeFeature = officeFeatures.find(ogj => {
      return ogj.sliverIds.includes(f.id);
    });
    if (officeFeature && officeFeature.id) {
      const dataForYear = TownshipsData.find(yd => {
        return yd.of_id ===  officeFeature.id && yd.year === year;
      });
      if (dataForYear) {
        console.log(dataForYear.claims_ac * 20 / officeFeature.area);
        //f.fill = getFillColor(dataForYear.claims_ac / officeFeature.area);
        f.fillOpacity = 1;
      } 
    }
    return f;
  });
}

export function getTileURLsForYear(state) {
  const { selectedYear: year} = state;
  const features = COGeojson.features.filter(f => f.properties.startYear < year && f.properties.endYear >= year);
  return features.map(f => ({
    url: `https://s3.amazonaws.com/dsl-general/homesteads/tiles/${f.properties.id}_${f.properties.startYear}_${f.properties.endYear}/{z}/{x}/{y}.png`,
    bounds: f.properties.bounds
  }));
};

export function getTotalClaimsByYear() {
  const yearsData = {};
  TownshipsData.forEach(yd => {
    yearsData[yd.year] = yearsData[yd.year] || {
      claims_ac : 0,
      patents_ac: 0,
    };
    if (yd.claims_ac && !isNaN(parseFloat(yd.claims_ac))) {
      yearsData[yd.year].claims_ac += parseFloat(yd.claims_ac);
    }
    if (yd.patents_ac && !isNaN(parseFloat(yd.patents_ac))) {
      yearsData[yd.year].patents_ac += parseFloat(yd.patents_ac);
    }
  });
  return Object.keys(yearsData)
    .sort()
    .map(year => ({
      year: parseInt(year, 10),
      claims_ac: yearsData[year].claims_ac,
      patents_ac: yearsData[year].patents_ac,
    }));
}

function getFillColor(weight) {
  const rScale = d3.scaleLinear()
    .domain([0, 0.001, 0.01, 0.02, 0.04, 0.9, 0.15, 1])
    .range([244, 234, 219, 196, 181, 159, 138, 138]);
  const gScale = d3.scaleLinear()
    .domain([0, 0.001, 0.01, 0.02, 0.04, 0.9, 0.15, 1])
    .range([223, 197, 164, 129, 97, 65, 48, 48]);
  const bScale = d3.scaleLinear()
    .domain([0, 0.001, 0.01, 0.02, 0.04, 0.9, 0.15, 1])
    .range([184, 136, 101, 79, 64, 45, 33, 33]);

  return `rgb(${rScale(weight)},${gScale(weight)},${bScale(weight)}`;
}

function getColor(weight) {
  if (isNaN(weight) || weight == null) {
    return '#909EAC';
  }
  var color1 = [38, 50, 56],
    color2 = [159, 168, 218],
    scale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, 1]);

  var p = scale(weight);
  var w = p * 2 - 1;
  var w1 = (w/1+1) / 2;
  var w2 = 1 - w1;
  var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
  return 'rgb(' + rgb + ')';
};

export const getPolygonsForYear = createSelector(
  [getSelectedYear, getOfficePolygonsForYear],
  (selectedYear, officesForYear) => {
    return sliversSVG.map(f => {
      f.fillOpacity = 0.2;
      f.fill = 'green';
      const office = officesForYear.find(ogj => {
        return ogj.sliverIds.includes(f.id);
      });
      if (office && office.gisJoin) {
        const dataForYear = TownshipsData.find(yd => {
          return yd.of_id ===  office.gisJoin && yd.year === selectedYear;
        });
        if (dataForYear) {
          //f.fill = getFillColor(dataForYear.claims_ac / office.area);
          //f.fill = 'purple';
          //f.fillOpacity = 0.6;
          //f.fillOpacity = (dataForYear.claims_ac / office.area) * 30;
        } 
      }
      return f;
    });
  }
);
