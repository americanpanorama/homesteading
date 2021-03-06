export type Point = [number, number];

export type Bounds = [Point, Point];

interface YMD {
  year: number;
  month: number;
  day: number;
}

export interface ProjectedTownship {
  d: string;
  office: string;
  state: string;
  area: number;
  claims: number;
  acres_claimed: number;
  patents: number;
  acres_patented: number;
  labelCoords: Point;
  bounds: Bounds;
  rotation: number;
  gisJoin: string; 
  tile_id: string;
}

interface ConflictData {
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

interface YearData {
  offices: ProjectedTownship[];
  conflicts: ConflictData[];
}

export interface AsyncParams {
  data: YearData;
  error: any;
}

export interface TileData {
  tile_id: string;
  z: number;
  y: number;
  x: number;
  opacity: number;
}

export interface TransformData {
  scale: number;
  transform: string;
  translate: string;
}

export type CalculateTransform = (viewOptions: {
  dx?: number;
  dy?: number;
  yGutter?: number;
  xGutter?: number;
  center?: Point;
  rotation?: number;
  width: number;
  height: number;
}) => TransformData;

export interface CenterAndDXDY {
  center: Point;
  dx: number;
  dy: number;
}

export type CalculateCenterAndDXDY = (bounds: Bounds) => CenterAndDXDY;

export type CalculateZ = (scale: number) => number;

export interface MapDate {
  state: string;
  map_n: number;
  startYear: number;
  endYear: number;
}
