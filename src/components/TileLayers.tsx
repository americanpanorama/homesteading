import * as React from 'react';
import * as d3 from 'd3';
import { useParams } from "react-router-dom";
import TileLayer from './TileLayer';
import { DimensionsContext } from '../DimensionsContext';
import { tileOpacity } from '../utilities';
import { Dimensions, RouterParams, ClaimsAndPatentsAcresType } from '../index.d';
import { TileData, ProjectedTownship, Point, CalculateZ, Bounds } from './Map.d';
import { CANVASSIZE, TILESIZE, ANIMATIONDURATION } from '../Config';

interface Props {
  projectedTownships: ProjectedTownship[];
  center: Point;
  rotation: number;
  scale: number;
}

const TileLayers = (props: Props) => {
  const { useState, useEffect, useRef, useContext } = React;
  const {
    projectedTownships,
    center,
    rotation,
  } = props;

  const params = useParams<RouterParams>();
  const { fullOpacity, view } = params;

  const ref = useRef(null);

  const { width, height } = (useContext(DimensionsContext) as Dimensions).mapDimensions;
  const [scale, setScale] = useState(props.scale);

  // calculates the bounding box for which to grab tiles. This is imperfect on the cautious side, using some basic trigonmetry to account for the rotation of the svg depending on on longitude
  const calculateXYBounds = (scale: number, center: Point): Bounds => {
    const centerToCornerLength = Math.sqrt((width / 2) * (width / 2) + (height / 2) * (height / 2));
    const angleCenterToCorners = Math.atan2(height / 2, width / 2);
    const angleToTopLeft = angleCenterToCorners + (Math.PI / 180 * rotation);
    const adjacentx = Math.cos(angleToTopLeft) * centerToCornerLength;
    const angleToTopRight = angleCenterToCorners - (Math.PI / 180 * rotation);
    const oppositey = Math.sin(angleToTopRight) * centerToCornerLength;
    const minX = center[0] - adjacentx / scale;
    const maxX = center[0] + adjacentx / scale;
    const minY = center[1] - oppositey / scale;
    const maxY = center[1] + oppositey / scale;
    return [[minX, minY], [maxX, maxY]];
  };

  const calculateZ: CalculateZ = (scale) => {
    const fullSizeOfCanvas = scale * CANVASSIZE;
    const fullSizeOfZ = (z: number): number => (1 << z) * TILESIZE; // equivalent too TILESIZE * Math.pow(2, z);
    for (let z = 0; z < 18; z += 1) {
      if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
        return Math.min(7, z);
      }
    }
  }

  // the scale divisor is the number of tiles that would span across and down the canvas; e.g. between scales of more than 4 and 8 it's 8
  // this is used to scale down between powers of 2: e.g. 1, 2, 4, 8, 16, etc.
  const scaleDivisor = (scale: number): number => Math.pow(2, calculateZ(scale) - 2);

  // returns the tile scale; the second parameter is optional and is used to scale up or scale down for animations when the scale changes as a state is selected, etc.
  const getTileScale = (nextScale: number, currentScale?: number): number => (currentScale) ? nextScale / scaleDivisor(currentScale) : nextScale / scaleDivisor(nextScale);

  const getProjectedValue = (num: number, z: number): number => num * Math.pow(2, z);

  const getTileX = (x: number, z: number, canvassize: number): number => {
    const tilesForCanvas = Math.pow(2, z);
    return Math.floor(tilesForCanvas * (x / canvassize));
  }

  const getTileY = (y: number, z: number, canvassize: number): number => {
    const tilesForCanvas = Math.pow(2, z);
    return tilesForCanvas - getTileX(y, z, canvassize) - 1;
  }

  // filters the townships to only retrieve tiles for those visible on the canvas
  const getTiles = (projectedTownships: ProjectedTownship[], scale: number, center: [number, number]): TileData[] => {
    const types: ClaimsAndPatentsAcresType[] = (view) ? view.split('-') as ClaimsAndPatentsAcresType[] : ["acres_claimed", "acres_claimed_indian_lands"];
    const z = calculateZ(scale);
    const tiles: TileData[] = [];
    const XYBounds = calculateXYBounds(scale, center);
    // get the available x and y values for the projectedTownship
    projectedTownships
      .filter(d => d.state !== 'AK')
      // check to see if the bounds intersect
      .filter(d => !['IL', 'IN', 'MS', 'OH'].includes(d.state)
        && !(d.bounds[0][0] > XYBounds[1][0] || d.bounds[1][0] < XYBounds[0][0] || d.bounds[0][1] > XYBounds[1][1] || d.bounds[1][1] < XYBounds[0][1])
      )
      .sort((a, b) => {
        const acresA = types.reduce((acc, curr) => a[curr] + acc, 0);
        const acresB = types.reduce((acc, curr) => b[curr] + acc, 0);
        return acresA / a.area - acresB / b.area;
      })
      .forEach((projectedTownship) => {
        const tilesForCanvas = Math.pow(2, z);
        const minXForOffice: number = getTileX(projectedTownship.bounds[0][0], z, CANVASSIZE);
        const maxXForOffice: number = getTileX(projectedTownship.bounds[1][0], z, CANVASSIZE);
        const maxYForOffice: number = getTileY(projectedTownship.bounds[0][1], z, CANVASSIZE);
        const minYForOffice: number = getTileY(projectedTownship.bounds[1][1], z, CANVASSIZE);
        for (let tempX = minXForOffice; tempX <= maxXForOffice; tempX += 1) {
          for (let tempY = minYForOffice; tempY <= maxYForOffice; tempY += 1) {
            const acres = types.reduce((acc, curr) => projectedTownship[curr] + acc, 0);
            tiles.push({
              tile_id: projectedTownship.tile_id,
              z: z,
              x: tempX,
              y: tempY,
              opacity: (fullOpacity) ? 1 : (acres === 0) ? 0.03 : Math.min(0.15 + 0.85 * acres * 100 / projectedTownship.area, 1),
              //opacity: Math.floor((i / townships.length) / (1 / 10)) / 10 + 0.1,
            });
          }
        }
      });
    // alaska tiles
    projectedTownships 
      .filter(d => d.state === 'AK')
      .filter(d => !['IL', 'IN', 'MS', 'OH'].includes(d.state)
        && !(d.bounds[0][0] > XYBounds[1][0] || d.bounds[1][0] < XYBounds[0][0] || d.bounds[0][1] > XYBounds[1][1] || d.bounds[1][1] < XYBounds[0][1])
      )
      .sort((a, b) => {
        const acresA = types.reduce((acc, curr) => a[curr] + acc, 0);
        const acresB = types.reduce((acc, curr) => b[curr] + acc, 0);
        return acresA / a.area - acresB / b.area;
      })
      .forEach(projectedTownship => {
        const alaskaZ = calculateZ(scale / 4);
        const tilesForCanvas = Math.pow(2, alaskaZ);
        const minXForOffice: number = getTileX(projectedTownship.bounds[0][0] + 64, alaskaZ, CANVASSIZE / 4);
        const maxXForOffice: number = getTileX(projectedTownship.bounds[1][0] + 64, alaskaZ, CANVASSIZE / 4);
        const maxYForOffice: number = getTileY(projectedTownship.bounds[0][1] - 512, alaskaZ, CANVASSIZE / 4);
        const minYForOffice: number = getTileY(projectedTownship.bounds[1][1] - 512, alaskaZ, CANVASSIZE / 4);
        for (let tempX = minXForOffice; tempX <= maxXForOffice; tempX += 1) {
          for (let tempY = minYForOffice; tempY <= maxYForOffice; tempY += 1) {
            const acres = types.reduce((acc, curr) => projectedTownship[curr] + acc, 0);
            tiles.push({
              tile_id: projectedTownship.tile_id,
              z: alaskaZ,
              x: tempX,
              y: tempY,
              translate: [getProjectedValue(-64, alaskaZ), getProjectedValue(512, alaskaZ)],
              opacity: (fullOpacity) ? 1 : (acres === 0) ? 0.03 : tileOpacity(acres / projectedTownship.area),
              //opacity: Math.floor((i / townships.length) / (1 / 10)) / 10 + 0.1,
            });
          }
        }
      });
    return tiles;
  };

  const [tiles, setTiles] = useState<TileData[]>(getTiles(projectedTownships, scale, center));
  const [overTiles, setOverTiles] = useState<TileData[]>([]);
  const [underTiles, setUnderTiles] = useState<TileData[]>([]);
  const animatingYearStatus = useRef('finished');





  // when there's a new set of townships when a different year is selected, load them
  useEffect(() => {
    setTiles(getTiles(projectedTownships, props.scale, center));
  }, [props.scale, center[0], center[1], view]);

  // when there's a new zoom, add the tile layer
  useEffect(() => {
    if (calculateZ(props.scale) > calculateZ(scale)) {
      setOverTiles(getTiles(projectedTownships, props.scale, center));
    } else if (calculateZ(props.scale) < calculateZ(scale)) {
      setUnderTiles(getTiles(projectedTownships, props.scale, center));
    }
  }, [props.scale]);

  // when new projected townships are loaded, sets them under the extent ones, fading those out
  useEffect(() => {
    // get the next tile set
    const nextTileSet = getTiles(projectedTownships, props.scale, center);
    // modify the current one, changing the opacity for those that will still be on the canvas to the new opacity, setting those that will disappear to full transparent
    const currentTiles = tiles
      .map(d => ({
        ...d,
        opacity: (nextTileSet.map(d1 => d1.tile_id).includes(d.tile_id)) ? nextTileSet.find(d1 => d1.tile_id === d.tile_id).opacity : 0,
      }));
    // get just the new tiles that will be added to the canvas; set their opacity to 0 so they can be faded in
    const newTiles = nextTileSet
      .filter(d => !currentTiles.map(d1 => d1.tile_id)
      .includes(d.tile_id))
      .map(d => ({
        ...d,
        opacity: 0,
      }));
    // start the animation, the next `useState` continues it
    setTiles(currentTiles);
    if (newTiles.length > 0) {
      setUnderTiles(newTiles);
      if (animatingYearStatus.current === 'finished') {
        animatingYearStatus.current = 'started';
      }
    } else if (animatingYearStatus.current === 'finished') {
      animatingYearStatus.current = 'finishing';
    }
  }, [projectedTownships]);

  // continue the tile animation when the year changes from the `useState` above
  useEffect(() => {
    if (animatingYearStatus.current === 'started' && underTiles.length > 0) {
      // start the animation of the new tiles fading them in
      const nextTileSet = getTiles(projectedTownships, props.scale, center);
      const newTiles = underTiles.map(d => ({
          ...d,
          opacity: (nextTileSet.find(d1 => d1.tile_id === d.tile_id)) ? nextTileSet.find(d1 => d1.tile_id === d.tile_id).opacity : 1,
        }));
      setUnderTiles(newTiles);
      animatingYearStatus.current = 'finishing';
    }
  });

  // continue the tile animation when the year changes from the `useState` above
  useEffect(() => {
    if (animatingYearStatus.current === 'finishing') {
      setTimeout(() => {
        setTiles(getTiles(projectedTownships, props.scale, center));
        setUnderTiles([]);
        animatingYearStatus.current = 'finished';
      }, ANIMATIONDURATION);
    }
  });

  // clean up after the animation above completes and scale is set to props.scale; over- or underTiles become the "main" tiles and are emptied
  useEffect(() => {
    if (props.scale === scale && animatingYearStatus.current == 'finished') {
      if (overTiles.length > 0) {
        setTiles(overTiles);
        setOverTiles([]);
      } else if (underTiles.length > 0) {
        setTiles(underTiles);
        setUnderTiles([]);
      }
    }
  });

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
