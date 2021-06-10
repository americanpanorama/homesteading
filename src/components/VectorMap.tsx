import * as React from 'react';
import { useAsync } from 'react-async';
import * as d3 from 'd3';
import { Link, useParams, useHistory } from "react-router-dom";
import DimensionsContext from '../DimensionsContext';
import { Dimensions, ProjectedState, RouterParams } from '../index.d';
import { MapDate, YearData, ProjectedTownship, AsyncParams, TileData, CalculateTransform, CalculateCenterAndDXDY, TransformData, CalculateZ, Bounds, Point } from './VectorMap.d';
import States from '../../data/states.json';
import MapDates from '../../data/mapDates.json';
import TileLayers from './TileLayers';
import DistrictPolygons from './DistrictPolygons';
import State from './State';
import { makeParams } from '../utilities';
import { CANVASSIZE, ANIMATIONDURATION} from '../Config';
import './VectorMap.css';  

const loadData = async ({ year }: RouterParams) => {
  const response = await fetch(`${process.env.PUBLIC_URL}/data/yearData/${year}.json`);
  if (!response.ok) { console.warn(response) }
  return response.json();
}

const VectorMap = () => {
  const { useEffect, useContext, useState, useRef } = React;
  const params = useParams<RouterParams>();
  const { stateTerr, office, fullOpacity } = params;
  const year = params.year || '1863';
  const { width, height } = (useContext(DimensionsContext) as Dimensions).mapDimensions;
  const refTranslate = useRef(null);
  const refScalePaths = useRef(null);
  // the default size of the canvas when the map is projected with a scale of 1; it's 1024 or (256 * 2^2) for four tiles across and four tiles down at zoom level 2
  const tileSize = 256;
  
  const calculateCenterAndDxDy: CalculateCenterAndDXDY = bounds => ({
    center: [(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2],
    dx: bounds[1][0] - bounds[0][0],
    dy: bounds[1][1] - bounds[0][1],
  });

  const getCenter = (bounds: Bounds): Point => [(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2];
  const getDX = (bounds: Bounds): number => bounds[1][0] - bounds[0][0];
  const getDY = (bounds: Bounds): number => bounds[1][1] - bounds[0][1];

  const calculateTransform: CalculateTransform = (viewOptions) => {
    let { dx, dy, center, yGutter, xGutter, width, height, rotation } = viewOptions;
    // set defaults
    xGutter = xGutter || 1;
    yGutter = yGutter || 1;
    dx = dx || CANVASSIZE * 0.7; // the 0.85 accounts for there not being any states with homesteading east of MI/OH
    dy = dy || 500 / 960 * CANVASSIZE;
    center = center || [CANVASSIZE * 0.42, CANVASSIZE / 2];
    rotation = rotation || -2;

    // calculate values
    const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;
    const translateX = width / 2 - scale * center[0];
    const translateY = height / 2 - scale * center[1];
    return {
      scale,
      transform: `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale})`,
      translate: `translate(${translateX} ${translateY})`,
    }
  };

  const calculateXYBounds = (scale: number, center: Point): Bounds => {
    const minX = center[0] - width / 2 / scale;
    const maxX = center[0] + width / 2 / scale;
    const minY = center[1] - height / 2 / scale;
    const maxY = center[1] + height / 2 / scale;
    return [[minX, minY], [maxX, maxY]];
  };

  const calculateZ: CalculateZ = (scale) => {
    const fullSizeOfCanvas = scale * CANVASSIZE;
    const fullSizeOfZ = (z: number): number => tileSize * Math.pow(2, z);
    for (let z = 0; z < 18; z += 1) {
      if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
        return z;
      }
    }
  }

  let { scale: initialScale, transform: initialTransform, translate: initialTranslate }: TransformData = calculateTransform({width, height});
  const [center, setCenter] = useState<Point>([CANVASSIZE * 0.45, CANVASSIZE / 2]);
  const [loadedDataForYear, setLoadedDataForYear] = useState<string>(null);

  const { data: yearData, error }: AsyncParams = useAsync({ 
    promiseFn: loadData,
    year: year,
    watch: year,
  });

  const initialTranslateCalculated = useRef(!stateTerr);
  const [scale, setScale] = useState(initialScale);
  const [tileScale, setTileScale] = useState(initialScale);
  const [transform, setTransform] = useState(initialTransform);
  const [translate, setTranslate] = useState(initialTranslate);
  const calculatedTransformFor = useRef<string>((!stateTerr) ? `${year}-${stateTerr}-${office}` : null);

  const loaded = useRef<string>(null);

  const getTransformAndCenter = () => {
    let newScale: number;
    let newTransform: string;
    let newTranslate: string;
    let newCenter: Point;
    if (!stateTerr) {
      ({ scale: newScale, transform: newTransform, translate: newTranslate } = calculateTransform({width, height}));
      newCenter = [CANVASSIZE / 2, CANVASSIZE / 2];
    } else {
      const placeData = (office && yearData)
        ? yearData.offices.find(pt => pt.state === stateTerr && pt.office.replace(/[^a-zA-Z]/g, '') === office)
        : (States as ProjectedState[]).find(d => d.abbr === stateTerr);      
      console.log(placeData);
      ({ scale: newScale, transform: newTransform, translate: newTranslate } = calculateTransform({
        ...calculateCenterAndDxDy(placeData.bounds),
        rotation: placeData.rotation,
        yGutter: 0.8,
        xGutter: 0.8,
        width,
        height
      }));
      newCenter = getCenter(placeData.bounds);
    }
    return {
      transform: newTransform,
      translate: newTranslate,
      scale: newScale,
      tileScale: newScale / Math.pow(2, calculateZ(newScale) - 2),
      center: newCenter,
    }
  }

  // set initial scale and 
  useEffect(() => {
    // if this is the initial render and there's a state/territory, calculate the transform values before rendering the map
    if (!initialTranslateCalculated.current) {
      const { transform: newTransform, translate: newTranslate, center: newCenter, scale: newScale } = getTransformAndCenter();
      console.log('calculating');
      setCenter(center);
      setTranslate(newTransform);
      setScale(newScale);
      initialTranslateCalculated.current = true;
    }
  });

  useEffect(() => {
    const { transform: newTransform, translate: newTranslate, center: newCenter, scale: newScale } = getTransformAndCenter();
    if (transform !== newTransform) {
      d3.select(refTranslate.current)
        .transition()
        .duration((initialTranslateCalculated.current) ? ANIMATIONDURATION: 0)
        .attr('transform', newTransform)
        .on('end', () => {
          console.log(newTransform);
          setTransform(newTransform);
        });
    }
  });

  useEffect(() => {
    const { transform: newTransform, translate: newTranslate, center: newCenter, scale: newScale } = getTransformAndCenter();
    if (scale !== newScale || center[0] !== newCenter[0]) {
      setScale(newScale);
      setCenter(newCenter);
    }
  });

  // the second condition here prevents 
  if (yearData && initialTranslateCalculated.current) {
    const projectedTownships = yearData.offices;
    return (
      <div
        className='vectorMap'
      >
        <svg
          width={width * 2}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g
            transform={transform}
            ref={refTranslate}
          >

            <TileLayers
              projectedTownships={projectedTownships}
              center={center}
              scale={scale}
              id={`${year}-${scale}-${center[0]}-${center[1]}`}
            />

            <DistrictPolygons 
              projectedTownships={projectedTownships}
              center={center}
              scale={scale}
            />
          </g>
        </svg>
      </div>
    );
  }
  return null;
};

export default VectorMap;
