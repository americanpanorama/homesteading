import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
// @ts-ignore
import us from '../us';
import { makeParams } from '../utilities';
import { RouterParams } from '../index.d';
import PlacesDateRanges from '../../data/placesDateRanges.json';
import './TimelineDateHeader.css';
import 'rc-tooltip/assets/bootstrap_white.css';


const OverlayStyle = {
  maxWidth: 400,
  fontSize: 16,
  fontFamily: '"Roboto Condensed", sans-serif',
}

interface OfficeData {
  stub: string;
  firstYear: number;
  lastYear: number;
}

interface StateTerritoryData extends OfficeData {
  offices: OfficeData[];
}

const TimelineDateHeader = () => {
  const params = useParams<RouterParams>();
  const year = params.year || '1863';
  const { stateTerr, office } = params;
  const placesDateRanges = PlacesDateRanges as StateTerritoryData[];
  let firstYear = 1863;
  let lastYear = 1912;
  if (stateTerr && !office && placesDateRanges.find(d => d.stub === stateTerr)) {
    ({ firstYear, lastYear } = placesDateRanges.find(d => d.stub === stateTerr));
  } else if (stateTerr && office && placesDateRanges.find(d => d.stub === stateTerr).offices.find(d => d.stub === office)) {
    ({ firstYear, lastYear } = placesDateRanges.find(d => d.stub === stateTerr).offices.find(d => d.stub === office));
  }
  return (
    <h3 id='timelineDateHeader'>
      {(year > '1863' && (!firstYear || parseInt(year) > firstYear)) && (
        <Link to={makeParams(params, [{ type: 'set_year', payload: parseInt(year) - 1 }])}>
          <svg
            width={20}
            height={20}
          >
            <g
              transform={`translate(${20 / 2} ${20 / 2}) rotate(315)`}
              className='button'
            >
              <circle
                cx={0}
                cy={0}
                r={20 / 2}
              />
              <path
                d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
              />
            </g>
          </svg>
        </Link>
      )}
      <Tooltip
        placement="bottom"
        overlay={<div>To select a different year, click the buttons to advance up or back a year, or use the timeline or chart below to jump to any year.</div>}
        overlayStyle={OverlayStyle}
      >
        <span>{` ${year} `}</span>
      </Tooltip>
      {(year !== '1912' && (!lastYear || parseInt(year) < lastYear)) && (
        <Link to={makeParams(params, [{ type: 'set_year', payload: parseInt(year) + 1 }])}>
          <svg
            width={20}
            height={20}
          >
            <g
              transform={`translate(${20 / 2} ${20 / 2}) rotate(135)`}
              className='button'
            >
              <circle
                cx={0}
                cy={0}
                r={20 / 2}
              />
              <path
                d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
              />
            </g>
          </svg>
        </Link>
      )}
      {(stateTerr && !office) && (
        <React.Fragment>
          {` — ${us.lookup(stateTerr).name}${(!us.lookup(stateTerr).statehood_year || parseInt(year) < us.lookup(stateTerr).statehood_year) ? ' Terr.' : ''} `}
          <Link to={makeParams(params, [{ type: 'clear_state' }])}>
            <svg
              width={20}
              height={20}
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
      )}
      {(office) && (
        <React.Fragment>
          {`— ${office.replace(/([A-Z])/g, ' $1')}, ${us.lookup(stateTerr).ap_abbr}${(!us.lookup(stateTerr).statehood_year || us.lookup(stateTerr).statehood_year > parseInt(year)) ? ' Terr.' : ''} `}
          <Link to={(['IL', 'IN', 'OH', 'MS'].includes(stateTerr)) ? makeParams(params, [{ type: 'clear_state' }]) : makeParams(params, [{ type: 'clear_office' }])}>
            <svg
              width={20}
              height={20}
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
      )}
    </h3>
  );
}

export default TimelineDateHeader;
