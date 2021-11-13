export interface GraphedDataForYear {
  year: number;
  federal_lands: number;
  indian_lands: number;
  commutations_2301?: number;
  commutations_18800615?: number;
  commutations_indian_lands?: number;
}

export interface GraphedDataForYearWithDimensions extends GraphedDataForYear {
  federal_lands_y: number;
  indian_lands_y: number;
  commutations_2301_y?: number;
  commutations_18800615_y?: number;
  commutations_indian_lands_y?: number;
  federal_lands_height: number;
  indian_lands_height: number;
  commutations_2301_height?: number;
  commutations_18800615_height?: number;
  commutations_indian_lands_height?: number;
  x: number;
}

export interface YTick {
  value: number;
  label: string;
  y: number;
}

export interface Bar {
  width: number;
  height: number;
  className?: string;
}

export interface BarSet {
  x: number;
  year: number;
  bars: Bar[];
  label: string;
}
