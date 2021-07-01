import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
// @ts-ignore
import us from 'us';
import { makeParams } from '../utilities';
import { RouterParams } from '../index.d';
import './TimelineDateHeader.css';

const TimelineDateHeader = () => {
  const params = useParams<RouterParams>();
  const year = params.year || '1863';
  const { stateTerr, office } = params;
  return (
    <h3 id='timelineDateHeader'>
      {(year !== '1863') && (
        <Link to={makeParams(params, [{ type: 'set_year', payload: parseInt(year) - 1}])}>
          <svg
            width={20}
            height={20}
          >
            <g transform={`translate(${20 / 2} ${20 / 2}) rotate(315)`}>
              <circle
                cx={0}
                cy={0}
                r={20 / 2}
                fillOpacity={1}
              />
              <path
                d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
                fill='transparent'
                stroke='#F4DFB8'
                strokeWidth={20 / 10}
              />
            </g>
          </svg>
        </Link>
      )}
      {` ${year} `}
      {(year !== '1912') && (
        <Link to={makeParams(params, [{ type: 'set_year', payload: parseInt(year) + 1}])}>
          <svg
            width={20}
            height={20}
          >
            <g transform={`translate(${20 / 2} ${20 / 2}) rotate(135)`}>
              <circle
                cx={0}
                cy={0}
                r={20 / 2}
                fillOpacity={1}
              />
              <path
                d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
                fill='transparent'
                stroke='#F4DFB8'
                strokeWidth={20 / 10}
              />
            </g>
          </svg>
        </Link>
      )}
      {(stateTerr && !office) && (
        <React.Fragment>
          {` — ${us.lookup(stateTerr).name} `}
          <Link to={makeParams(params, [{ type: 'clear_state' }])}>
            <svg
              width={20}
              height={20}
            >
              <g transform={`translate(${20 / 2 + 1} ${20 / 2 + 1}) rotate(135)`}>
                <circle
                  cx={0}
                  cy={0}
                  r={20 / 2}
                  stroke='#38444a'
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  x2={0}
                  y1={20 / 4}
                  y2={20 / -4}
                  stroke='#F4DFB8'
                  strokeWidth={20 / 10}
                />
                <line
                  x1={20 / -4}
                  x2={20 / 4}
                  y1={0}
                  y2={0}
                  stroke='#F4DFB8'
                  strokeWidth={20 / 10}
                />
              </g>
            </svg>
          </Link>
        </React.Fragment>
      )}
      {(office) && (
        <React.Fragment>
          {`— ${office.replace(/([A-Z])/g, ' $1')},  ${stateTerr} `}
          <Link to={makeParams(params, [{ type: 'clear_office' }])}>
            <svg
              width={20}
              height={20}
            >
              <g transform={`translate(${20 / 2 + 1} ${20 / 2 + 1}) rotate(135)`}>
                <circle
                  cx={0}
                  cy={0}
                  r={20 / 2}
                  stroke='#38444a'
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  x2={0}
                  y1={20 / 4}
                  y2={20 / -4}
                  stroke='#F4DFB8'
                  strokeWidth={20 / 10}
                />
                <line
                  x1={20 / -4}
                  x2={20 / 4}
                  y1={0}
                  y2={0}
                  stroke='#F4DFB8'
                  strokeWidth={20 / 10}
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
