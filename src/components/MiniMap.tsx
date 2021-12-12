import * as React from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { ProjectedState, RouterParams } from '..';
import { CalculateTransform, CalculateCenterAndDXDY, CalculateZ, Bounds, Point, ProjectedTownshipAllOffices, District, YMD } from './Map.d';
import States from '../../data/states.json';
import { CANVASSIZE, TILESIZE } from '../Config';
import { getDateValue } from '../utilities';
import './MiniMap.css';

const Map = () => {
  const { useEffect, useContext, useState, useRef } = React;

  const params = useParams<RouterParams>();
  const { stateTerr, office } = params;
  const year = params.year || '1863';

  const width = 100;
  const height = 100;
  const [officeBoundaries, setOfficeBoundaries] = useState<District>(null);

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
    center = center || [CANVASSIZE * 0.37, CANVASSIZE / 2];
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

  const calculateZ: CalculateZ = (scale) => {
    const fullSizeOfCanvas = scale * CANVASSIZE;
    const fullSizeOfZ = (z: number): number => TILESIZE * Math.pow(2, z);
    for (let z = 0; z < 18; z += 1) {
      if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
        return z;
      }
    }
  }

  const placeData = (States as ProjectedState[]).find(d => d.abbr === stateTerr);
  const { scale, transform, translate } = calculateTransform({
    ...calculateCenterAndDxDy(placeData.bounds),
    rotation: placeData.rotation,
    yGutter: 0.8,
    xGutter: 0.8,
    width,
    height
  });

  // load the data for the map
  useEffect(() => {
    console.log(`${process.env.PUBLIC_URL}/data/districtsData/${office}=${stateTerr}.json`);
    axios(`${process.env.PUBLIC_URL}/data/districtsData/${office}-${stateTerr}.json`)
      .then(response => {
        console.log(response.data);
        setOfficeBoundaries(response.data as District);
      });
  }, [year, stateTerr, office]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const overlapsWithFiscalYear = (start: YMD, end: YMD): boolean => {
    const startValue = getDateValue(start.year, start.month, start.day);
    const endValue = getDateValue(end.year, end.month, end.day);
    const fiscalYearStart = getDateValue(parseInt(year) - 1, 7, 1);
    const fiscalYearEnd = getDateValue(parseInt(year), 6, 30);
    return (startValue < fiscalYearStart && endValue > fiscalYearStart) ||
      (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
      (startValue > fiscalYearStart && endValue < fiscalYearEnd);
  }
  

  if (officeBoundaries && officeBoundaries.boundaries.length > 0) {
    return (
      <div
      >
        {officeBoundaries.boundaries
          .map(officeBoundary => (
            <div
              className={`minimap ${overlapsWithFiscalYear(officeBoundary.start_date, officeBoundary.end_date) ? 'selected' : ''}`}
            >
              <svg
                width={width}
                height={height}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  transform={transform}
                >
                  <g transform={`scale(${scale})`}>
                    <path
                      d={placeData.d}
                      className='stateTerr'
                      strokeWidth={1 / scale}
                    />
                    <path
                      d={officeBoundary.d}
                      className='district'
                    />
                  </g>
                </g>
              </svg>
              <div className='dates'>
                {`${months[officeBoundary.start_date.month - 1]} ${officeBoundary.start_date.day}, ${officeBoundary.start_date.year} -`}
                <br />
                {`${months[officeBoundary.end_date.month - 1]} ${officeBoundary.end_date.day}, ${officeBoundary.end_date.year}`}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return null;

};

export default Map;
