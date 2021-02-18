import React from 'react';
import PropTypes from 'prop-types';
import Sliver from './SliverSVG.jsx';
import './VectorMap.css';

import states from '../../public/data/statesSVG.json';

const VectorMap = ({ polygons, reservations, offices, tiles, mapParameters }) => {
  const { width, height, scale, tileZ, tileWidth, translateX, translateY } = mapParameters;

  return (
    <div
      className='vectorMap'
    >
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {/* JSX Comment 
        <g transform={`translate(${translateX - 900} ${translateY + 500}) rotate(310 ${width} ${height}) skewX(60) scale(0.8)`}>
        */}
        <g transform={`translate(${translateX} ${translateY})`}>
          
          <g transform={`scale(${scale})`}>
          {/*
            {states.map((p, i) => (
              <path
                d={p.d}
                fill='transparent'
                stroke='#666'
                strokeWidth={0.25 / Math.max(width, height)}
                //strokeDasharray="0.01 0.002 0.001 0.002"
                key={`state${i}`}
              />
            ))}

             
            {reservations.map((p, i) => (
              <path
                d={p.d}
                fill='#73937E'
                fillOpacity={1}
                stroke='#73937E'
                strokeWidth={0.5 / Math.max(width, height)}
                key={`state${i}`}
              />
            ))} */}

          </g>

          {tiles.map(tile => (
            <image
              xlinkHref={tile.xlinkHref}
              width={tileWidth}
              x={tileWidth * tile.x}
              y={tileWidth * tile.y}
              key={tile.key}
              opacity={0.7}
            />
          ))} 

          <g transform={`scale(${scale})`}>

          {/* JSX Comment 
            {polygons.map(p => (
              <Sliver
                p={p}
                key={`sliver${p.id}`}
              />
            ))} */}

            {offices.map(p => (
              <path
                d={p.d}
                fill={p.fill}
                fillOpacity={p.fillOpacity}
                key={`office-${p.id}`}
                stroke='#444'
                strokeWidth={1 / Math.max(width, height)}
                id={p.id}
              />
            ))} 
          </g>

        </g>
      </svg>
    </div>
  );
};

export default VectorMap;

VectorMap.propTypes = {
  polygons: PropTypes.array,
  offices: PropTypes.array,

};

VectorMap.defaultProps = {
  polygons: [],
  offices: [],
};
