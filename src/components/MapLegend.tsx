import * as React from 'react';
import { useParams } from 'react-router-dom';
import DimensionsContext from '../DimensionsContext';
import { RouterParams, Dimensions } from '../index.d';
import './MapLegend.css';

const MapLegend = () => {
  const year = useParams<RouterParams>().year || 1863;

  const {
    width,
  } = (React.useContext(DimensionsContext) as Dimensions).timelineDimensions;

  const labels: {[index: string]: string} = {
    "1": "1% or greater",
    "0.67": "0.66%",
    "0.33": "0.33%",
    "0": "greater than 0%",
  }
  return (
    <div id='mapLegend'>
      <svg 
        width={width}
        height={140}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={35}
          className="headerBackground"
        />

        <text
          x={width / 2}
          y={25}
          textAnchor='middle'
          fontSize={20}
        >
          {`Percentage of district claimed in ${year}`} 
        </text>
        {[0, 0.33, 0.67, 1].map((percent, idx) => (
          <g transform={`translate(${width / 2 - 200 + 100 * idx} 50)`}>
            <image
              xlinkHref={`${process.env.PUBLIC_URL}/static/NE-Lincoln-1873-1875.png`}
              width={85}
              x={7.5}
              y={0}
              key={`legendImageOpacity${percent}`}
              opacity={0.1 + 0.9 * percent}
            />
            <text
              x={50}
              y={65}
              textAnchor='middle'
            >
              {labels[percent.toString()]}
            </text>
         </g>
        ))}
      </svg>
    </div>
  );
};

export default MapLegend;
