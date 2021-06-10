export interface TownshipFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    OBJECTID?: number;
    NHGISST: string;
    STATENAM: string;
    GISJOIN: string;
    Office: string;
    Start: number;
    End: number;
    map_n: string;
    id: string;
    sh_id: number;
    Shape_Leng?: number;
    Field?: any;
    Shape_Length?: number;
    Shape_Area?: number;
  };
  id?: number;
}

export interface TownshipData {
  office: string;
  claims_ac: number | '';
  patents_ac: number | '';
  patents_num: number | '';
  claims_num: number | '';
  year: number;
  of_id: string;
  land_office: string;
  [idnums: string]: string | number;
}

