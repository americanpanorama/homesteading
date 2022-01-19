import * as React from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, ProjectedState, RouterParams } from '..';
import { Point, YearData, ProjectedTownship } from './Map.d';
import States from '../../data/states.json';
import AggregatedClaims from '../../data/aggregatedClaims.json';
import NorthAmerica from '../../data/northAmerica.json';
import { CANVASSIZE } from '../Config';
import './Map.css';

interface OpenReservations {
  reservations1912: string;
  openReservations: { d: string; labelCoords: [number, number]; year: number }[]
}

const Map = () => {
  const { useEffect, useContext, useState } = React;

  const { width: screenWidth } = (useContext(DimensionsContext) as Dimensions);
  const width = Math.min(1000 * 0.95, screenWidth * 0.9);
  const height = 1.5 * width * 500 / 960;
  const [openReservations, setOpenReservations] = useState<OpenReservations>(null);

  // calculate values
  const xGutter = 2;
  const yGutter = 2;
  const dx = CANVASSIZE * 0.7; // the 0.7 accounts for there not being any states with homesteading east of MI/OH
  const dy = CANVASSIZE;
  const center: Point = [CANVASSIZE * 0.4, CANVASSIZE * 0.47];
  const rotation = -2;

  const scale = ((width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx);
  const translateX = width / 2 - scale * center[0];
  const translateY = height / 2 - scale * center[1];
  const transform = `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale})`;

  // load the data for the map
  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/OpenReservations.json`)
      .then(response => {
        setOpenReservations(response.data as OpenReservations);
      });
  }, []);

  return (
    <div
    >
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g
          transform={transform}
        >
          <g transform={`scale(${scale})`}>
            {NorthAmerica.map((d: any) => (
              <path
                d={d}
                className='continent'
                key={d.substring(0, 50)}
              />
            ))}
            {(States as ProjectedState[]).filter(d => d.abbr !== 'DK' && d.abbr !== 'AK').map(state => (
              <path
                d={state.d}
                fill='#333'
                stroke='black'
                strokeOpacity={1}
                strokeWidth={1}
                key={`state${state.abbr}`}
              />
            ))}
            {(openReservations) && (
              <g>
                <path
                  d={openReservations.reservations1912}
                  fill='#D685D6'
                  fillOpacity={0.7}
                  stroke='#D685D6'
                  strokeWidth={1}
                />
                {openReservations.openReservations.map((d, idx: number) => (
                  <path
                    d={d.d}
                    fill='lime'
                    fillOpacity={0.7}
                    stroke='lime'
                    strokeWidth={1}
                    key={`openRes_polygon${idx}`}
                  />
                ))}

                {openReservations.openReservations.map((d, idx: number) => (
                  <g
                    transform={`translate(${d.labelCoords[0]} ${d.labelCoords[1] + 6})`}
                    key={`open_res${idx}`}
                  >
                    <text
                      x={0}
                      y={0}
                      textAnchor='middle'
                      stroke='#000000'
                      strokeWidth={2}
                      strokeOpacity={0.5}
                      fontFamily='"Roboto Condensed", sans-serif'
                      fontSize='0.7em'
                    >
                      {d.year}
                    </text>
                    <text
                      x={0}
                      y={0}
                      textAnchor='middle'
                      fontFamily='"Roboto Condensed", sans-serif'
                      fontSize='0.7em'
                    >
                      {d.year}
                    </text>
                  </g>
                ))}
              </g>
            )}


          </g>
        </g>
        <g transform={`translate(10 ${height - 50})`}>
          <rect
            x={-10}
            y={-10}
            width={20}
            height={20}
            fill="lime"
            fillOpacity={0.7}
            stroke="lime"
            strokeWidth={1}
            transform="translate(15 40)"
          />
          <text
            x={40}
            y={40}

          >
            Reservations opened to homesteaders, 1891-1912
          </text>
          <rect
            x={-10}
            y={-10}
            width={20}
            height={20}
            fill="#D685D6"
            fillOpacity={0.7}
            stroke="#D685D6"
            strokeWidth={1}

            transform="translate(15 0)"
          />
          <text
            x={40}
            y={10}

          >
            Reservations, 1912
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Map;
