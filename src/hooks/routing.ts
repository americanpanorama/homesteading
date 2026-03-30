import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import States from '../../data/states.json';
import PlacesDateRanges from '../../data/placesDateRanges.json';
import { ClaimsAndPatentsAcresType, ClaimsAndPatentsCountType, ProjectedState, RouterParams, TextType } from '../index.d';

const DEFAULT_YEAR = 1863;
const LAST_YEAR = 1912;
const VALID_TEXT_TYPES: TextType[] = ['about', 'dispossession', 'introduction', 'sources'];
const VALID_PANEL_TYPES = ['timeline', 'charts'] as const;
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

type PanelType = typeof VALID_PANEL_TYPES[number];

export interface URLParamsState extends RouterParams {
  text?: TextType;
  year: string;
  yearNum: number;
  stateTerr?: string;
  office?: string;
  panel?: PanelType;
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

interface LinkBuilderOverrides {
  text?: TextType | null;
  year?: string | number;
  stateTerr?: string | null;
  office?: string | null;
  panel?: PanelType | null;
  view?: string | null;
  fullOpacity?: string | null;
  clearText?: boolean;
  clearState?: boolean;
  clearOffice?: boolean;
  clearPanel?: boolean;
  hash?: string | null;
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
const sanitizePathParam = (value?: string | null): string | undefined => (
  value ? value.replace(/[^a-zA-Z0-9]/g, '') : undefined
);

const isValidViewType = (value: string): value is ClaimsAndPatentsAcresType => VALID_VIEW_TYPES.has(value as ClaimsAndPatentsAcresType);
const isValidPanelType = (value?: string): value is PanelType =>
  !!value && VALID_PANEL_TYPES.includes(value as PanelType);

const sanitizeViewForYear = (view: string | undefined, yearNum: number): string | undefined => {
  if (!view) {
    return undefined;
  }

  const filteredView = (yearNum < 1890)
    ? view
      .split('-')
      .filter(type => !type.includes('indian'))
      .join('-')
    : view;

  return filteredView || undefined;
};

const buildCanonicalPath = ({
  text,
  year,
  stateTerr,
  office,
  panel,
  view,
  fullOpacity,
}: {
  text?: TextType;
  year?: string;
  stateTerr?: string;
  office?: string;
  panel?: PanelType;
  view?: string;
  fullOpacity?: string;
}) => {
  const segments: string[] = [];

  if (text) {
    segments.push('text', text);
  }

  if (year) {
    segments.push('year', year);
  }

  if (stateTerr) {
    segments.push('stateTerr', stateTerr);
  }

  if (office) {
    segments.push('office', office);
  }

  if (panel) {
    segments.push('panel', panel);
  }

  if (view) {
    segments.push('view', view);
  }

  if (fullOpacity) {
    segments.push('fullOpacity', fullOpacity);
  }

  return segments.length > 0 ? `/${segments.join('/')}` : '/';
};

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
 * Builds canonical app URLs from the current URL state plus explicit overrides.
 * This replaces the old string-concatenation helper so links stay normalized and
 * do not accumulate legacy `/map/.../map/...` segments.
 */
export const useLinkBuilder = () => {
  const params = useURLParams();
  const location = useLocation();

  return React.useCallback((overrides: LinkBuilderOverrides = {}) => {
    let text = (typeof overrides.text !== 'undefined' ? overrides.text || undefined : params.text);
    let year = (typeof overrides.year !== 'undefined' ? overrides.year.toString() : params.year);
    let stateTerr = (typeof overrides.stateTerr !== 'undefined'
      ? sanitizePathParam(overrides.stateTerr)
      : params.stateTerr);
    let office = (typeof overrides.office !== 'undefined'
      ? sanitizePathParam(overrides.office)
      : params.office);
    let panel = (typeof overrides.panel !== 'undefined' ? overrides.panel || undefined : params.panel);
    let view = (typeof overrides.view !== 'undefined' ? overrides.view || undefined : params.view);
    const fullOpacity = (typeof overrides.fullOpacity !== 'undefined'
      ? overrides.fullOpacity || undefined
      : params.fullOpacity);

    if (overrides.clearText) {
      text = undefined;
    }

    if (typeof overrides.stateTerr !== 'undefined' && typeof overrides.office === 'undefined') {
      office = undefined;
      if (typeof overrides.panel === 'undefined') {
        panel = undefined;
      }
    }

    if (overrides.clearState) {
      stateTerr = undefined;
      office = undefined;
      panel = undefined;
    }

    if (overrides.clearOffice) {
      office = undefined;
      if (typeof overrides.panel === 'undefined') {
        panel = undefined;
      }
    }

    if (overrides.clearPanel) {
      panel = undefined;
    }

    if (!stateTerr) {
      office = undefined;
      panel = undefined;
    }

    if (office && typeof overrides.panel === 'undefined') {
      panel = 'charts';
    }

    if (stateTerr && !office && typeof overrides.panel === 'undefined' && typeof params.panel === 'undefined') {
      panel = 'timeline';
    }

    year = clampYear(year).toString();
    view = sanitizeViewForYear(view, parseInt(year, 10));

    let path = buildCanonicalPath({
      text,
      year,
      stateTerr,
      office,
      panel,
      view,
      fullOpacity,
    });

    path = path.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';

    const hash = typeof overrides.hash === 'undefined' ? location.hash : (overrides.hash || '');
    return `${path}${hash}`;
  }, [location.hash, params]);
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
    const panel = office
      ? 'charts'
      : isValidPanelType(params.panel)
        ? params.panel
        : stateTerr
          ? 'timeline'
          : undefined;
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
      panel,
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
  }, [params.fullOpacity, params.office, params.panel, params.placeId, params.stateTerr, params.text, params.view, params.year]);
};
