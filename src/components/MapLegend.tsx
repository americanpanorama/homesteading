import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DimensionsContext } from '../DimensionsContext';
import { colorGradient, useClaimsAndPatentsTypes, tileOpacity } from '../utilities';
import { RouterParams, Dimensions } from '../index.d';
import './MapLegend.css';

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

  const boxWidth = 36;
  const strokeWidth = 2;
  const boxInterior = boxWidth - strokeWidth;
  return (
    <div id='mapLegend'>
      <div id='areaLegend'>
        <h3>
          {`Percentage of the area ${acresLabel} in ${year}`}
        </h3>
        <svg
          width={378}
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
                  {(percent === 0) ? 'none' : (percent === 0.000000001) ? `> 0%` : `${percent * 100}%${(percent === 0.05) ? ' or more' : ''}`}
                </text>

              </g>
            )
          })}
        </svg>

      </div>
      <div id='clashesLegend'>

        <h3>Clashes, Massacres, Raids, and Battles Involving Indians</h3>
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
    </div>
  );
};

export default MapLegend;
