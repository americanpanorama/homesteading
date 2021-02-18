import * as React from 'react';
import { Link } from 'react-router-dom';
import Async from "react-async";
import * as d3 from 'd3';
import Row from './TimelineRow';
import './Timeline.css';
import DimensionsContext from '../DimensionsContext';
import { Dimensions, TimelineYearPlaceData, TimelinePlaceData, TimelineCell, TimelineRowStyled } from '../index.d';
import { Props } from './Timeline.d';

const loadTimelineCells = async ({ fetchPath }: { fetchPath: string}) => {
  const res = await fetch(fetchPath);
  if (!res.ok) { console.log(res) }
  const rawData = await res.json();
  return rawData;
}

export const monthNum = (m: number): number => (m - 1) / 12;
export const getTimeCode = (year: number, month: number): number => year * 100 + month;
export const timeCodeToNum = (timecode: number): number => Math.floor(timecode / 100) + monthNum(timecode % 100);

const TimelineHeatmap = (props: Props) => {
  const { useRef, useState, useContext } = React;
  const {
    fetchPath,
    selectedState,
    timeRange,
  } = props;


  const dimensions: Dimensions = useContext(DimensionsContext);
  const {
    leftAxisWidth,
    width,
    height,
    labelsWidth,
  } = dimensions.timelineDimensions;

  const [showOthers, setShowOthers] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState(null);

  const clearLink = ''; //makeLink([{ type: 'clear_photographer' }]);

  const onHover = (place: string): void => {
    if (hoveredPlace !==(place)) {
      setHoveredPlace(place);
    }
  };

  const onUnhover = (): void => {
    if (hoveredPlace) {
      setHoveredPlace(null);
    }
  };
  const x = d3.scaleLinear()
    .domain([1862, 1912])
    .range([leftAxisWidth, width - leftAxisWidth]);

  const formatPlaces = (placeData: TimelinePlaceData[]): TimelineRowStyled[] => {
    // calculate the witeh of the month/cell
    const cellWidth: number = x(1863) - x(1862) - 2;

    const threshold = 500;
    // organize a list of the photographers with some basic display info
    const rows: TimelineRowStyled[] = placeData
      .sort((a, b) => a.medianYearClaimsAcres - b.medianYearClaimsAcres)
      .map((d, i) => {
        const active = true; // (monthTotals.map(tc => tc.pk).includes(p.key)
          //&& timeRange[1] > p.firstDate && timeRange[0] < p.lastDate);
        let fill = (active) ? 'gold' : 'silver';
        // if ((selectedPhotographer) && active && p.key !== selectedPhotographer && p.key !== hoveredPhotographer) {
        //   fill = '#777';
        // }
        const fillOpacity = 0;
        return {
          label: d.name,
          cells: d.yearData.map((yd: TimelineYearPlaceData) => ({
            x: x(yd.year) + 1,
            //y: (yd.area !== 0 && yd.acres_claimed > 0) ? 18 - (6 + 12 * Math.min(1, yd.acres_claimed * 100 / yd.area))  : 0,
            width: cellWidth,
            height: (yd.area !== 0 && yd.acres_claimed > 0) ? 6 + 12 * Math.min(1, yd.acres_claimed * 100 / yd.area) : 0,
            fill: d3.interpolatePuBu(1 - yd.acres_claimed * 100 / yd.area), //'gold',
            fillOpacity: (yd.area !== 0 && yd.acres_claimed > 0) ? 0.5 + 0.5 * yd.acres_claimed * 100 / yd.area : 0,
          })),
          active,
          fill,
          width,
          y: i * 20,
          height: 20,
          labelSize: 14,
          emphasize: false,
          linkTo: '', //makeLink([{ type: 'set_photographer', payload: p.key }]),
          onHover,
        };
      });

    return rows;
  }
  
  return (
    <Async
      promiseFn={loadTimelineCells}
      fetchPath={fetchPath}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        //if (isPending) return "Loading..."
        if (error) return `Something went wrong with the timeline: ${error.message}`
        if (data) {
          const rows = formatPlaces(data);

          console.log(rows);

          // the +/-2 here are to leave room for the collective "other photographers" when they aren't individual shown
          const rowHeight = 20;
          const cellHeight = rowHeight - 2;
          const labelSize = 12;

          const paddingTop = 20;
          return (
            <div
              className='timeline'
              style={{
                overflowY: 'scroll',
                height: height + paddingTop * 2,
                zIndex: 1001,
              }}
            >
              <div
                style={{
                  paddingTop,
                }}
              >
                <svg
                  width={width + leftAxisWidth}
                  height={height}
                >

                {/* year tick marks */}
                {[1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910].map((year: number) => (
                  <g key={`tickFor${year}`}>
                    <line 
                      x1={x(year)}
                      x2={x(year)}
                      y1={0}
                      y2={rows.length * 20 + 10}
                      stroke='white'
                      strokeOpacity={0.3}
                    />
                    {(year % 10 === 0) && (
                      <text
                        x={x(year)}
                        y={rows.length * 20 + 25}
                        textAnchor='middle'
                      >
                        {year}
                      </text>
                    )}
                  </g>
                ))}

                {/* tip and control to clear photographer 
                  <g
                    transform={`translate(${leftAxisWidth} ${svgheight - 200})`}
                  >
                    {(selectedPhotographer) ? (
                      <Link
                        to={clearLink}
                      >
                        <g transform={'translate(-15 0)'}>
                          <line
                            x1={-8}
                            x2={8}
                            y1={-8}
                            y2={8}
                            strokeWidth={18 / 9}
                            stroke='black'
                          />
                          <line
                            x1={-8}
                            x2={8}
                            y1={8}
                            y2={-8}
                            strokeWidth={18 / 9}
                            stroke='black'
                          />
                        </g>
                        <text
                          x={-30}
                          y={0}
                          textAnchor='end'
                          fontSize={15}
                        >
                          <tspan>
                            clear selected
                          </tspan>
                          <tspan
                            x={-30}
                            dy={svgheight / rows.length * 1.75}
                          >
                            photographer
                          </tspan>
                        </text>
                      </Link>
                    ) : (
                      <text
                        x={-15}
                        y={0}
                        textAnchor='end'
                        fontSize={Math.min(18, svgheight / rows.length * 1.25)}
                        className='tip'
                      >
                        <tspan>
                          To select a photographer
                        </tspan>
                        <tspan
                          x={-15}
                          dy={15}
                        >
                          click on their name
                        </tspan>
                      </text>
                    )}
                  </g> */}

                  {/* the legend 
                  <g
                    transform={`translate(${leftAxisWidth /2} ${height - 125})`}
                    className='legend'
                  >
                    <text
                      textAnchor='middle'
                      fontSize={Math.min(16, monthHeight * 1.2)}
                      y={monthHeight * 2.5 + Math.min(40, monthHeight * 2.5)}
                      fill='#666'
                    >
                      # of photos taken each month
                    </text> 

                    <defs>
                      <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"
                          style={{
                            stopOpacity: 0.1,
                          }}
                        />
                        <stop offset="100%" 
                          style={{
                            stopOpacity: 1,
                          }} />
                      </linearGradient>
                    </defs>

                    <rect 
                      x={leftAxisWidth * -1 / 4}
                      y={monthHeight * 1}
                      width={leftAxisWidth * 2 / 4}
                      height={monthHeight * 1.5}
                      fill="url(#legendGrad)"
                    />

                    <g
                      className='axis'
                      transform={`translate(0 ${monthHeight * 2.5 + Math.min(18, monthHeight * 1.25)})`}
                    >
                      <text
                        fontSize={Math.min(16, monthHeight * 1.2)}
                        x={leftAxisWidth * -1 / 4}
                      >
                        0
                      </text>
                      <text
                        fontSize={Math.min(16, monthHeight * 1.2)}
                      >
                        175
                      </text>
                      <text
                        x={leftAxisWidth * 1 / 4}
                        fontSize={Math.min(16, monthHeight * 1.2)}
                      >
                        350+
                      </text>
                    </g>
                  </g> */}

                  {rows.map(p => (
                    <Row
                      {...p}
                      emphasize={false}
                      //photographerKey={p.label}
                      width={width}
                      height={height}
                      labelSize={18}
                      key={`timelineRowFor${p.label}`}
                      onHover={onHover}
                      onUnhover={onUnhover}
                    />
                  ))}
                </svg>
              </div>
            </div>
          );
        }
      }}
    </Async>
  );
};

export default TimelineHeatmap;
