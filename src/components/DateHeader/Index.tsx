import * as React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
// @ts-ignore
import us from '../../us';
import { useContext } from 'react';
import { DimensionsContext } from '../../DimensionsContext';
import { useURLParams } from '../../hooks';
import { Dimensions } from '../../index.d';
import { makeParams } from '../../utilities';
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
    <Styled.Container $isExpanded={mapDimensions.size === 'fullscreen'}>
      <Styled.Header>Fiscal Year</Styled.Header>
      <Styled.Previous>
      {(yearNum > 1863 && (!firstYear || yearNum > firstYear)) && (
        <Link
          to={makeParams(params, [{ type: 'set_year', payload: yearNum - 1 }])}
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
          to={makeParams(params, [{ type: 'set_year', payload: yearNum + 1 }])}
          aria-label='Go to next fiscal year'
        >
          <Next />
          </Link>
        </Styled.Next>
      )}
      {/* {(stateTerr && !office) && (
        <React.Fragment>
          {` — ${(stateTerrData || us.lookup(stateTerr)).name}${(!us.lookup(stateTerr).statehood_year || yearNum < us.lookup(stateTerr).statehood_year) ? ' Terr.' : ''} `}
          <Link
            to={makeParams(params, [{ type: 'clear_state' }])}
            aria-label='Clear selected state or territory'
          >
            <svg
              width={20}
              height={20}
              aria-hidden='true'
              focusable='false'
            >
              <g
                transform={`translate(${20 / 2 + 1} ${20 / 2 + 1}) rotate(135)`}
                className='button'
              >
                <circle
                  cx={0}
                  cy={0}
                  r={20 / 2}
                />
                <line
                  x1={0}
                  x2={0}
                  y1={20 / 4}
                  y2={20 / -4}
                />
                <line
                  x1={20 / -4}
                  x2={20 / 4}
                  y1={0}
                  y2={0}
                />
              </g>
            </svg>
          </Link>
        </React.Fragment>
      )} */}
      {/* {(office) && (
        <React.Fragment>
          {`— ${office.replace(/([A-Z])/g, ' $1')}, ${us.lookup(stateTerr).ap_abbr}${(!us.lookup(stateTerr).statehood_year || us.lookup(stateTerr).statehood_year > yearNum) ? ' Terr.' : ''} `}
          <Link
            to={(['IL', 'IN', 'OH', 'MS'].includes(stateTerr)) ? makeParams(params, [{ type: 'clear_state' }]) : makeParams(params, [{ type: 'clear_office' }])}
            aria-label='Clear selected office'
          >
            <svg
              width={20}
              height={20}
              aria-hidden='true'
              focusable='false'
            >
              <g
                transform={`translate(${20 / 2 + 1} ${20 / 2 + 1}) rotate(135)`}
                className='button'
              >
                <circle
                  cx={0}
                  cy={0}
                  r={20 / 2}
                />
                <line
                  x1={0}
                  x2={0}
                  y1={20 / 4}
                  y2={20 / -4}
                />
                <line
                  x1={20 / -4}
                  x2={20 / 4}
                  y1={0}
                  y2={0}
                />
              </g>
            </svg>
          </Link>
        </React.Fragment>
      )} */}
    </Styled.Container>
  );
}

export default TimelineDateHeader;
