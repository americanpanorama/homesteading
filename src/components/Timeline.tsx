import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAsync } from 'react-async';
import * as d3 from 'd3';
// @ts-ignore
import us from 'us';
import TimelineDateHeader from './TimelineDateHeader';
import TimelinePlaceHeader from './TimelinePlaceHeader';
import Row from './TimelineRow';
import { makeParams } from '../utilities';
import DimensionsContext from '../DimensionsContext';
import { Dimensions, TimelineYearPlaceData, TimelinePlaceData, TimelineCell, TimelineRowStyled, TimelineConflict, RouterParams } from '../index.d';
import './Timeline.css';

type sortOptions = 'descending' | 'chronological' | 'alphabetical';

const loadTimelineCells = async ({ place }: { place: string}) => {
  const res = await fetch(`${process.env.PUBLIC_URL}/data/timelineData/${place}.json`);
  if (!res.ok) { console.log(res) }
  const rawData = await res.json();
  return rawData;
}

export const monthNum = (m: number): number => (m - 1) / 12;
export const getTimeCode = (year: number, month: number): number => year * 100 + month;
export const timeCodeToNum = (timecode: number): number => Math.floor(timecode / 100) + monthNum(timecode % 100);

const TimelineHeatmap = () => {
  const { useRef, useState, useContext } = React;
  const params = useParams<RouterParams>();
  const { year, placeId, stateTerr } = params;
  const {
    leftAxisWidth,
    width,
    height,
    labelsWidth,
  } = (useContext(DimensionsContext) as Dimensions).timelineDimensions;

  const [sortBy, setSortBy] = useState<sortOptions>('alphabetical');

console.log(width);
  const x = d3.scaleLinear()
    .domain([1862, 1912])
    .range([260, width - 25]);

  const cellWidth: number = x(1863) - x(1862);

  const { data, error }: {data: any, error: any} = useAsync({ 
    promiseFn: loadTimelineCells,
    place: stateTerr || 'national',
    watch: stateTerr
  });

  const formatPlaces = (placeData: TimelinePlaceData[]): TimelineRowStyled[] => {
    // calculate the witeh of the month/cell
    
    const threshold = 500;
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
          const officeAPercent = (officeAData && officeAData.area) ? officeAData.acres_claimed / officeAData.area : 0;
          const officeBData = b.yearData.find(yd => yd.year === parseInt(year));
          const officeBPercent = (officeBData && officeBData.area) ? officeBData.acres_claimed / officeBData.area : 0;
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
          label: d.name,
          cells: d.yearData.map((yd: TimelineYearPlaceData) => ({
            x: x(yd.year) + 1,
            //y: (yd.area !== 0 && yd.acres_claimed > 0) ? 18 - (6 + 12 * Math.min(1, yd.acres_claimed * 100 / yd.area))  : 0,
            width: cellWidth - 2,
            height: (yd.area !== 0 && yd.acres_claimed > 0) ? 8 + 8 * Math.min(1, yd.acres_claimed * 25 / yd.area) : 0,
            fill: d3.interpolateCividis(yd.acres_claimed * 25 / yd.area), //'gold',
            fillOpacity: 1, // (yd.area !== 0 && yd.acres_claimed > 0) ? 0.5 + 0.5 * yd.acres_claimed * 25 / yd.area : 0,
          })),
          acres_claimed: (dataForSelectedYear) ? dataForSelectedYear.acres_claimed : null,
          claims: (dataForSelectedYear) ? dataForSelectedYear.claims : null,
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
            : makeParams(params, [{ type: 'set_state', payload: (us.lookup(d.name)) ? us.lookup(d.name).abbr : ''}]), 
        };

        // add the conflicts
        d.yearData.forEach((yd: TimelineYearPlaceData) => {
          if (yd.conflicts) {
            yd.conflicts.forEach(conflict => {
              styledRow.conflicts.push({
                x: x(conflict.start_date.year + (conflict.start_date.month - 1) / 12 + conflict.start_date.day / 365),
              });
            });
          }
        });
        return styledRow;
      });

    return rows;
  }

  const rows = (data) ? formatPlaces(data) : [];

  const rowHeight = 25;
  const cellHeight = rowHeight - 2;
  const labelSize = 12;
  const paddingTop = 20;

  
  return (
    <div className='timeline'>
      <TimelineDateHeader />
      <div
        style={{
          height: Math.min(height, rows.length * rowHeight + 300)
        }}
      >
        <nav>
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
          width={width + leftAxisWidth}
          height={95}
        >
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(percent => (
                <stop
                  offset={`${percent}%`}
                  style={{
                    stopColor: d3.interpolateCividis(percent / 100)
                    //stopColor: d3.scaleLinear<string>().domain([0,1]).range(['#F67280', '#355C7D'])(percent/100)
                  }}
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
              {`percent of ${(!stateTerr) ? 'state or territory' : 'district' } area claimed`}
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
                {`0.25% or more`}
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
                of claims
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
                claimed
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
              width={width + leftAxisWidth}
              height={rows.length * rowHeight + 40}
            >

            <rect
              x={x(parseInt(year))}
              y={0}
              width={x(parseInt(year) + 1) - x(parseInt(year))}
              height={rows.length * rowHeight + 10}
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
                  to={makeParams(params, [{ type: 'set_year', payload: y}])}
                  key={`linkFor${y}`}
                >
                  <rect
                    x={x(y)}
                    y={0}
                    width={x(1863) - x(1862)}
                    height={rows.length * 20 + 10}
                    fill='transparent'
                    stroke={'transparent'}
                  />
                </Link>
              ))}
            </svg>
          </div>

        )}
      </div>
    </div>
  );
};

export default TimelineHeatmap;
