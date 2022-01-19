import * as React from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import Tooltip from 'rc-tooltip';
import { useParams, Link } from "react-router-dom";
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, ProjectedState, RouterParams } from '..';
import { CalculateTransform, CalculateCenterAndDXDY, TransformData, CalculateZ, Bounds, Point, YearData, YearDataRaw, ProjectedTownship } from './Map.d';
import us from '../us';
import States from '../../data/states.json';
import NorthAmerica from '../../data/northAmerica.json';
import TileLayers from './TileLayers';
import DistrictPolygons from './Polygons';
import { makeParams } from '../utilities';
import { CANVASSIZE, ANIMATIONDURATION, TILESIZE } from '../Config';
import './Map.css';

const Map = () => {
  const { useEffect, useContext, useState, useRef } = React;

  const params = useParams<RouterParams>();
  const { stateTerr, office } = params;
  const year = params.year || '1863';

  const { width: mapWidth, height: mapHeight, size: mapSize, setMapSize } = (useContext(DimensionsContext) as Dimensions).mapDimensions;
  const width = mapWidth;
  const height = mapHeight;
  const refTranslate = useRef(null);
  const [yearData, setYearData] = useState<YearData>({ offices: [], conflicts: [] })

  const calculateCenterAndDxDy: CalculateCenterAndDXDY = bounds => ({
    center: [(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2],
    dx: bounds[1][0] - bounds[0][0],
    dy: bounds[1][1] - bounds[0][1],
  });

  const getCenter = (bounds: Bounds): Point => [(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2];

  const calculateTransform: CalculateTransform = (viewOptions) => {
    let { dx, dy, center, yGutter, xGutter, width, height, rotation } = viewOptions;
    // set defaults
    xGutter = xGutter || 1;
    yGutter = yGutter || 1;
    dx = dx || CANVASSIZE; // the 0.7 accounts for there not being any states with homesteading east of MI/OH
    dy = dy || 500 / 960 * CANVASSIZE;
    center = center || [CANVASSIZE * 0.37, CANVASSIZE * 0.47];
    rotation = rotation || -2;

    // calculate values
    const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;
    const translateX = width / 2 - center[0] * scale;
    const translateY = height / 2 - center[1] * scale;
    return {
      scale,
      transform: `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale}) scale(${scale}) `,
      translate: `translate(${translateX} ${translateY})`,
    }
  };

  const calculateZ: CalculateZ = (scale) => {
    const fullSizeOfCanvas = scale * CANVASSIZE;
    const fullSizeOfZ = (z: number): number => TILESIZE * Math.pow(2, z);
    for (let z = 0; z < 18; z += 1) {
      if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
        return z;
      }
    }
  }

  let { scale: initialScale, transform: initialTransform }: TransformData = calculateTransform({ width, height });
  const [center, setCenter] = useState<Point>([CANVASSIZE / 2, CANVASSIZE / 2]);
  const initialTranslateCalculated = useRef(!stateTerr);
  const [scale, setScale] = useState(initialScale);
  const [transform, setTransform] = useState(initialTransform);

  const getOfficeData = (): ProjectedTownship | null => {
    if (!office) {
      return null;
    }
    return yearData.offices.find(pt => pt.state === stateTerr && pt.office.replace(/[^a-zA-Z]/g, '') === office);
  }

  const getTransformAndCenter = () => {
    let newScale: number = scale;
    let newTransform: string = transform;
    let newTranslate: string;
    let newCenter: Point = center;
    if (!stateTerr) {
      ({ scale: newScale, transform: newTransform, translate: newTranslate } = calculateTransform({ width, height }));
      // the 0.45 is to account for the lack of any offices east of Ohio with the center of the canvas in Kansas at the center of the continental US
      newCenter = [CANVASSIZE * 0.42, CANVASSIZE / 2];
    } else {
      const placeData = (office && yearData)
        ? getOfficeData()
        : (States as ProjectedState[]).find(d => d.abbr === stateTerr);
      if (placeData) {
        ({ scale: newScale, transform: newTransform, translate: newTranslate } = calculateTransform({
          ...calculateCenterAndDxDy(placeData.bounds),
          rotation: placeData.rotation,
          yGutter: (office) ? 0.6 : 0.8,
          xGutter: (office) ? 0.6 : 0.8,
          width,
          height
        }));
        newCenter = getCenter(placeData.bounds);
      }
    }
    return {
      transform: newTransform,
      translate: newTranslate,
      scale: newScale,
      tileScale: newScale / Math.pow(2, calculateZ(newScale) - 2),
      center: newCenter,
    }
  }

  // load the data for the map
  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/yearData/${year}.json`)
      .then(response => {
        const yearDataRaw = response.data as YearDataRaw;
        const offices: ProjectedTownship[] = yearDataRaw.offices
          // filter only for those that exist at the end of the fiscal year--it if was discontinued or moved, we don't show it
          .filter(d => d.office_boundaries.some(ob => ob.tile_id && ob.tile_id.slice(-8) >= `${year}0630`) || ['IL', 'IN', 'MS', 'OH'].includes(d.state))
          .map(d => {
            // get the office_boundary for the end of the fiscal year
            const office_boundary = (['IL', 'IN', 'MS', 'OH'].includes(d.state))
              ? d.office_boundaries[0]
              : d.office_boundaries.find(ob => ob.tile_id && ob.tile_id.slice(-8) >= `${year}0630`);
            const data = d.data.find(d => d.adjustedForMap) || d.data.find(d => !d.adjustedForMap);
            delete data.adjustedForMap;
            return {
              office: d.office,
              state: d.state,
              ...office_boundary,
              ...data,
            }
          });
        setYearData({
          offices,
          conflicts: yearDataRaw.conflicts,
        });
      });
  }, [year]);

  // set initial scale, center, and transform
  useEffect(() => {
    // if this is the initial render and there's a state/territory, calculate the transform values before rendering the map
    if (!initialTranslateCalculated.current) {
      const { center, scale, transform } = getTransformAndCenter();
      setCenter(center);
      setScale(scale);
      setTransform(transform);
      initialTranslateCalculated.current = true;
    }
  });

  // animage and set the transform to position the map within the canvas
  useEffect(() => {
    const { transform: newTransform, center: newCenter, scale: newScale } = getTransformAndCenter();
    if (transform !== newTransform) {
      d3.select(refTranslate.current)
        .transition()
        .duration((initialTranslateCalculated.current) ? ANIMATIONDURATION * 1 : 0)
        .attr('transform', newTransform)
        .on('end', () => {
          setTransform(newTransform);
        });
    }
  });

  // set the scale and center after animation/move
  useEffect(() => {
    const { center: newCenter, scale: newScale } = getTransformAndCenter();
    if (scale !== newScale || center[0] !== newCenter[0]) {
      setScale(newScale);
      setCenter(newCenter);
    }
  });

  let rotation = -2;
  if (office && yearData) {
    const officeData = getOfficeData();
    if (officeData) {
      rotation = officeData.rotation;
    }
  } else if (stateTerr) {
    rotation = (States as ProjectedState[]).find(d => d.abbr === stateTerr).rotation;
  }

  // the second condition here prevents 
  if (yearData && initialTranslateCalculated.current) {
    const projectedTownships = yearData.offices;
    const clashes = yearData.conflicts;
    return (
      <div
        className={`vectorMap ${mapSize}`}
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
            {NorthAmerica.map((d: any) => (
              <path
                d={d}
                className='continent'
                key={d.substring(0, 50)}
              />
            ))}
            <TileLayers
              projectedTownships={projectedTownships}
              center={center}
              rotation={rotation}
              scale={scale}
            />

            <DistrictPolygons
              projectedTownships={projectedTownships}
              center={center}
              scale={scale}
            />
            {/* An inset box around AK */}
            {(parseInt(year) >= 1900) && (

              <path
                d="M -1000 517 L 100 558 L 160 650 L 147 1024"
                stroke='#575653'
                strokeWidth={2}
                fill='transparent'
                style={{
                  pointerEvents: 'none',
                }}
              />
            )}

            {clashes.map(clash => {
              const xRadius = Math.max(2.83, Math.sqrt(clash.native_casualties + clash.us_casualties) * 0.4) / scale;
              const strokeWidth = xRadius / 2;
              return (
                <Tooltip
                  placement="bottom"
                  overlay={<div className='clashPopup'>
                    <h4>{clash.names}</h4>
                    <div className='data'>
                      <label>date</label>
                      <div>{`${clash.start_date.month}/${clash.start_date.day}/${clash.start_date.year}`}</div>
                      <label>{`nation${(clash.nations.length > 1) ? 's' : ''}`}</label>
                      <div>{clash.nations.join(', ')}</div>
                      {(clash.native_casualties > 0) && (
                        <React.Fragment>
                          <label>native casualties</label>
                          <div>{clash.native_casualties}</div>
                        </React.Fragment>
                      )}
                      {(clash.us_casualties > 0) && (
                        <React.Fragment>
                          <label>US casualties</label>
                          <div>{clash.us_casualties}</div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>}
                  key={`conflictOnMap-${clash.x}-${clash.y}-${clash.start_date.month}-${clash.start_date.day}`}
                >
                  <g
                    transform={`rotate(${clash.rotation} ${clash.x}, ${clash.y})`}
                  >
                    <line
                      x1={clash.x - xRadius}
                      x2={clash.x + xRadius}
                      y1={clash.y - xRadius}
                      y2={clash.y + xRadius}
                      strokeWidth={strokeWidth}
                      stroke='red'
                    />
                    <line
                      x1={clash.x - xRadius}
                      x2={clash.x + xRadius}
                      y1={clash.y + xRadius}
                      y2={clash.y - xRadius}
                      strokeWidth={strokeWidth}
                      stroke='red'
                    />
                  </g>
                </Tooltip>
              );
            })}
          </g>

        </svg>

        <div id='mapControls'>
          {(stateTerr) && (
            <Link
              to={(office && !['IL', 'IN', 'OH', 'MS'].includes(stateTerr)) ? makeParams(params, [{ type: 'clear_office' }]) : makeParams(params, [{ type: 'clear_state' }])}
              className='zoom_out'
            >
              {`zoom out to ${(office && !['IL', 'IN', 'OH', 'MS'].includes(stateTerr))
                ? `${us.lookup(stateTerr).ap_abbr}${(!us.lookup(stateTerr).statehood_year || us.lookup(stateTerr).statehood_year > parseInt(year)) ? ' Terr.' : ''}`
                : 'US'}`}
            </Link>
          )}

          <svg
            width={30}
            height={30}
            className='mapSizeButton'
            onClick={() => {
              if (mapSize === 'default') {
                setMapSize('fullscreen');
              } else if (mapSize === 'fullscreen') {
                setMapSize('default');
              }
            }}
          >
            <rect
              x={0}
              y={0}
              height={30}
              width={30}
              rx={8}
            />

            <path
              d={(mapSize !== 'fullscreen')
                ? 'M 7,12 L 7,7 L 12,7 M 18,7 L 23,7 L 23,12 M 23,18 L 23,23 L 18,23 M 12,23 L 7,23 L 7,18'
                : 'M 7,12 L 12,12 L 12,7 M 18,7 L 18,12 L 23,12 M 23,18 L 18,18 L 18,23 M 12,23 L 12,18 L 7,18'}
            />
          </svg>
        </div>

        {(mapSize === 'nolegend') && (
          <div
            id='showLegend'
            onClick={() => setMapSize('default')}
          >
            show legend
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default Map;
