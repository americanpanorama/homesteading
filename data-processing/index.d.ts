export interface MapDate {
  state: string;
  map_n: number;
  startYear: number;
  endYear: number;
}

export interface TownshipFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    OBJECTID?: number;
    GISJOIN?: string;
    gisjoin?: string;
    NHGISST?: string;
    nhgisst?: string;
    statenam?: string;
    STATENAM?: string;
    office?: string;
    Office?: string;
    start?: number;
    Start?: number;
    _end?: number;
    End?: number;
    map_n: string;
    id: string;
    st_makevalid?: string;
    sh_id: number;
    Shape_Leng?: number;
    Field?: any;
    Shape_Length?: number;
    Shape_Area?: number;
  };
  id?: number;
}

export interface YMD {
  year: number;
  month: number;
  day: number;
}


export interface ConflictRaw {
  id: number;
  date_begin: string;
  date_end: string;
  source_no: number;
  name_michno: string;
  name_freeman: string;
  state: string;
  ident_freeman: string;
  xcoord: number;
  ycoord: number;
  "nation 1": string;
  "nation 2": string;
  "nation 3": string;
  "nation 4": string;
  "pop_group": number;
  "US casualties": number;
  "Native casualties": number;
  "share of native casualties": number;
  type_engagement: number;
  x: number;
  y: number;
}



export interface ConflictData {
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

export interface TownshipFeatureOrganized {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    id: string;
    name: string;
    state: string;
    year: number;
    tile_id: string;
    map_id: number;
    claims: number;
    acres_claimed: number;
    patents: number;
    acres_patented: number;
    area: number;
  };
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
  labelCoords?: [number, number];
  bounds: [[number, number], [number, number]];
  rotation: number;
  gisJoin: string; 
  tile_id: string;
  map_id: number;
}

export interface YearsData {
  [index: string]: {
    offices: ProjectedTownship[];
    conflicts: ConflictData[];
  }
}

export interface OfficeMappings {
  [index: string]: number;
}

