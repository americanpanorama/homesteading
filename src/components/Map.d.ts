import { ClaimsAndPatentsCounts,  ClaimAndPatentsAcres } from '..';

export type Point = [number, number];

export type Bounds = [Point, Point];

interface YMD {
  year: number;
  month: number;
  day: number;
}

export type ProjectedTownship = ClaimsAndPatentsCounts & ClaimAndPatentsAcres & {
  d: string;
  office: string;
  state: string;
  area: number;
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
  rotation: number;
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
  translate?: [number, number];
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

export interface ReservationSVG {
    d: string;
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    type: 'reservation' | 'unceded land';
    opened: boolean;
    id: number;
}