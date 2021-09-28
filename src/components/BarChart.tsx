import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import * as d3 from 'd3';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, RouterParams, TimelinePlaceDataWithStats } from '../index.d';
import { YTick as YTickI, GraphedDataForYear, GraphedDataForYearWithDimensions, BarSet as BarSetI } from './Barchart.d';
import { makeParams, getYTicks, barHeightFunction, yOffsetFromBottom } from '../utilities';
import YTick from './YTick';
import BarSet from './BarSet';
import './ChartButton.css';

type SelectedView = 'number' | 'acres' | 'average_size';

const BarChart = ({ chartData, stacked, selectedView, label }: {chartData: TimelinePlaceDataWithStats, stacked: boolean, selectedView: SelectedView, label: string}) => {
  const { useContext, useEffect, useState } = React;
  const params = useParams<RouterParams>();
  const year = params.year || '1863';
  const {
     xAxisHeight,
     yAxisWidth,
     paddingTop,
     chartBodyHeight,
     chartBodyWidth,
     height,
  } = (useContext(DimensionsContext) as Dimensions).officeBarchartDimensions;

  // data stats
  const earliestYear = Math.min(...chartData.yearData.map(d => d.year));
  const lastYear = Math.max(...chartData.yearData.map(d => d.year));
  const graphedData: GraphedDataForYear[] = chartData.yearData.map(d => ({
    year: d.year,
    federal_lands: {
      number: d.claims,
      acres: d.acres_claimed,
      average_size: (d.claims) ? Math.round(d.acres_claimed / d.claims * 10) / 10 : 0,
    }[selectedView],
    indian_lands: {
      number: d.claims_indian_lands,
      acres: d.acres_claimed_indian_lands,
      average_size: (d.claims_indian_lands) ? Math.round(d.acres_claimed_indian_lands / d.claims_indian_lands) : 0,
    }[selectedView],
  }));
  const selectedYearData: GraphedDataForYear = graphedData.find(d => d.year === parseInt(year));
  const maxValue = (stacked && (selectedView === 'number' || selectedView === 'acres'))
    ? Math.max(...graphedData.map(d => d.federal_lands + d.indian_lands)) * 1.1
    : Math.max(...graphedData.map(d => d.federal_lands), ...graphedData.map(d => d.indian_lands))  * 1.1;

  // dimsensions
  const yearWidth = chartBodyWidth / (lastYear - earliestYear + 1);
  const barWidth = yearWidth - 2;

  const x = d3.scaleLinear()
    .domain([earliestYear, lastYear])
    .range([yearWidth / 2, chartBodyWidth - yearWidth / 2]);

  const barHeight = barHeightFunction(maxValue);

  const barSets: BarSetI[] = graphedData.map(d => ({
    year: d.year,
    x: x(d.year) - yearWidth / 2,
    bars: [
      {
        width: barWidth,
        height: barHeight(d.federal_lands),
        className: `federal_lands${(d.year === parseInt(year) ? ' selected' : '')}`,
      },
      {
        width: barWidth,
        height: barHeight(d.indian_lands),
        className: `indian_lands${(d.year === parseInt(year) ? ' selected' : '')}`,
      }
    ],
  }));
  // filter bars to remove any categories for which this is no data across all the years
  barSets.forEach(barSet => {
    barSet.bars = barSet.bars.filter((bar, ind) => {
      if ((ind === 0 && chartData.total_claims_federal_lands === 0)
        || (ind === 1 && chartData.total_claims_indian_lands === 0)) {
        return false;
      }
      return true;
    });
  });

  const yTicks = getYTicks(maxValue);
  const years = [...Array(lastYear - earliestYear).keys()].map(d => d + earliestYear);

  const yearTicks = years.filter(d => d % 5 === 0);

  // data labels 
  const barLabel: string = `${Math.round(selectedYearData.federal_lands + selectedYearData.indian_lands).toLocaleString()} ${(selectedView === 'number') ? 'claims' : 'acres'}`;

  return (
    <React.Fragment>
      <h2>Claims</h2>

    <svg
        width={chartBodyWidth + yAxisWidth}
        height={height}
        className='lineChart'
      >

        {/* y axes tick marks */}
        <g
          transform={`translate(${yAxisWidth} ${xAxisHeight})`}
        >
          {yTicks.map(yTick => (
            <YTick
              tick={yTick}
              width={chartBodyWidth}
              key={`yTickFor${yTick.value}`}
            />
          ))}
        </g>

        <g
          transform={`translate(${yAxisWidth} ${paddingTop})`}
        >
          {/* year tick marks */}
          {yearTicks.map((year: number) => (
            <g
              key={`tickFor${year}`}
              className='tick x'
            >
              <line 
                x1={x(year)}
                x2={x(year)}
                y1={0}
                y2={chartBodyHeight}
              />
              {(year % 10 === 0) && (
                <text
                  x={x(year)}
                  y={chartBodyHeight + 15}
                >
                  {year}
                </text>
              )}
            </g>
          ))}

          {barSets.map(barSet => (
            <BarSet
              barSet={barSet}
              stacked={stacked}
              key={`barsFor${barSet.year}`}
            />
          ))}
        </g>

        {/* data for selected year */}
        <text
          x={yAxisWidth + Math.min(Math.max(x(parseInt(year)), 35), chartBodyWidth - 50)}
          y={paddingTop + yOffsetFromBottom([barHeight(selectedYearData.federal_lands), barHeight(selectedYearData.indian_lands)]) - 7}
          style={{
            fill: 'white',
            stroke: 'white',
            pointerEvents: 'none',
            textAnchor: 'middle',
          }}
        >
          {barLabel}
        </text>
      </svg>
    </React.Fragment>
  );
}

export default BarChart;
      
