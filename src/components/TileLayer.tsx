import * as React from 'react';
import * as d3 from 'd3';
import { TileData } from './VectorMap.d';
import { TILESIZE } from '../Config';

const TileLayer = ({tiles, scale }: {tiles: TileData[], scale: number}) => {
  const { useState, useEffect, useRef } = React;

  const ref = useRef(null);
 
  return (
    <g
      transform={`scale(${scale})`}
      ref={ref}
    >
      {tiles.map((d: TileData) => (
        <image
          //xlinkHref={`//s3.amazonaws.com/dsl-general/homesteading/${d.tile_id}/${d.z}/${d.x}/${d.y}.png`}
          xlinkHref={`/tiles/${d.tile_id}/${d.z}/${d.x}/${d.y}.png`}
          width={TILESIZE}
          x={TILESIZE * d.x}
          y={TILESIZE *  (Math.pow(2, d.z) - d.y) - TILESIZE}
          key={`${d.tile_id}/${d.z}/${d.x}/${d.y}`}
          opacity={d.opacity}
        />
      ))}
    </g>
  );
};

export default TileLayer;
