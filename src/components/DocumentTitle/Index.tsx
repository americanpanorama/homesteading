import React from 'react';
import { useLocation } from 'react-router-dom';
import States from '../../../data/states.json';
import PlacesDateRanges from '../../../data/placesDateRanges.json';
import { ClaimsAndPatentsAcresType, ProjectedState } from '../../index.d';
import {
  getSelectedPlaceTitle,
  getStateTerritoryLabel,
} from '../SelectedPlacePanel/utilities';

const SITE_TITLE = 'Land Acquisition and Dispossession';
const DEFAULT_YEAR = 1863;
const LAST_YEAR = 1912;

interface OfficeDateRange {
  stub: string;
  firstYear: number;
  lastYear: number;
}

interface StateTerritoryDateRange extends OfficeDateRange {
  offices: OfficeDateRange[];
}

const STATE_RANGES = PlacesDateRanges as StateTerritoryDateRange[];
const STATE_RANGES_BY_ABBR = new Map(STATE_RANGES.map(range => [range.stub, range]));
const STATES_BY_ABBR = new Map((States as ProjectedState[]).map(state => [state.abbr, state]));

const VIEW_LABELS: Record<ClaimsAndPatentsAcresType, string> = {
  acres_claimed: 'claims on federal lands',
  acres_claimed_indian_lands: 'claims on Indian lands',
  acres_patented: 'patents from residency on federal lands',
  acres_patented_indian_lands: 'patents from residency on Indian lands',
  acres_commuted_2301: 'commutations under Section 2301',
  acres_commuted_18800615: 'commutations under the 1880 act',
  acres_commuted_indian_lands: 'commutations on Indian lands',
};

const VALID_VIEW_TYPES = new Set(Object.keys(VIEW_LABELS));

const clampYear = (yearParam?: string): number => {
  const parsedYear = parseInt(yearParam || DEFAULT_YEAR.toString(), 10);

  if (Number.isNaN(parsedYear)) {
    return DEFAULT_YEAR;
  }

  return Math.min(Math.max(parsedYear, DEFAULT_YEAR), LAST_YEAR);
};

const sanitizeOfficeStub = (office?: string): string => (office || '').replace(/[^a-zA-Z0-9]/g, '');

const titleCaseFirst = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const joinTitleParts = (parts: string[]): string => (
  parts.filter(Boolean).join(' | ')
);

const parsePathSegments = (pathname: string): Record<string, string> => {
  const segments = pathname.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  for (let index = 0; index < segments.length; index += 2) {
    const key = segments[index];
    const value = segments[index + 1];

    if (value) {
      params[key] = value;
    }
  }

  return params;
};

const getViewLabel = (view?: string, yearNum?: number): string => {
  if (!view) {
    return '';
  }

  const viewTypes = view
    .split('-')
    .filter(Boolean)
    .filter(type => VALID_VIEW_TYPES.has(type))
    .filter(type => !yearNum || yearNum >= 1890 || !type.includes('indian')) as ClaimsAndPatentsAcresType[];

  if (viewTypes.length === 0) {
    return '';
  }

  if (viewTypes.includes('acres_claimed') && viewTypes.includes('acres_claimed_indian_lands')) {
    return 'all claims';
  }

  const residencyTypes = ['acres_patented', 'acres_patented_indian_lands'];
  const commutationTypes = ['acres_commuted_2301', 'acres_commuted_18800615', 'acres_commuted_indian_lands'];
  const hasResidency = viewTypes.some(type => residencyTypes.includes(type));
  const hasCommutation = viewTypes.some(type => commutationTypes.includes(type));

  if (hasResidency && hasCommutation) {
    return 'all patents';
  }

  if (viewTypes.every(type => type.includes('claimed'))) {
    return viewTypes.length === 1 ? VIEW_LABELS[viewTypes[0]] : 'claims';
  }

  if (hasResidency) {
    return viewTypes.length === 1 ? VIEW_LABELS[viewTypes[0]] : 'patents from residency';
  }

  if (hasCommutation) {
    return viewTypes.length === 1 ? VIEW_LABELS[viewTypes[0]] : 'patents from commutations';
  }

  return viewTypes.map(type => VIEW_LABELS[type]).join(', ');
};

const getPlaceTitle = ({
  stateTerr,
  office,
  yearNum,
}: {
  stateTerr?: string;
  office?: string;
  yearNum: number;
}): string => {
  if (!stateTerr) {
    return 'United States';
  }

  const stateTerrRange = STATE_RANGES_BY_ABBR.get(stateTerr);
  const stateTerrData = STATES_BY_ABBR.get(stateTerr);

  if (!stateTerrRange || !stateTerrData) {
    return 'United States';
  }

  const officeRange = office
    ? stateTerrRange.offices.find(item => sanitizeOfficeStub(item.stub) === office)
    : undefined;

  return getSelectedPlaceTitle({
    office: officeRange ? office : undefined,
    stateTerr,
    yearNum,
    selectedPlaceName: officeRange?.stub || stateTerrData.name,
    stateName: stateTerrData.name,
  }) || getStateTerritoryLabel(stateTerr, yearNum, stateTerrData.name);
};

const getMapTitle = (pathname: string): string => {
  const params = parsePathSegments(pathname);
  const yearNum = clampYear(params.year);
  const placeTitle = getPlaceTitle({
    stateTerr: params.stateTerr,
    office: params.office,
    yearNum,
  });
  const panelLabel = params.office
    ? 'Charts'
    : params.panel === 'timeline'
      ? 'Timeline'
      : 'Map';
  const viewLabel = getViewLabel(params.view, yearNum);

  return joinTitleParts([
    `${placeTitle} ${panelLabel}, ${yearNum}`,
    viewLabel ? titleCaseFirst(viewLabel) : '',
    SITE_TITLE,
  ]);
};

const getTableTitle = (pathname: string): string => {
  const tablePath = pathname.replace(/^\/table/, '') || '/';
  const params = parsePathSegments(tablePath);
  const yearNum = clampYear(params.year);
  const placeTitle = getPlaceTitle({
    stateTerr: params.stateTerr,
    yearNum,
  });
  const viewLabel = getViewLabel(params.view, yearNum);

  return joinTitleParts([
    `${placeTitle} Data Table, ${yearNum}`,
    viewLabel ? titleCaseFirst(viewLabel) : '',
    SITE_TITLE,
  ]);
};

const getMapDataTitle = (pathname: string): string => {
  const mapDataPath = pathname.replace(/^\/map-data/, '') || '/';
  const params = parsePathSegments(mapDataPath);
  const yearNum = clampYear(params.year);

  return joinTitleParts([
    `Map Data, ${yearNum}`,
    SITE_TITLE,
  ]);
};

const getDocumentTitle = (pathname: string): string => {
  if (pathname === '/') {
    return SITE_TITLE;
  }

  if (pathname === '/introduction') {
    return joinTitleParts(['Introduction', SITE_TITLE]);
  }

  if (pathname === '/dispossession') {
    return joinTitleParts(['Indigenous Dispossession', SITE_TITLE]);
  }

  if (pathname === '/about') {
    return joinTitleParts(['About', SITE_TITLE]);
  }

  if (pathname.startsWith('/table')) {
    return getTableTitle(pathname);
  }

  if (pathname.startsWith('/map-data')) {
    return getMapDataTitle(pathname);
  }

  if (pathname.startsWith('/year') || pathname.startsWith('/stateTerr')) {
    return getMapTitle(pathname);
  }

  return SITE_TITLE;
};

const DocumentTitle = (): null => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    document.title = getDocumentTitle(pathname);
  }, [pathname]);

  return null;
};

export default DocumentTitle;
