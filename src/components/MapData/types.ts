import { Conflict, TimelinePlaceData, TimelineYearPlaceData } from '../../index.d';

export interface MetricConfig {
  label: string;
  countKey: keyof TimelineYearPlaceData;
  acresKey: keyof TimelineYearPlaceData;
}

export interface ActivityTotals {
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
}

export interface PlaceActivitySummary {
  place: TimelinePlaceData;
  current: ActivityTotals;
  previous: ActivityTotals | null;
  conflicts: Conflict[];
}

export interface IndianLandsLayerSummary {
  type: string;
  dissolvedFeatures: number;
  sourceFeatures: number;
  acres: number;
}

export interface IndianLandsCession {
  id: string;
  cessionNumber: string;
  cessionDate: string;
  fiscalYear: number;
  presentDayTribes: string[];
  scheduledTribes: string;
  states: string[];
  counties: string[];
  stateCounties: string[];
  mapName: string;
  citation1: string;
  citation2: string;
  royceScheduleUrl: string;
  kapplerTreatyUrl: string;
  federalStatuteUrl: string;
  executiveOrderUrl: string;
  otherTreatyUrl: string;
  acres: number;
}

export interface IndianLandsReservation {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  openDate: string;
  correction: string;
  acres: number;
}

export interface IndianLandsYearData {
  layerSummary: Record<string, IndianLandsLayerSummary>;
  reservations: IndianLandsReservation[];
  cessions: IndianLandsCession[];
}

export interface IndianLandsDataFile {
  years: Record<string, IndianLandsYearData>;
}
