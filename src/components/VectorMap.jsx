import React from 'react';
import PropTypes from 'prop-types';
import Sliver from './SliverSVG.jsx';
import './VectorMap.css';

import states from '../../public/data/statesSVG.json';

const VectorMap = ({ polygons, offices, tiles, mapParameters }) => {
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
        <g transform={`translate(${translateX} ${translateY})`}>
          {tiles.map(tile => (
            <image
              xlinkHref={tile.xlinkHref}
              width={tileWidth}
              x={tileWidth * tile.x}
              y={tileWidth * tile.y}
              key={tile.key}
            />
          ))}
          
          <g transform={`scale(${scale})`}>

            {states.map((p, i) => (
              <path
                d={p.d}
                fill='transparent'
                stroke='black'
                strokeWidth={0.5 / Math.max(width, height)}
                strokeDasharray="0.01 0.002 0.001 0.002"
                key={`state${i}`}
              />
            ))}

            {polygons.map(p => (
              <Sliver
                p={p}
                key={`sliver${p.id}`}
              />
            ))}

            {offices.map(p => (
              <path
                d={p.d}
                fill={p.fill}
                fillOpacity={0}
                key={`office-${p.id}`}
                stroke='#752623'
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
