import * as React from 'react';
import { useParams } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import { DimensionsContext } from '../DimensionsContext';
import { colorGradient, useClaimsAndPatentsTypes, tileOpacity } from '../utilities';
import { RouterParams, Dimensions } from '../index.d';
import './MapLegend.css';

const OverlayStyle = {
  maxWidth: 400,
  fontSize: 16,
  fontFamily: '"Roboto Condensed", sans-serif',
}

const MapLegend = () => {
  const year = useParams<RouterParams>().year || 1863;

  const {
    width,
  } = (React.useContext(DimensionsContext) as Dimensions).timelineDimensions;

  const { acresLabel } = useClaimsAndPatentsTypes();

  const labels: { [index: string]: string } = {
    "1": "1% or greater",
    "0.8": "0.8%",
    "0.6": "0.6%",
    "0.4": "0.4%",
    "0.2": "0.2%",
    "0": "greater than 0%",
  }

  const boxWidth = 30;
  const strokeWidth = 2;
  const boxInterior = boxWidth - strokeWidth;
  return (
    <div id='mapLegend'>
     
      <div id='indianLands'>
        <h3>Indian Lands</h3>
        <svg
          width={300}
          height={100}
        >
          <g>
            <rect
              x={3}
              y={3}
              width={25}
              height={25}
              className='indianLand reservation'
            />
            <text
              x={40}
              y={20}
            >
              Reservations
            </text>
          </g>
          {(year >= 1889) && (
            <g transform='translate(0 37)'>
              <rect
                x={3}
                y={3}
                width={25}
                height={25}
                className='indianLand opened'
              />
              <text
                x={40}
                y={20}
              >
                Reservations Opened to Homesteading
              </text>
            </g>
          )}
          {(year < 1888) && (

            <g transform='translate(0 40)'>
              <path
                fill="green"
                fillOpacity={0.02}
                stroke="green"
                strokeDasharray="10 20"
                strokeWidth={5}
                d="M22.3,-33.3C28.3,-30.8,32.3,-23.7,39.1,-15.8C45.9,-7.9,55.6,0.7,58,10.8C60.4,20.9,55.5,32.4,49,45.6C42.5,58.8,34.2,73.7,22.6,77.4C10.9,81.1,-4.3,73.6,-10.8,60.7C-17.3,47.8,-15.1,29.5,-17.7,19.3C-20.4,9.2,-27.8,7.1,-33.8,1.6C-39.7,-4,-44.1,-13.1,-42.9,-21.2C-41.7,-29.3,-34.8,-36.4,-26.7,-38C-18.7,-39.5,-9.3,-35.5,-0.6,-34.5C8.1,-33.6,16.3,-35.8,22.3,-33.3Z"
                transform="translate(15 15) scale(0.2)"
              />
              <text
                x={40}
                y={20}
              >
                Unceded Areas
              </text>

            </g>
          )}


        </svg>
      </div>
      <div id='clashesLegend'>

        <Tooltip
          placement="top"
          overlay={<div>Please note, the details recorded were heavily influenced by the perspectives of army officials, on whose reports the data points are mostly based. The data should therefore be treated with caution regarding the identity of the nations involved, as well as the casualty figures and the often euphemistic naming of confrontations.</div>}
          overlayStyle={OverlayStyle}
        >
          <h3>Clashes, Massacres, Raids, and Battles Involving Indians
            <span className='tooltip'>?</span>
          </h3>
        </Tooltip>
        <svg
          width={240}
          height={100}
        >
          {[0, 100, 200, 300, 400, 500].map((casualties, idx) => {
            const xRadius = Math.max(2.83, Math.sqrt(casualties) * 0.4);
            const strokeWidth = xRadius / 2;
            return (
              <g
                transform={`translate(${40 * idx + 20} ${boxWidth / 2 + 2})`}
                key={`clash-${casualties}`}
              >
                <line
                  x1={xRadius * -1}
                  x2={xRadius}
                  y1={xRadius * -1}
                  y2={xRadius}
                  strokeWidth={strokeWidth}
                  stroke='red'
                />
                <line
                  x1={xRadius * -1}
                  x2={xRadius}
                  y1={xRadius}
                  y2={xRadius * -1}
                  strokeWidth={strokeWidth}
                  stroke='red'
                />

                <text
                  x={0}
                  y={boxWidth / 2 + 30}
                  textAnchor='middle'
                >
                  {(casualties === 0) ? '0-50' : casualties}
                </text>
              </g>
            );
          })}
          <text
            x={120}
            y={boxWidth + 50}
            textAnchor='middle'
          >
            casualties
          </text>

        </svg>
      </div>
      <div id='areaLegend'>
        <h3>
          {`Percentage of the area ${acresLabel} in ${year}`}
        </h3>
        <svg
          width={350}
          height={100}
        >
          {[0, 0.000000001, 0.01, 0.02, 0.03, 0.04, 0.05].map((percent, idx) => {
            return (
              <g
                transform={`translate(${boxWidth * 1.5 * idx} ${strokeWidth / 2})`}
                key={`polygonSymbolFor${percent}`}
              >
                <rect
                  x={0}
                  y={0}
                  width={boxWidth}
                  height={boxWidth}
                  fill='#8c8686'
                  fillOpacity={(percent === 0) ? 0.03 : tileOpacity(percent)}
                  stroke={colorGradient(percent)}
                  strokeWidth={strokeWidth}
                  key={`legendSymbolFor${idx}`}
                />

                {[0.2, 0.4, 0.6, 0.8].map(d => (
                  <g
                    transform={`translate(${strokeWidth / 2} ${strokeWidth / 2})`}
                    key={`townshipLine${d}`}
                  >
                    <line
                      x1={0}
                      x2={boxInterior}
                      y1={d * boxInterior}
                      y2={d * boxInterior}
                      strokeWidth={1}
                      stroke='black'
                      strokeOpacity={(percent === 0) ? 0.03 : tileOpacity(percent)}
                    />
                    <line
                      x1={d * boxInterior}
                      x2={d * boxInterior}
                      y1={0}
                      y2={boxInterior}
                      strokeWidth={1}
                      stroke='black'
                      strokeOpacity={(percent === 0) ? 0.03 : tileOpacity(percent)}
                    />
                  </g>
                ))}

                <text
                  x={boxWidth / 2}
                  y={boxWidth + 30}
                  textAnchor='middle'
                >
                  {(percent === 0) ? 'none' : (percent === 0.000000001) ? `> 0%` : `${percent * 100}%${(percent === 0.05) ? '+' : ''}`}
                </text>

              </g>
            )
          })}
        </svg>

      </div>
    </div>
  );
};

export default MapLegend;
