import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DimensionsContext } from '../../DimensionsContext';
import { useLinkBuilder, useURLParams } from '../../hooks';
import { Dimensions } from '../../index.d';
import * as Styled from './styled';
import Previous from '../Buttons/Previous';
import Next from '../Buttons/Next';
import Backlink from '../Buttons/Backlink/Index';
import { getStateTerritoryLabel } from '../SelectedPlacePanel/utilities';

const TimelineDateHeader = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { mapDimensions } = useContext(DimensionsContext) as Dimensions;
  const { year, yearNum, office, stateTerrRange, officeRange, stateTerr, stateTerrData } = params;
  let firstYear = 1863;
  let lastYear = 1912;
  if (stateTerrRange && !office) {
    ({ firstYear, lastYear } = stateTerrRange);
  } else if (officeRange) {
    ({ firstYear, lastYear } = officeRange);
  }
  const backLabel = office && stateTerr
    ? getStateTerritoryLabel(stateTerr, yearNum, stateTerrData?.name)
    : 'United States';
  const backTo = office
    ? buildLink({ clearOffice: true })
    : buildLink({ clearState: true });

  return (
    <Styled.Container
      data-phone-chrome='date-header'
      $isExpanded={mapDimensions.size === 'fullscreen'}
    >
      <Styled.Header>Fiscal Year</Styled.Header>
      <Styled.Previous>
      {(yearNum > 1863 && (!firstYear || yearNum > firstYear)) && (
        <Link
          to={buildLink({ year: yearNum - 1 })}
          aria-label='Go to previous fiscal year'
        >
          <Previous />
        </Link>
        )}
      </Styled.Previous>
      <Styled.Year>{`${year}`}</Styled.Year>

      <Styled.FiscalYear>{`July 1, ${yearNum - 1} - June 30, ${year}`}</Styled.FiscalYear>
      {(yearNum !== 1912 && (!lastYear || yearNum < lastYear)) && (
        <Styled.Next>
        <Link
          to={buildLink({ year: yearNum + 1 })}
          aria-label='Go to next fiscal year'
        >
          <Next />
          </Link>
        </Styled.Next>
      )}

      <Styled.BacklinkContainer $show={mapDimensions.size === 'fullscreen' && !!stateTerr}>
        <Backlink to={backTo} label={backLabel} />
      </Styled.BacklinkContainer>
      
    </Styled.Container>
  );
}

export default TimelineDateHeader;
