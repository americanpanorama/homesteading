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
  }
}


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

export interface TimelineYearPlaceData {
  year: number;
  acres_claimed: number;
  claims: number;
  acres_patented: number;
  patents: number;
  area: number;
  conflicts?: Conflict[];
}

export interface TimelinePlaceData {
  name: string;
  abbr?: string;
  stateOrTerritory?: string;
  type: PlaceType;
  medianYearClaimsAcres: number;
  yearData: TimelineYearPlaceData[];
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
}

// export interface TimelineYearTick {
//   x: number;
//   height: number;
//   stroke: string;
// }

export interface TimelineRowStyled {
  label: string;
  cells: TimelineCell[];
  claims: number;
  acres_claimed: number;
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
}

export interface ProjectedState {
  abbr: string;
  name: string;
  labelCoords: [number, number];
  labelRotation: number;
  bounds: [[number, number], [number, number]];
  rotation: number;
  d: string;
}


export interface RouterParams {
  year: string;
  placeId?: string;
  stateTerr?: string;
  office?: string;
  fullOpacity?: string;
}
