import * as React from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import { DimensionsContext } from './DimensionsContext';
import { RouterParams, TimelineYearPlaceData, TimelineYearPlaceDataWithStats, Dimensions, ClaimsAndPatentsAcresType, ClaimsAndPatentsCountType } from './index.d';
import { YTick } from './components/Barchart.d';
import { Actions } from './actions.d';

export const makeParams = (params: RouterParams, actions: Actions): string => {
  const { text, year, stateTerr, office, fullOpacity, view } = params;
  let newText = text;
  let newYear = year;
  let newStateTerr = stateTerr;
  let newOffice = office;
  let newView = view;
  let newFullOpacity = fullOpacity;
  actions.forEach(a => {
    if (a.type === 'set_year') {
      newYear = a.payload.toString();
    }
    if (a.type === 'set_state') {
      newStateTerr = a.payload.replace(/[^a-zA-Z0-9]/g, '');
      newOffice = null;
    }
    if (a.type === 'clear_state') {
      newStateTerr = null;
      newOffice = null;
    }
    if (a.type === 'set_office') {
      newOffice = a.payload.replace(/[^a-zA-Z0-9]/g, '');
    }
    if (a.type === 'clear_office') {
      newOffice = null;
    }
    if (a.type === 'set_view') {
      newView = a.payload;
    }
    if (a.type === 'show_text') {
      newText = a.payload;
    }
    if (a.type === 'clear_text') {
      newText = null;
    }
  });
  // remove indian_lands if the year is before 1890 when that legislation passed
  if (newView && parseInt(newYear) < 1890) {
    newView = newView
      .split('-')
      .filter(type => !type.includes('indian'))
      .join('-');
  }

  let newPath = '';
  if (newText) {
    newPath += `/text/${newText}`;
  }
  if (newYear) {
    newPath += `/year/${newYear}`;
  }
  if (newStateTerr) {
    newPath += `/stateTerr/${newStateTerr}`;
  }
  if (newOffice) {
    newPath += `/office/${newOffice}`;
  }
  if (newView) {
    newPath += `/view/${newView}`;
  }
  if (newFullOpacity) {
    newPath += `/fullOpacity/${newFullOpacity}`;
  }
  return newPath;
};  

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
  .domain([0, 0.000000001, 0.01, 0.02, 0.03, 0.04,  0.05, 1])
  .range(['#232123', '#232123', '#50C4AA', '#B6C95C', '#FACB3E', '#FC800F', '#FF4759', '#FF4759'])
  //.range(['#232123', '#1C6179', '#39F3BB', '#39F3BB']);
  // .domain([0, 0.33, 1, 5, 10, 10000])
  // .range(['#232123', '#1C6179', '#2B9992', '#3DD0AD', '#39F3BB', '#39F3BB']);

export const tileOpacity = (percent: number) => (percent === 0) 
  ? 0.03 
  : d3.scaleLinear().domain([0, 0.05, 1]).range([0.1, 1, 1])(percent) ;

export const useClaimsAndPatentsTypes = () => {
  const params = useParams<RouterParams>();
  const { view } = params;
  const types: ClaimsAndPatentsAcresType[] = (view) ? view.split('-') as ClaimsAndPatentsAcresType[] : ["acres_claimed", "acres_claimed_indian_lands"];
  const countTypes: ClaimsAndPatentsCountType[] = [];
  if (types.includes('acres_claimed')) {
    countTypes.push('claims');
  }
  if (types.includes('acres_claimed_indian_lands')) {
    countTypes.push('claims_indian_lands');
  }
  if (types.includes('acres_patented')) {
    countTypes.push('patents');
  }
  if (types.includes('acres_patented_indian_lands')) {
    countTypes.push('patents_indian_lands');
  }
  if (types.includes('acres_commuted_indian_lands')) {
    countTypes.push('commutations_indian_lands');
  }
  if (types.includes('acres_commuted_2301')) {
    countTypes.push('commutations_2301');
  }
    if (types.includes('acres_commuted_18800615')) {
    countTypes.push('commutations_18800615');
  }

  let numberLabel = 'claims';
  let acresLabel = 'claimed';
  if (view === 'acres_commuted_2301-acres_commuted_18800615-acres_commuted_indian_lands') {
    numberLabel = 'commutations';
    acresLabel = 'commuted';
  } else if (view && view.includes('patented')) {
    numberLabel = 'patents';
    acresLabel = 'patented';
  }
  return {
    acresTypes: types,
    countTypes,
    numberLabel,
    acresLabel,
  };
}

export const acresValue = (data: TimelineYearPlaceData, types: ClaimsAndPatentsAcresType[]): number => types.reduce((acc, type) => data[type] + acc, 0);
