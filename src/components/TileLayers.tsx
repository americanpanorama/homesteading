import * as React from 'react';
import * as d3 from 'd3';
import { useParams } from "react-router-dom";
import TileLayer from './TileLayer';
import DimensionsContext from '../DimensionsContext';
import { Dimensions, RouterParams } from '../index.d';
import { TileData, ProjectedTownship, Point, CalculateZ, Bounds } from './VectorMap.d';
import { CANVASSIZE, TILESIZE, ANIMATIONDURATION } from '../Config';

interface Props {
  projectedTownships: ProjectedTownship[];
  center: Point;
  scale: number;
  id: string;
}

const TileLayers = (props: Props) => {
  const { useState, useEffect, useRef, useContext } = React;
  const {
    projectedTownships,
    center,
    id,
  } = props;
  const params = useParams<RouterParams>();
  const { stateTerr, office, fullOpacity } = params;
  const year = params.year || '1863';

  const ref = useRef(null);

  const { width, height } = (useContext(DimensionsContext) as Dimensions).mapDimensions;
  const [scale, setScale] = useState(props.scale);

  const calculateXYBounds = (scale: number, center: Point): Bounds => {
    const minX = center[0] - width / 2 / scale;
    const maxX = center[0] + width / 2 / scale;
    const minY = center[1] - height / 2 / scale;
    const maxY = center[1] + height / 2 / scale;
    return [[minX, minY], [maxX, maxY]];
  };

  const calculateZ: CalculateZ = (scale) => {
    const fullSizeOfCanvas = scale * CANVASSIZE;
    const fullSizeOfZ = (z: number): number => (1 << z) * TILESIZE; // equivalent too TILESIZE * Math.pow(2, z);
    for (let z = 0; z < 18; z += 1) {
      if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
        return z;
      }
    }
  }

  const getTiles = (projectedTownships: ProjectedTownship[], scale: number, center: [number, number]): TileData[] => {
    const z = calculateZ(scale);
    const tiles: TileData[] = [];
    const XYBounds = calculateXYBounds(scale, center);
    projectedTownships
      // check to see if the bounds intersect
      .filter(d => !['IL', 'IN', 'MS', 'OH'].includes(d.state) && !(d.bounds[0][0] > XYBounds[1][0] || d.bounds[1][0] < XYBounds[0][0] || d.bounds[0][1] > XYBounds[1][1] || d.bounds[1][1] < XYBounds[0][1]))
      //.filter(d => d.state === stateTerr)
      .forEach((projectedTownship) => {
        const tilesForCanvas = Math.pow(2, z);
        // get the available x and y values for the projectedTownship
        const minXForOffice: number = Math.floor(projectedTownship.bounds[0][0] / CANVASSIZE / (1 / tilesForCanvas));
        const maxXForOffice: number = Math.floor(projectedTownship.bounds[1][0] / CANVASSIZE / (1 / tilesForCanvas));
        const maxYForOffice: number = tilesForCanvas - 1 - Math.floor(projectedTownship.bounds[0][1] / CANVASSIZE  /(1 / tilesForCanvas));
        const minYForOffice: number = tilesForCanvas - 1 - Math.floor(projectedTownship.bounds[1][1] / CANVASSIZE / (1 / tilesForCanvas));
        for (let tempX = minXForOffice; tempX <= maxXForOffice; tempX += 1) {
          for (let tempY = minYForOffice; tempY <= maxYForOffice; tempY += 1) {
            tiles.push({
              tile_id: projectedTownship.tile_id,
              z: z,
              x: tempX,
              y: tempY,
              opacity: (fullOpacity) ? 1 : 0.1 + 0.9 * projectedTownship.acres_claimed * 100 / projectedTownship.area,
            });
          }
        }
      });
    return tiles;
  };

  const [tiles, setTiles] = useState<TileData[]>(getTiles(projectedTownships, scale, center));
  const [overTiles, setOverTiles] = useState<TileData[]>([]);
  const [underTiles, setUnderTiles] = useState<TileData[]>([]);

  // the scale divisor is the number of tiles that would span across and down the canvas; e.g. between scales of more than 4 and 8 it's 8
  // this is used to scale down between powers of 2: e.g. 1, 2, 4, 8, 16, etc.
  const scaleDivisor = (scale: number): number => Math.pow(2, calculateZ(scale) - 2);

  // returns the tile scale; the second parameter is optional and is used to scale up or scale down for animations when the scale changes as a state is selected, etc.
  const getTileScale = (nextScale: number, currentScale?: number): number => (currentScale) ? nextScale / scaleDivisor(currentScale) : nextScale / scaleDivisor(nextScale);


  // when there's a new set of townships when a different year is selected, load them
  useEffect(() => {
    setTiles(getTiles(projectedTownships, props.scale, center));
  }, [props.scale, center[0], center[1], year, projectedTownships]);

  // when there's a new zoom, add the tile layer
  useEffect(() => {
    if (calculateZ(props.scale) > calculateZ(scale)) {
      setOverTiles(getTiles(projectedTownships, props.scale, center));
    } else if (calculateZ(props.scale) < calculateZ(scale)) {
      setUnderTiles(getTiles(projectedTownships, props.scale, center));
    }
  }, [props.scale]);

  // zoom when the scale changes
  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('transform', `scale(${props.scale})`)
      .on('end', () => {
        setScale(props.scale);
      })
  }, [props.scale]);

  // clean up after the animation above completes and scale is set to props.scale; over- or underTiles become the "main" tiles and are emptied
  useEffect(() => {
    if (props.scale === scale) {
      if (overTiles.length > 0) {
        setTiles(overTiles);
        setOverTiles([]);
      } else if (underTiles.length > 0) {
        setTiles(underTiles);
        setUnderTiles([]);
      }
    }
  });

  return (
    <g transform={`scale(${scale})`} ref={ref} >
      <TileLayer
        tiles={underTiles}
        scale={getTileScale(scale, props.scale) / scale}
      />

      <TileLayer
        tiles={tiles}
        scale={getTileScale(scale) / scale}
      />

      <TileLayer
        tiles={overTiles}
        scale={getTileScale(scale, props.scale) / scale}
      />
    </g>
  );
};

export default TileLayers;
