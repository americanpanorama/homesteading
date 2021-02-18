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

export type PlaceType = 'office' | 'stateOrTerritory';

export interface TimelineYearPlaceData {
  year: number;
  acres_claimed: number;
  claims: number;
  acres_patented: number;
  patents: number;
  area: number;
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

// export interface TimelineYearTick {
//   x: number;
//   height: number;
//   stroke: string;
// }

export interface TimelineRowStyled {
  label: string;
  cells: TimelineCell[];
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
  onHover?: (photographerKey: string) => void;
  onUnhover?: () => void,
}
