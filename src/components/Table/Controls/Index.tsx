import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClaimsAndPatentsAcresType } from '../../../index.d';
import { useURLParams } from '../../../hooks';
import { TimelineSortOption } from '../../Timeline/types';
import { TIMELINE_SELECTABLE_YEARS } from '../../Timeline/utilities';
import { useTableLinkBuilder } from '../routing';
import * as Styled from './styled';

interface ViewOption {
  label: string;
  types: ClaimsAndPatentsAcresType[];
}

const claimsFederalTypes: ClaimsAndPatentsAcresType[] = ['acres_claimed'];
const claimsIndianTypes: ClaimsAndPatentsAcresType[] = ['acres_claimed_indian_lands'];
const patentResidencyFederalTypes: ClaimsAndPatentsAcresType[] = ['acres_patented'];
const patentResidencyIndianTypes: ClaimsAndPatentsAcresType[] = ['acres_patented_indian_lands'];
const patentCommutationFederalTypes: ClaimsAndPatentsAcresType[] = ['acres_commuted_2301', 'acres_commuted_18800615'];
const patentCommutationIndianTypes: ClaimsAndPatentsAcresType[] = ['acres_commuted_indian_lands'];

const SORT_LABELS: Record<TimelineSortOption, string> = {
  alphabetical: 'Alphabetical',
  chronological: 'Chronological',
  descending: 'Descending %',
};

const getValue = (types: ClaimsAndPatentsAcresType[]) => types.join('-');

const getViewOptions = (isIndianLandsYear: boolean): ViewOption[] => {
  const claimsOptions = isIndianLandsYear
    ? [
      { label: 'All claims', types: [...claimsFederalTypes, ...claimsIndianTypes] },
      { label: 'Claims on federal lands', types: claimsFederalTypes },
      { label: 'Claims on Indian lands', types: claimsIndianTypes },
    ]
    : [
      { label: 'All claims', types: claimsFederalTypes },
    ];
  const residencyTypes = isIndianLandsYear
    ? [...patentResidencyFederalTypes, ...patentResidencyIndianTypes]
    : patentResidencyFederalTypes;
  const commutationTypes = isIndianLandsYear
    ? [...patentCommutationFederalTypes, ...patentCommutationIndianTypes]
    : patentCommutationFederalTypes;
  const allPatentTypes = isIndianLandsYear
    ? [...residencyTypes, ...commutationTypes]
    : [...patentResidencyFederalTypes, ...patentCommutationFederalTypes];
  const patentOptions = [
    { label: 'All patents', types: allPatentTypes },
    { label: 'Patents from residency', types: residencyTypes },
    { label: 'Patents from commutations', types: commutationTypes },
  ];

  if (!isIndianLandsYear) {
    return [...claimsOptions, ...patentOptions];
  }

  return [
    ...claimsOptions,
    ...patentOptions,
    { label: 'Patents on federal lands', types: [...patentResidencyFederalTypes, ...patentCommutationFederalTypes] },
    { label: 'Patents on Indian lands', types: [...patentResidencyIndianTypes, ...patentCommutationIndianTypes] },
  ];
};

const TableControls = ({
  sortBy,
  onSortChange,
  showInactiveAreasForSelectedYear,
  onToggleInactiveAreasForSelectedYear,
  csvHref,
  csvFilename,
}: {
  sortBy: TimelineSortOption;
  onSortChange: (value: TimelineSortOption) => void;
  showInactiveAreasForSelectedYear: boolean;
  onToggleInactiveAreasForSelectedYear: (value: boolean) => void;
  csvHref: string;
  csvFilename: string;
}) => {
  const navigate = useNavigate();
  const buildTableLink = useTableLinkBuilder();
  const { stateTerr, stateTerrData, stateTerritories, view, year, yearNum, isIndianLandsYear } = useURLParams();
  const viewOptions = getViewOptions(isIndianLandsYear);
  const selectedView = viewOptions.some(option => getValue(option.types) === view)
    ? view
    : getValue(viewOptions[0].types);

  return (
    <Styled.Controls aria-label='Timeline table controls'>
      <Styled.Field>
        <Styled.Label htmlFor='table-place'>Geography</Styled.Label>
        <Styled.Select
          id='table-place'
          value={stateTerr || ''}
          onChange={event => navigate(buildTableLink({ stateTerr: event.target.value || null, clearState: !event.target.value }))}
        >
          <option value=''>United States</option>
          {stateTerritories.map(place => (
            <option value={place.abbr} key={place.abbr}>
              {place.name}
            </option>
          ))}
          {stateTerr && stateTerrData && !stateTerritories.some(place => place.abbr === stateTerr) && (
            <option value={stateTerr}>{stateTerrData.name}</option>
          )}
        </Styled.Select>
      </Styled.Field>

      <Styled.Field>
        <Styled.Label htmlFor='table-year'>Reference Year</Styled.Label>
        <Styled.Select
          id='table-year'
          value={year}
          onChange={event => navigate(buildTableLink({ year: event.target.value }))}
        >
          {TIMELINE_SELECTABLE_YEARS.map(optionYear => (
            <option value={optionYear} key={optionYear}>
              {optionYear}
            </option>
          ))}
        </Styled.Select>
      </Styled.Field>

      <Styled.Field>
        <Styled.Label htmlFor='table-view'>Measure</Styled.Label>
        <Styled.Select
          id='table-view'
          value={selectedView}
          onChange={event => navigate(buildTableLink({ view: event.target.value }))}
        >
          {viewOptions.map(option => (
            <option value={getValue(option.types)} key={getValue(option.types)}>
              {option.label}
            </option>
          ))}
        </Styled.Select>
      </Styled.Field>

      <Styled.Field>
        <Styled.Label htmlFor='table-sort'>Sort By</Styled.Label>
        <Styled.Select
          id='table-sort'
          value={sortBy}
          onChange={event => onSortChange(event.target.value as TimelineSortOption)}
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </Styled.Select>
      </Styled.Field>

      <Styled.ToggleRow htmlFor='table-inactive-areas'>
        <Styled.ToggleInput
          id='table-inactive-areas'
          type='checkbox'
          checked={showInactiveAreasForSelectedYear}
          onChange={event => onToggleInactiveAreasForSelectedYear(event.target.checked)}
        />
        <Styled.ToggleText>Include areas inactive in {yearNum}</Styled.ToggleText>
      </Styled.ToggleRow>

      <Styled.DownloadButton href={csvHref} download={csvFilename}>
        Download CSV
      </Styled.DownloadButton>
    </Styled.Controls>
  );
};

export default TableControls;
