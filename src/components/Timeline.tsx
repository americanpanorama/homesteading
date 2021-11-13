import * as React from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import * as d3 from 'd3';
// @ts-ignore
import us from '../us';
import Row from './TimelineRow';
import { makeParams, useClaimsAndPatentsTypes, colorGradient, acresValue } from '../utilities';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, TimelineYearPlaceData, TimelinePlaceData, TimelineRowStyled, RouterParams } from '../index.d';
import './Timeline.css';
import './ChartButton.css';

type sortOptions = 'descending' | 'chronological' | 'alphabetical';

export const monthNum = (m: number): number => (m - 1) / 12;
export const getTimeCode = (year: number, month: number): number => year * 100 + month;
export const timeCodeToNum = (timecode: number): number => Math.floor(timecode / 100) + monthNum(timecode % 100);

const TimelineHeatmap = () => {
  const { useState, useEffect, useContext } = React;
  const params = useParams<RouterParams>();
  const { stateTerr, view } = params;
  const year = params.year || '1863';
  const { width, height } = (useContext(DimensionsContext) as Dimensions).timelineDimensions;
  const [data, setData] = useState<any>();

  const { acresTypes: types, countTypes, numberLabel, acresLabel } = useClaimsAndPatentsTypes();

  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/timelineData/${stateTerr || 'national'}.json`)
      .then(response => {
        setData(response.data);
      });
  }, [stateTerr]);

  const [sortBy, setSortBy] = useState<sortOptions>('descending');

  const x = d3.scaleLinear()
    .domain([1862, 1912])
    .range([260, width - 25]);

  const cellWidth: number = x(1870) - x(1869);

  const formatPlaces = (placeData: TimelinePlaceData[]): TimelineRowStyled[] => {
    // organize a list of the photographers with some basic display info
    const rows: TimelineRowStyled[] = placeData
      .sort((a, b) => {
        if (sortBy === 'alphabetical') {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
        }
        if (sortBy === 'descending') {
          const officeAData = a.yearData.find(yd => yd.year === parseInt(year));
          const officeAPercent = (officeAData && officeAData.area) ? acresValue(officeAData, types) / officeAData.area : 0;
          const officeBData = b.yearData.find(yd => yd.year === parseInt(year));
          const officeBPercent = (officeBData && officeBData.area) ? acresValue(officeBData, types) / officeBData.area : 0;
          return officeBPercent - officeAPercent;
        }
        if (sortBy === 'chronological') {
          return a.medianYearClaimsAcres - b.medianYearClaimsAcres;
        }
        return 0;
      })
      .map((d, i) => {
        const dataForSelectedYear = d.yearData.find(yd => yd.year === parseInt(year));
        const active = !!dataForSelectedYear;
        let fill = (active) ? 'gold' : 'silver';

        const styledRow: TimelineRowStyled = {
          label: `${d.name}${(!stateTerr && d.name !== 'North Dakota' && d.name !== 'South Dakota' && (!us.lookup(d.name) || !us.lookup(d.name).statehood_year || parseInt(year) < us.lookup(d.name).statehood_year)) ? ' Terr.' : ''}`,
          cells: d.yearData.map((yd: TimelineYearPlaceData) => {
            const acres = types.reduce((acc, curr) => yd[curr] + acc, 0);
            return {
              x: x(yd.year) + 1,
              //y: (yd.area !== 0 && yd.acres_claimed > 0) ? 18 - (6 + 12 * Math.min(1, yd.acres_claimed * 100 / yd.area))  : 0,
              width: cellWidth - 2,
              height: (yd.area !== 0 && acres > 0) ? 8 + 10 * Math.min(1, acres * 20 / yd.area) : 0,
              fill: colorGradient(acres / yd.area),
              fillOpacity: 1, // (yd.area !== 0 && yd.acres_claimed > 0) ? 0.5 + 0.5 * yd.acres_claimed * 25 / yd.area : 0,
            }
          }),
          acres: (dataForSelectedYear) ? types.reduce((acc, curr) => dataForSelectedYear[curr] + acc, 0) : null,
          number: (dataForSelectedYear) ? countTypes.reduce((acc, curr) => dataForSelectedYear[curr] + acc, 0) : null,
          conflicts: [],
          active,
          fill: (active) ? '#aaa' : '#444',
          width,
          y: i * 25,
          height: 20,
          labelSize: 14,
          emphasize: false,
          linkTo: (stateTerr)
            ? makeParams(params, [{ type: 'set_office', payload: d.name.replace(/[^a-zA-Z0-9]/g, '') }])
            : makeParams(params, [{ type: 'set_state', payload: (us.lookup(d.name)) ? us.lookup(d.name).abbr : '' }]),
        };

        // add the conflicts
        d.yearData.forEach((yd: TimelineYearPlaceData) => {
          if (yd.conflicts) {
            yd.conflicts.forEach(conflict => {
              const xValue = x(conflict.start_date.year + (conflict.start_date.month - 1) / 12 + conflict.start_date.day / 365);
              const xRadius = Math.max(2.83, Math.sqrt(conflict.native_casualties + conflict.us_casualties) * 0.4)
              const strokeWidth = xRadius / 2;
              if (!styledRow.conflicts.map(d => d.x).includes(xValue)) {
                styledRow.conflicts.push({
                  x: xValue,
                  strokeWidth,
                  xRadius,
                });
              }
            });
          }
        });
        return styledRow;
      });

    return rows;
  }

  const rows = (data) ? formatPlaces(data) : [];
  const rowHeight = 25;

  return (
    <div className='timeline'>

      <div
        style={{
          height: Math.min(height, rows.length * rowHeight + 300)
        }}
      >
        <nav className='chart'>
          <div>
            sort by:
          </div>
          <div>
            <button
              onClick={() => { setSortBy('descending'); }}
              className={(sortBy === 'descending') ? 'selected' : ''}
            >
              Descending %
            </button>
            <button
              onClick={() => { setSortBy('chronological'); }}
              className={(sortBy === 'chronological') ? 'selected' : ''}
            >
              Chronologically
            </button>
            <button
              onClick={() => { setSortBy('alphabetical'); }}
              className={(sortBy === 'alphabetical') ? 'selected' : ''}
            >
              Alphabetically
            </button>

          </div>
        </nav>
        <svg
          width={width}
          height={95}
        >
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {[0, 0.000001, 0.01, 0.02, 0.03, 0.04, 0.05].map(percent => (
                <stop
                  offset={`${percent * 2000}%`}
                  style={{
                    stopColor: colorGradient(percent)
                  }}
                  key={`gradientOffsetFor${percent}`}
                />
              ))}
            </linearGradient>
          </defs>
          <g transform='translate(0 20)' className='axisLabels'>
            <path
              d={`M ${x(1880)} 10 L ${x(1895)} 6 v 16 L ${x(1880)} 18`}
              fill='url(#timelineGradient)'
            />
            <text
              x={x(1888)}
              y={0}
              textAnchor='middle'
            >
              {`percent of ${(!stateTerr) ? 'state or territory' : 'district'} area ${acresLabel}`}
              <tspan
                x={x(1879)}
                dy={20}
                textAnchor='end'
              >
                0%
              </tspan>
              <tspan
                x={x(1896)}
                dy={0}
                textAnchor='start'
              >
                {`5% or more`}
              </tspan>
            </text>
          </g>
          <g transform='translate(0 60)' className='axisLabels'>
            <text
              x={190}
              y={0}
              textAnchor='end'
            >
              number
              <tspan
                x={190}
                dy={20}
              >
                of {numberLabel}
              </tspan>
            </text>

            <text
              x={255}
              y={0}
              textAnchor='end'
            >
              acres
              <tspan
                x={255}
                dy={20}
              >
                {acresLabel}
              </tspan>
            </text>

            {/* year tick marks */}
            {[1870, 1880, 1890, 1900, 1910].map((year: number) => (
              <text
                x={x(year + 0.5)}
                y={20}
                textAnchor='middle'
                key={`yearAxisFor${year}`}
                style={{ fontSize: '1.25em' }}
              >
                {year}
              </text>
            ))}
          </g>
        </svg>

        {(rows) && (
          <div
            id='timelineRows'
          >
            <svg
              width={width}
              height={rows.length * rowHeight + 50}
            >
              <g transform='translate(0 10)'>
                <rect
                  x={x(parseInt(year))}
                  y={-10}
                  width={x(parseInt(year) + 2) - x(parseInt(year) + 1)}
                  height={rows.length * rowHeight + 20}
                  fill='#575653'
                />

                {/* year tick marks */}
                {[1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910].map((y: number) => (
                  <line
                    x1={x(y + 0.5)}
                    x2={x(y + 0.5)}
                    y1={0}
                    y2={rows.length * rowHeight + 10}
                    stroke='white'
                    strokeOpacity={0.3}
                    key={`tickFor${y}`}
                  />
                ))}
                {rows.map(p => (
                  <Row
                    {...p}
                    emphasize={false}
                    width={width}
                    labelSize={18}
                    key={`timelineRowFor${p.label}`}
                  />
                ))}

                {[...Array(50).keys()].map(d => d + 1863).map(y => (
                  <Link
                    to={makeParams(params, [{ type: 'set_year', payload: y }])}
                    key={`linkFor${y}`}
                  >
                    <rect
                      x={x(y)}
                      y={0}
                      width={x(1863) - x(1862)}
                      height={rows.length * rowHeight + 10}
                      fill='transparent'
                      stroke={'transparent'}
                    />
                  </Link>
                ))}
              </g>
            </svg>
          </div>

        )}
      </div>
    </div>
  );
};

export default TimelineHeatmap;
