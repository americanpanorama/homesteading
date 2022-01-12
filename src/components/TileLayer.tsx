import * as React from 'react';
import Tile from './Tile';
import { TileData } from './Map.d';

const TileLayer = ({tiles, scale }: {tiles: TileData[], scale: number}) => {
  return (
    <g
      transform={`scale(${scale})`}
    >
      {tiles.map((d: TileData) => (
        <Tile
          {...d}
          opacity={1}
          key={`${d.tile_id}/${d.z}/${d.x}/${d.y}`}
        />
      ))}
    </g>
  );
};

export default TileLayer;
