import * as React from 'react';
import * as d3 from 'd3';
import { DimensionsContext } from './DimensionsContext';
import { TimelineYearPlaceData, TimelineYearPlaceDataWithStats, Dimensions, ClaimsAndPatentsAcresType } from './index.d';
import { YTick } from './components/LandOffice/BarCharts/types';
import { heatmapGradientColors, colors } from './Constants';

export const getTotalClaims = (d: TimelineYearPlaceData): number => d.claims + d.claims_indian_lands;

export const getTotalAcresClaimed = (d: TimelineYearPlaceData): number => d.acres_claimed + d.acres_claimed_indian_lands;

export const getTotalPatents = (d: TimelineYearPlaceData): number => d.patents + d.patents_indian_lands + d.commutations_2301 + d.commutations_18800615 + d.commutations_indian_lands;

export const numberOfPatentTypes = (d: TimelineYearPlaceData): number => [d.patents, d.patents_indian_lands, d.commutations_2301, d.commutations_18800615, d.commutations_indian_lands].filter(num => num > 0).length;

export const calculateDistrictYearStats = (d: TimelineYearPlaceData): TimelineYearPlaceDataWithStats => ({
  ...d,
  total_claims: getTotalClaims(d),
  total_acres_claimed: Math.round(getTotalAcresClaimed(d)),
  area_claimed_percent: Math.round(getTotalAcresClaimed(d) / d.area * 10000) / 100,
  claims_federal_lands_percent: Math.round(d.claims / getTotalClaims(d) * 1000) / 10,
  claims_indian_lands_percent: Math.round(d.claims_indian_lands / getTotalClaims(d) * 1000) / 10,
  patents_federal_lands_percent: Math.round(d.patents / getTotalPatents(d) * 1000) / 10,
  patents_indian_lands_percent: Math.round(d.patents_indian_lands / getTotalPatents(d) * 1000) / 10,
  total_patents: getTotalPatents(d),
  total_patents_residency: d.patents + d.patents_indian_lands,
  total_patents_commutations: d.commutations_2301 + d.commutations_18800615 + d.commutations_indian_lands,
  total_patents_commutations_percent: Math.round((d.commutations_2301 + d.commutations_18800615 + d.commutations_indian_lands) / getTotalPatents(d) * 1000) / 10,
  total_patents_residency_percent: Math.round((d.patents + d.patents_indian_lands) / getTotalPatents(d) * 1000) / 10,
  number_of_patent_types: numberOfPatentTypes(d),
});

export const yOffsetFromBottom = (offsets: number[]): number => {
  const { chartBodyHeight } = (React.useContext(DimensionsContext) as Dimensions).officeBarchartDimensions;
  return chartBodyHeight - offsets.reduce((acc, curr) => acc + curr, 0)
};

export const barHeightFunction = (maxValue: number) => {
  const { chartBodyHeight } = (React.useContext(DimensionsContext) as Dimensions).officeBarchartDimensions;
  return d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([0, chartBodyHeight]);
}

export const getYTickValue = (value: number, maxValue: number): YTick => {
  let label = Math.round(value).toLocaleString();
  const barHeight = barHeightFunction(maxValue);
  if (value >= 100000) {
    label = `${Math.round(value / 1000).toLocaleString()}K`;
  }
  if (value < 100000 && value >= 1000) {
    label = `${(Math.round(value / 100) / 10).toLocaleString()}K`;
  }
  return {
    value,
    label,
    y: yOffsetFromBottom([barHeight(value)]),
  }
}

export const getYTicks = (maxValue: number): YTick[] => {
  let yTicks: YTick[] = [];
  const base10 = Math.floor(Math.log10(maxValue));
  const baseMax = maxValue / Math.pow(10, base10) * 1.1;
  if (baseMax < 1.5) {
    yTicks = [0.25, 0.5, 0.75, 1, 1.25, 1.5]
      .filter(x => x <= baseMax)
      .map(x => getYTickValue(x * Math.pow(10, base10), maxValue));
  } else if (baseMax < 3.6) {
    yTicks = [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
      .filter(x => x <= baseMax)
      .map(x => getYTickValue(x * Math.pow(10, base10), maxValue));
  } else if (baseMax < 7.1) {
    yTicks = [1, 2, 3, 4, 5, 6, 7]
      .filter(x => x <= baseMax)
      .map(x => getYTickValue(x * Math.pow(10, base10), maxValue));
  } else  {
    yTicks = [2, 4, 6, 8]
      .filter(x => x <= baseMax)
      .map(x => getYTickValue(x * Math.pow(10, base10), maxValue));
  } 
  return yTicks;
};

export const colorGradient = d3.scaleLinear<string>()
  .domain([0, 0.0005, 0.01, 0.02, 0.03, 0.04, 0.05, 1])
  .range([colors.northAmericaBackgroundColor, heatmapGradientColors[0], ...heatmapGradientColors.slice(1), heatmapGradientColors[5]]);

export const tileOpacity = (percent: number) => (percent === 0) 
  ? 0.03 
  : d3.scaleLinear().domain([0, 0.05, 1]).range([0.1, 1, 1])(percent) ;

export const acresValue = (data: TimelineYearPlaceData, types: ClaimsAndPatentsAcresType[]): number => types.reduce((acc, type) => data[type] + acc, 0);

export const getDateValue = (year: number, month: number, day: number) => year * 10000 + month * 100 + day;



export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as RegExpExecArray;
  const rgb = result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : {
      r: 125,
      g: 125,
      b: 125,
    };
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
};

export const hextoRgba = (hex: string, opacity: number) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb}, ${opacity})`;
}
