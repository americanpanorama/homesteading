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

interface yearData {
  year: number;
  acres: number;
}

export const monthNum = (m: number): number => (m - 1) / 12;
export const getTimeCode = (year: number, month: number): number => year * 100 + month;
export const timeCodeToNum = (timecode: number): number => Math.floor(timecode / 100) + monthNum(timecode % 100);

const TimelineHeatmap = () => {
  const { useState, useEffect, useContext } = React;
  const params = useParams<RouterParams>();
  const { stateTerr, office, view } = params;
  const year = params.year || '1863';
  const { width: mapWidth, height } = (useContext(DimensionsContext) as Dimensions).mapDimensions;
  const width = mapWidth * 0.9;
  const [data, setData] = useState<any>();

  const { acresTypes: types, countTypes, numberLabel, acresLabel } = useClaimsAndPatentsTypes();

  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/timelineData/${stateTerr || 'national'}.json`)
      .then(response => {
        setData(response.data);
      });
  }, [stateTerr]);


  const x = d3.scaleLinear()
    .domain([1863, 1913])
    .range([12.5, width - 25]);

  const cellWidth: number = x(1870) - x(1869);

  const formatPlaces = (placeData: TimelinePlaceData[]): yearData[] => {
    // organize a list of the photographers with some basic display info
    const rows = placeData
      .filter(d => {
        if (office) {
          return d.stateOrTerritory === stateTerr && d.name.replace(/[^a-zA-Z]/g, '') === office;
        } else if (stateTerr) {
          return d.stateOrTerritory === stateTerr;
        }
        return true;
      });
    const yearsData: yearData[] = [...Array(50).keys()].map(d => d + 1863).map(y => ({
      year: y,
      acres: rows.reduce((acc, curr) => {
        const dataForYear = curr.yearData.find(yd => yd.year === y);
        if (dataForYear) {
          return acc + types.reduce((acc2, type) => parseFloat(dataForYear[type].toString()) + acc2, 0)
        }
        return acc;
      }, 0)
    }));

    return yearsData;
  }

  const yearsData = (data) ? formatPlaces(data) : [];

  const max = Math.max(...yearsData.map(d => d.acres));

  const color = d3.scaleLinear<string>()
    .domain([0, max * 0.2, max * 0.4, max * 0.6, max * 0.8, max])
    .range(['#232123', '#50C4AA', '#B6C95C', '#FACB3E', '#FC800F', '#FF4759'])

  return (
    <svg
      width={width}
      height={125}
      id='timelineSimple'
      style={{
        marginLeft: width / -2,
      }}
    >

      <rect
        x={0}
        y={0}
        width={width}
        height={125}
        rx={10}
        ry={10}
        fill='#181612'
        fillOpacity={0.1}
      />

      <g transform='translate(0 25)'>

        {yearsData.map(yearData => (
          <g
            transform={`translate(${x(yearData.year)} 0)`}
            key={`cellFor${yearData.year}`}
          >
            <rect
              x={1}
              y={75 - (8 + 67 * yearData.acres / max)}
              width={x(1873) - x(1872) - 2}
              height={8 + 67 * yearData.acres / max}
              stroke='white'
              strokeWidth={(yearData.year.toString() === year) ? 2 : 0}
              fill={color(yearData.acres)}
              fillOpacity={(yearData.year.toString() === year) ? 1 : 0.6}
            />
            <text
              x={(x(1873) - x(1872)) / 2}
              y={ 75 - (8 + 67 * yearData.acres / max) - 7}
              textAnchor='middle'
              fill='white'
              style={{
                visibility: (parseInt(year) === yearData.year) ? 'visible' : 'hidden',
              }}
            >
              {`${Math.round(yearData.acres).toLocaleString()} acres`}
            </text>
          </g>


        ))}

        {/* year tick marks */}
        {[1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910].map((year: number) => (
          <text
            x={x(year + 0.5)}
            y={95}
            textAnchor='middle'
            key={`yearAxisFor${year}`}
            style={{ fontSize: '1.25em' }}
          >
            {year}
          </text>
        ))}

        <line
          x1={12.5}
          x2={width - 25}
          y1={75}
          y2={75}
          stroke='white'

        />

        {yearsData.map(yearData => (
          <Link
            to={makeParams(params, [{ type: 'set_year', payload: yearData.year }])}
            key={`LinkFor${yearData.year}`}
          >
            <rect
              x={x(yearData.year)}
              y={0}
              width={x(1873) - x(1872)}
              height={100}
              stroke='none'
              strokeWidth={(yearData.year.toString() === year) ? 2 : 0}
              fill='transparent'
            />
          </Link>

        ))}
      </g>
    </svg>

  );
};

export default TimelineHeatmap;
