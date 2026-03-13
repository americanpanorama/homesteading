export interface MapDate {
  state: string;
  map_n: number;
  startYear: number;
  endYear: number;
}

export interface PolygonOrMultipolygon {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
}

export interface TownshipFeature {
  type: 'Feature';
  geometry: PolygonOrMultipolygon;
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
    map_n?: string;
    id?: string;
    st_makevalid?: string;
    sh_id?: number;
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
  "natives dead": number | "";
  "natives dead (amended)": number | "";
  "natives wounded": number | "";
  "natives wounded (amended)": number | "";
  "natives captured": number | "";
  "natives captured (amended)": number | "";
  "us combatants dead": 4,
  "us combatants wounded": number | "";
  "us combatants wounded (amended)": number | "";
  "us civilians dead": number | "";
  "us civilians dead (amended)": number | "";
  "us civilians wounded": number | "";
  "us civilians captured": number | "";
  "source": string,
  "nation 1": string;
  "nation 2": string;
  "nation 3": string;
  "nation 4": string;
  "pop_group": number;
  "native casualties": number;
  "us combatant casualties": number;
  "us civilian casualties": number;
  "total casualties": number;
  "type engagement": number;
  x: number;
  y: number;
}

export interface ConflictData {
  x?: number;
  y?: number;
  names: string;
  office?: string;
  state?: string;
  nations: string[];
  us_casualties: number;
  native_casualties: number;
  start_date: YMD;
  end_date: YMD;
  rotation: number;
}

export interface TownshipData {
  office: string;
  claims_ac: number;
  patents_ac: number;
  patents_num: number;
  claims_num: number;
  claims_num_indian_lands: number;
  claims_ac_indian_lands: number;
  commutations_num_2301: number;
  commutations_ac_2301: number;
  commutations_num_18800615: number;
  commutations_ac_18800615: number;
  commutations_num_indian_lands: number;
  commutations_ac_indian_lands: number;
  patents_num_indian_lands: number;
  patents_ac_indian_lands: number;
  year: number;
  of_id: string;
  land_office: string;
  [idnums: string]: string | number;
}

export interface District {
  office: string;
  state: string;
  boundaries: {
    d: string;
    start_date: YMD;
    end_date: YMD;
  }[];
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
    year_proportion: number;
    tile_id: string;
    map_id: number;
    claims: number;
    acres_claimed: number;
    claims_indian_lands: number;
    acres_claimed_indian_lands: number;
    patents: number;
    acres_patented: number;
    patents_indian_lands: number;
    acres_patented_indian_lands: number;
    commutations_2301: number;
    acres_commuted_2301: number;
    commutations_18800615: number;
    acres_commuted_18800615: number;
    commutations_indian_lands: number;
    acres_commuted_indian_lands: number;
    area: number;
  };
}

export interface ClaimsAndPatentsData {
  claims: number;
  acres_claimed: number;
  claims_indian_lands: number;
  acres_claimed_indian_lands: number;
  patents: number;
  acres_patented: number;
  patents_indian_lands: number;
  acres_patented_indian_lands: number;
  commutations_2301: number;
  acres_commuted_2301: number;
  commutations_18800615: number;
  acres_commuted_18800615: number;
  commutations_indian_lands: number;
  acres_commuted_indian_lands: number;
  adjustedForMap: boolean;
}

export interface OfficeBoundary {
  d: string;
  tile_id: string;
  tile_ids?: string[];
  area: number;
  bounds: [[number, number], [number, number]];
  rotation: number;
}

export interface ProjectedTownship {
  office: string;
  state: string;
  data: ClaimsAndPatentsData[];
  office_boundaries: OfficeBoundary[];
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

export type PlaceType = 'office' | 'stateOrTerritory';

export interface TimelineYearPlaceData {
  year: number;
  acres_claimed: number;
  claims: number;
  acres_patented: number;
  claims_indian_lands: number;
  acres_claimed_indian_lands: number;
  patents: number;
  commutations_2301: number;
  acres_commuted_2301: number;
  commutations_18800615: number;
  acres_commuted_18800615: number;
  commutations_indian_lands: number;
  acres_commuted_indian_lands: number;
  patents_indian_lands: number;
  acres_patented_indian_lands: number;
  area: number;
  conflicts?: ConflictData[];
}

export interface TimelinePlaceData {
  name: string;
  abbr?: string;
  stateOrTerritory?: string;
  type: PlaceType;
  medianYearClaimsAcres: number;
  yearData: TimelineYearPlaceData[];
}


