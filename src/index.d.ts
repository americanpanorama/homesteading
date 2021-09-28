export type ClaimsCountType = "claims" | "claims_indian_lands";
export type PatentsCountType =  "patents" | "patents_indian_lands" | "commutations_2301" | "commutations_18800615" | "commutations_indian_lands";
export type ClaimsAndPatentsCountType = ClaimsCountType | PatentsCountType; 
export type ClaimsAcresType = "acres_claimed" | "acres_claimed_indian_lands";
export type PatentsResidencyAcres = "acres_patented" | "acres_patented_indian_lands";
export type PatentsCommutationsAcresType = "acres_commuted_2301" | "acres_commuted_18800615" | "acres_commuted_indian_lands";
export type PatentsAcresType = PatentsResidencyAcres | PatentsCommutationsAcresType;
export type ClaimsAndPatentsAcresType = ClaimsAcresType | PatentsResidencyAcres | PatentsCommutationsAcresType;

export type ClaimsAndPatentsCounts = { [count in ClaimsAndPatentsCountType]: number; }
export type ClaimAndPatentsAcres = { [acres in ClaimsAndPatentsAcresType]: number; }

export interface Dimensions {
  width: number;
  height: number;
  isMobile: boolean;
  mapDimensions: {
    width: number;
    height: number;
  };
  timelineDimensions: {
    width: number;
    height: number;
    leftAxisWidth: number;
    labelsWidth: number;
  };
  officeBarchartDimensions: {
    xAxisHeight: number;
    yAxisWidth: number;
    padding: number;
    paddingTop: number;
    chartBodyHeight: number;
    chartBodyWidth: number;
    height: number;
  };
}

export type ClaimsTypesSelected = { [acres in ClaimsAcresType]: boolean; }
export type PatentsTypesSelected = { [acres in PatentsAcresType]: boolean }
export type ClaimsSelected = {
  type: 'claims';
  subcats: ClaimsTypesSelected;
}
export type PatentsSelected = {
  type: 'patents';
  subcats: PatentsTypesSelected;
}
export type ClaimsOrPatentsTypesSelected = ClaimsSelected | PatentsSelected;

export interface YMD {
  year: number;
  month: number;
  day: number;
}

export interface Conflict {
  x: number;
  y: number;
  names: string;
  office: string;
  state: string;
  nations: string[];
  us_casualties: number;
  native_casualties: number;
  start_date: YMD;
  end_date: YMD;
}

export type PlaceType = 'office' | 'stateOrTerritory';

export type TimelineYearPlaceData = ClaimsAndPatentsCounts & ClaimAndPatentsAcres & {
  year: number;
  area: number;
  conflicts?: Conflict[];
}

export type TimelineYearPlaceDataWithStats = TimelineYearPlaceData & {
  total_claims: number;
  total_acres_claimed: number;
  area_claimed_percent: number;
  claims_federal_lands_percent: number;
  claims_indian_lands_percent: number;
  total_patents: number;
  total_patents_residency: number;
  total_patents_residency_percent: number;
  total_patents_commutations: number;
  total_patents_commutations_percent: number;
  number_of_patent_types: number;
  patents_federal_lands_percent: number;
  patents_indian_lands_percent: number;
}

export interface TimelinePlaceData {
  name: string;
  abbr?: string;
  stateOrTerritory?: string;
  type: PlaceType;
  medianYearClaimsAcres: number;
  yearData: TimelineYearPlaceData[];
}

export interface TimelinePlaceDataWithStats extends TimelinePlaceData {
  total_claims_federal_lands: number;
  total_claims_indian_lands: number;
  total_patents_federal_lands: number;
  total_patents_indian_lands: number;
  total_commutations_2301: number;
  total_commutations_18800615: number;
  total_commutations_indian_lands: number;
  yearData: TimelineYearPlaceDataWithStats[];
}

export interface TimelineCell {
  x: number;                    // x position
  width: number;
  height: number;
  fill: string;
  fillOpacity: number;
}

export interface TimelineConflict {
  x: number;
  strokeWidth: number;
  xRadius: number;
}

export interface TimelineRowStyled {
  label: string;
  cells: TimelineCell[];
  number: number;
  acres: number;
  conflicts: TimelineConflict[];
  active: boolean;            // does the photographer have any photos (and is thus selectable) given the current state, e.g. timeRange
  y: number;                  // y position 
  //ySelectable: number;       // y position for the overlapping selectable rect
  width: number; 
  height: number;
  labelSize: number;
  //yearTicks: TimelineYearTick[];
  emphasize: boolean;        // for selected photographer
  fill: string;
  linkTo: string;
}

export interface StyledState {
  abbr: string;
  name: string;
  nhgis_join?: string;
  d: string;
  labelCoords: [number, number];
  labelRotation: number;
  fillOpacity: number;
  stroke?: string;
}

export interface ProjectedState {
  abbr: string;
  name: string;
  labelCoords: [number, number];
  labelRotation: number;
  bounds: [[number, number], [number, number]];
  rotation: number;
  d: string;
  stats?: {
    area: number;
    acres_visualized: number;
  };

}
export type TextType = 'about' | 'introduction' | 'sources';

export interface RouterParams {
  text?: TextType;
  year?: string;
  placeId?: string;
  stateTerr?: string;
  office?: string;
  view?: string;
  fullOpacity?: string;
}
