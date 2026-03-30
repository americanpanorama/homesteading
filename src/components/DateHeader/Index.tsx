import * as React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
// @ts-ignore
import us from '../../us';
import { useContext } from 'react';
import { DimensionsContext } from '../../DimensionsContext';
import { useLinkBuilder, useURLParams } from '../../hooks';
import { Dimensions } from '../../index.d';
import * as Styled from './styled';
import Previous from '../Buttons/Previous';
import Next from '../Buttons/Next';


const OverlayStyle = {
  maxWidth: 400,
  fontSize: 16,
  fontFamily: '"Roboto Condensed", sans-serif',
}

const TimelineDateHeader = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { mapDimensions } = useContext(DimensionsContext) as Dimensions;
  const { year, yearNum, stateTerr, office, stateTerrRange, officeRange, stateTerrData } = params;
  let firstYear = 1863;
  let lastYear = 1912;
  if (stateTerrRange && !office) {
    ({ firstYear, lastYear } = stateTerrRange);
  } else if (officeRange) {
    ({ firstYear, lastYear } = officeRange);
  }
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
    </Styled.Container>
  );
}

export default TimelineDateHeader;
