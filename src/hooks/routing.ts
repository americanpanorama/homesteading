import * as React from 'react';
import { useParams } from 'react-router-dom';
import States from '../../data/states.json';
import PlacesDateRanges from '../../data/placesDateRanges.json';
import { ClaimsAndPatentsAcresType, ClaimsAndPatentsCountType, ProjectedState, RouterParams, TextType } from '../index.d';

const DEFAULT_YEAR = 1863;
const LAST_YEAR = 1912;
const VALID_TEXT_TYPES: TextType[] = ['about', 'dispossession', 'introduction', 'sources'];
const VALID_VIEW_TYPES = new Set<ClaimsAndPatentsAcresType>([
  'acres_claimed',
  'acres_claimed_indian_lands',
  'acres_patented',
  'acres_patented_indian_lands',
  'acres_commuted_2301',
  'acres_commuted_18800615',
  'acres_commuted_indian_lands',
]);

interface OfficeDateRange {
  stub: string;
  firstYear: number;
  lastYear: number;
}

interface StateTerritoryDateRange extends OfficeDateRange {
  offices: OfficeDateRange[];
}

export interface URLParamsState extends RouterParams {
  text?: TextType;
  year: string;
  yearNum: number;
  stateTerr?: string;
  office?: string;
  view?: string;
  viewTypes: ClaimsAndPatentsAcresType[];
  fullOpacity?: string;
  isFullOpacity: boolean;
  isIndianLandsYear: boolean;
  stateTerrData?: ProjectedState;
  stateTerrRange?: StateTerritoryDateRange;
  officeRange?: OfficeDateRange;
  selectedPlaceName?: string;
  selectedPlaceType?: 'office' | 'stateOrTerritory';
  selectedPlaceRange?: OfficeDateRange | StateTerritoryDateRange;
  stateTerritories: ProjectedState[];
  selectedStateTerritoryIsActive: boolean;
  selectedOfficeIsActive: boolean;
}

const STATES_BY_ABBR = new Map((States as ProjectedState[]).map(state => [state.abbr, state]));
const STATE_RANGES = PlacesDateRanges as StateTerritoryDateRange[];
const STATE_RANGES_BY_ABBR = new Map(STATE_RANGES.map(range => [range.stub, range]));

const clampYear = (yearParam?: string): number => {
  const parsedYear = parseInt(yearParam || DEFAULT_YEAR.toString(), 10);
  if (Number.isNaN(parsedYear)) {
    return DEFAULT_YEAR;
  }
  return Math.min(Math.max(parsedYear, DEFAULT_YEAR), LAST_YEAR);
};

const sanitizeOfficeStub = (office?: string): string => (office || '').replace(/[^a-zA-Z0-9]/g, '');

const isValidViewType = (value: string): value is ClaimsAndPatentsAcresType => VALID_VIEW_TYPES.has(value as ClaimsAndPatentsAcresType);

export const useClaimsAndPatentsTypes = () => {
  const params = useURLParams();
  const { view, viewTypes } = params;
  const types: ClaimsAndPatentsAcresType[] = viewTypes.length > 0 ? viewTypes : ['acres_claimed', 'acres_claimed_indian_lands'];
  const countTypes: ClaimsAndPatentsCountType[] = [];

  if (types.includes('acres_claimed')) {
    countTypes.push('claims');
  }
  if (types.includes('acres_claimed_indian_lands')) {
    countTypes.push('claims_indian_lands');
  }
  if (types.includes('acres_patented')) {
    countTypes.push('patents');
  }
  if (types.includes('acres_patented_indian_lands')) {
    countTypes.push('patents_indian_lands');
  }
  if (types.includes('acres_commuted_indian_lands')) {
    countTypes.push('commutations_indian_lands');
  }
  if (types.includes('acres_commuted_2301')) {
    countTypes.push('commutations_2301');
  }
  if (types.includes('acres_commuted_18800615')) {
    countTypes.push('commutations_18800615');
  }

  let numberLabel = 'claims';
  let acresLabel = 'claimed';
  if (view === 'acres_commuted_2301-acres_commuted_18800615-acres_commuted_indian_lands') {
    numberLabel = 'commutations';
    acresLabel = 'commuted';
  } else if (view && view.includes('patented')) {
    numberLabel = 'patents';
    acresLabel = 'patented';
  }

  return {
    acresTypes: types,
    countTypes,
    numberLabel,
    acresLabel,
  };
};

/**
 * Returns normalized URL-driven app state along with derived place metadata.
 * This keeps routing concerns in one hook instead of repeating parsing and lookups in each component.
 */
export const useURLParams = (): URLParamsState => {
  const params = useParams() as RouterParams;

  return React.useMemo(() => {
    const yearNum = clampYear(params.year);
    const year = yearNum.toString();
    const text = VALID_TEXT_TYPES.includes(params.text as TextType) ? params.text as TextType : undefined;
    const stateTerrRange = params.stateTerr ? STATE_RANGES_BY_ABBR.get(params.stateTerr) : undefined;
    const stateTerrData = params.stateTerr ? STATES_BY_ABBR.get(params.stateTerr) : undefined;
    const stateTerr = (stateTerrRange && stateTerrData) ? params.stateTerr : undefined;
    const officeRange = (stateTerr && params.office)
      ? stateTerrRange?.offices.find(office => sanitizeOfficeStub(office.stub) === params.office)
      : undefined;
    const office = officeRange ? params.office : undefined;
    const rawViewTypes = (params.view || '')
      .split('-')
      .filter(Boolean)
      .filter(isValidViewType);
    const viewTypes = (yearNum < 1890)
      ? rawViewTypes.filter(type => !type.includes('indian'))
      : rawViewTypes;
    const view = viewTypes.length > 0 ? viewTypes.join('-') : undefined;
    const stateTerritories = (States as ProjectedState[]).filter(state => {
      const range = STATE_RANGES_BY_ABBR.get(state.abbr);
      return !!range && range.firstYear <= yearNum && range.lastYear >= yearNum;
    });
    const selectedStateTerritoryIsActive = !!stateTerr && stateTerritories.some(place => place.abbr === stateTerr);
    const selectedOfficeIsActive = !!officeRange && officeRange.firstYear <= yearNum && officeRange.lastYear >= yearNum;

    return {
      placeId: params.placeId,
      text,
      year,
      yearNum,
      stateTerr,
      office,
      view,
      viewTypes,
      fullOpacity: params.fullOpacity,
      isFullOpacity: !!params.fullOpacity,
      isIndianLandsYear: yearNum >= 1890,
      stateTerrData,
      stateTerrRange,
      officeRange,
      selectedPlaceName: officeRange?.stub || stateTerrData?.name,
      selectedPlaceType: officeRange ? 'office' : stateTerr ? 'stateOrTerritory' : undefined,
      selectedPlaceRange: officeRange || stateTerrRange,
      stateTerritories,
      selectedStateTerritoryIsActive,
      selectedOfficeIsActive,
    };
  }, [params.fullOpacity, params.office, params.placeId, params.stateTerr, params.text, params.view, params.year]);
};
