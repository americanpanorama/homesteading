import * as React from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import DimensionsContext from '../DimensionsContext';
import { Dimensions, RouterParams } from '../index.d';
import Line from './LineChartLine';
import './LineChart.css';

interface ChartPoint {
  year: number;
  value: number;
}

type LineData = ChartPoint[];

type ChartData = {
  linesData: {
    lineData: ChartPoint[];
    color: string;
    label: string;
  }[];
  yMax: number;
};

interface ChartPointPlotted extends ChartPoint {
  x: number;
  y: number;
  transparent: boolean;
}

interface ColorStop {
  offset: number;
  transparent: boolean;
}

type YTicks = number[];

const LineChart = ({ chartData, label }: {chartData: ChartData, label: string}) => {
  const { useContext, useEffect } = React;
  const params = useParams<RouterParams>();
  const { year } = params;
  const { width, leftAxisWidth } = (useContext(DimensionsContext) as Dimensions).timelineDimensions;
  const x = d3.scaleLinear()
    .domain([1862, 1912])
    .range([235, width - 25]);

  const height = 170;

  let yTicks: YTicks = [];
  const base10 = Math.floor(Math.log10(chartData.yMax));
  const baseMax = chartData.yMax / Math.pow(10, base10) * 1.1;
  if (baseMax < 1.5) {
    yTicks = [0.25, 0.5, 0.75, 1, 1.25, 1.5]
      .filter(x => x <= baseMax)
      .map(x => x * Math.pow(10, base10));
  } else if (baseMax < 3.6) {
    yTicks = [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
      .filter(x => x <= baseMax)
      .map(x => x * Math.pow(10, base10));
  } else if (baseMax < 7.1) {
    yTicks = [1, 2, 3, 4, 5, 6, 7]
      .filter(x => x <= baseMax)
      .map(x => x * Math.pow(10, base10));
  } else if (baseMax < 10) {
    yTicks = [2, 4, 6, 8]
      .filter(x => x <= baseMax)
      .map(x => x * Math.pow(10, base10));
  } 

  const y = d3.scaleLinear()
    .domain([0, chartData.yMax * 1.1])
    .range([height, 40]);

  const line = d3.line<ChartPoint>()
    .curve(d3.curveCatmullRom)
    .x((d: ChartPoint) => x(d.year))
    .y((d: ChartPoint) => y(d.value));

  return (
    <svg
      width={width}
      height={height}
      className='lineChart'
    >
      <text 
        x={180}
        y={height / 2 - 30}
        className='label'
      >
        {label.split(' ').map((w, idx) => (
          <tspan
            key={`${label}-${idx}`}
            x={180}
            dy={30}
          >
            {w}
          </tspan>
        ))}
      </text>

      {/* y axes tick marks */}
      {yTicks.map(yTick => (
        <g
          className='tick y'
          key={`ticksFor${yTick}`}
        >
          <text
            x={230}
            y={y(yTick) + 6}
          >
            {(yTick >= 100000) ? `${Math.round(yTick / 1000).toLocaleString()}K` : ''}
            {(yTick < 100000 && yTick >= 1000) ? `${(Math.round(yTick / 100) / 10).toLocaleString()}K` : ''}
            {(yTick < 1000) ? Math.round(yTick).toLocaleString() : ''}
          </text>
          <line
            x1={x(1863)}
            x2={x(1912)}
            y1={y(yTick)}
            y2={y(yTick)}
          />

        </g>
      ))}
      <rect
        x={x(parseInt(year) - 0.5) - 1}
        y={40}
        width={x(1863) - x(1862) + 2}
        height={height}
        className='selectedHighlight'
      />
      {/* year tick marks */}
      {[1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910].map((year: number) => (
        <g
          key={`tickFor${y}`}
          className='tick x'
        >
          <line 
            x1={x(year + 0.5)}
            x2={x(year + 0.5)}
            y1={40}
            y2={height}
          />
          {(year % 10 === 0) && (
            <text
              x={x(year + 0.5)}
              y={35}
            >
              {year}
            </text>
          )}
        </g>
      ))}s

      {chartData.linesData.map(ld => {
        {/* append fill in the line for years that have no data, which will be rendered as transparent */}
        const firstPoint = ld.lineData.find(d => d.year === Math.min(...ld.lineData.map(d => d.year)));
        const lastPoint = ld.lineData.find(d => d.year === Math.max(...ld.lineData.map(d => d.year)));
        const lineData: ChartPoint[] = Array.from(Array(50).keys())
          .map(x => x + 1863)
          .map(y => {
            if (y < firstPoint.year) {
              return {
                year: y,
                value: firstPoint.value,
              };
            } else if (ld.lineData.find(d => d.year === y)) {
              return ld.lineData.find(d => d.year === y);
            } else if (y > lastPoint.year) {
              return {
                year: y,
                value: lastPoint.value,
              };
            } else {
              return {
                year: y,
                value: 0,
              }
            }
          });

{/*        const plottedPoints: ChartPointPlotted[] = Array.from(Array(50).keys())
          .map(x => x + 1863)
          .map(y => {
            if (y < firstPoint.year) {
              return {
                year: y,
                value: firstPoint.value,
                x: x(y),
                y: y(firstPoint.value),
                transparent: true,
              };
            } else if (ld.lineData.find(d => d.year === y)) {
              return {
                ...ld.lineData.find(d => d.year === y),
                x: x(y),
                y: y(ld.lineData.find(d => d.year === y).value),
                transparent: false,
              };
            } else if (y > lastPoint.year) {
              return {
                year: y,
                value: lastPoint.value,
                x: x(y),
                y: y(lastPoint.value),
                transparent: true,
              };
            } else {
              return {
                year: y,
                value: 0,
                x: x(y),
                y: y(0),
                transparent: true,
              }
            }
          });
        console.log(plottedPoints);*/}
        const colorStops: ColorStop[] = [{
          offset: 0,
          transparent: firstPoint.year > 1863,
        }];
        Array.from(Array(48).keys())
          .map(x => x + 1864)
          .forEach(y => {
            if (ld.lineData.find(d => d.year === y) && colorStops[colorStops.length - 1].transparent) {
              colorStops.push({
                offset: (y - 1863) / 50,
                transparent: true,
              }, {
                offset: (y - 1863) / 50,
                transparent: false,
              });  
            } else if (!ld.lineData.find(d => d.year === y) && !colorStops[colorStops.length - 1].transparent)
              colorStops.push({
                offset: (y - 1863) / 50,
                transparent: false,
              }, {
                offset: (y - 1863) / 50,
                transparent: true,
              });  
          });

        colorStops.push({
          offset: 1,
          transparent: false,
        });

        return (
          <Line 
            d={line(lineData)}
            colorStops={colorStops}
            color={ld.color}
            id={`chartFor${ld.label.replace(/\s/g, '')}`}
            key={`chartFor${ld.label}`}
          />
        );
      })}
    </svg>
  );
}

export default LineChart;
      
