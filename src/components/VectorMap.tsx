import * as React from 'react';
import { useAsync } from 'react-async';
import * as d3 from 'd3';
import { Link, useParams, useHistory } from "react-router-dom";
import DimensionsContext from '../DimensionsContext';
import { Dimensions } from '../index.d';
import './VectorMap.css';  

interface RouterParams {
  year: string;
}

interface ProjectedTownship {
  d: string;
  office: string;
  state: string;
  area: number;
  claims: number;
  acres_claimed: number;
  patents: number;
  acres_patented: number;
  labelCoords: [number, number];
  bounds: [[number, number], [number, number]];
  gisJoin: string; 
  tile_id: number;
}

interface AsyncParams {
  data: ProjectedTownship[];
  error: any;
}

interface TileData {
  tile_id: number;
  z: number;
  y: number;
  x: number;
  opacity: number;
}

function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}


const loadData = async ({ year }: RouterParams) => {
  const response = await fetch(`${process.env.PUBLIC_URL}/data/yearData/${year}.json`);
  if (!response.ok) { console.warn(response) }
  return response.json();
}

const VectorMap = () => {
  const { useEffect, useContext } = React;
  const dimensions: Dimensions = useContext(DimensionsContext);
  const { year } = useParams<RouterParams>();
  const history = useHistory();

  const { width, height } = dimensions.mapDimensions;

  useEffect(() => {
    if (parseInt(year) < 1912) {
      setTimeout(() => {
        //history.push(`/${parseInt(year) + 1}`);
      }, 1000)
    }
  });


  const { data, error }: AsyncParams = useAsync({
    promiseFn: loadData,
    year: year,
    watch: year,
  });

  if (data) {
    // get the selected land office data
    const slo: ProjectedTownship = data[15];
    console.log(slo.bounds[1][1] + slo.bounds[0][1]);
    console.log(slo); 
    let yGutter = 0.1;
    let xGutter = 0.1;
    let center = [(slo.bounds[0][0] + slo.bounds[1][0]) / 2 * 1000, (0 + (slo.bounds[1][1] + slo.bounds[0][1]) / 2) * 1000];
    let dx = Math.abs(slo.bounds[0][0] - slo.bounds[1][0]) * 1000;
    let dy = Math.abs(slo.bounds[0][1] - slo.bounds[1][1]) * 1000;  // 500 / 960 * 
    // calculate the scale
    const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;


    const translateX = width / 2 - scale * center[0];
    const translateY = height / 2 - scale * center[1];

    const fullSize = scale * 1000 ;
    
    let z = 0;
    for (let tempsize = 256 * Math.pow(2, z); tempsize < fullSize; z += 1, tempsize = 256 * Math.pow(2, z)) {}

    const { tileZ, tileWidth } = {
      tileZ: 2,
      tileWidth: (256  * scale),
    };
  //   const getTownshipTiles = (mapPosition) => {
  //     const officeIds = data.map((projectedTownship: ProjectedTownship) => projectedTownship.tile_id);
  //     const fullDimension = Math.max(width, height) * Math.pow(2, mapPosition.z);

    const tiles: TileData[] = [];
    data.forEach((projectedTownship: ProjectedTownship) => {
      const tilesForCanvas = Math.pow(2, z);
      const minX: number = Math.floor(projectedTownship.bounds[0][0] / (1 / tilesForCanvas));
      const maxX: number = Math.floor(projectedTownship.bounds[1][0] / (1 / tilesForCanvas));
      const maxY: number = tilesForCanvas - 1 - Math.floor(projectedTownship.bounds[0][1] / (1 / tilesForCanvas));
      const minY: number = tilesForCanvas - 1 - Math.floor(projectedTownship.bounds[1][1] / (1 / tilesForCanvas));
      for (let tempX = minX; tempX <= maxX; tempX += 1) {
        for (let tempY = minY; tempY <= maxY; tempY += 1) {
//if (projectedTownship.tile_id === 287) {
          tiles.push({
            tile_id: projectedTownship.tile_id,
            z: z,
            x: tempX,
            y: tempY,
            opacity: 0.1 + 0.9 * projectedTownship.acres_claimed * 100 / projectedTownship.area,
          });
//}
        }
      }
    });

    console.log(tiles.filter((d => d.tile_id === 158)));
    console.log(`width: ${width}`);
    console.log(`scale: ${scale}`);
    console.log(`z: ${z}`);
    console.log(`tileWidth: ${tileWidth}`);
    console.log(`translateX: ${translateX}`);
    console.log(`translateY: ${translateY}`);
    console.log(`scale % 1: ${scale % 1}`)
    console.log(`center: ${center}`)
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
          <g transform={`translate(${translateX} ${translateY}) scale(${scale / (Math.pow(2, z - 2))})`}>
            <rect 
              x={0}
              y={256}
              height={256}
              width={256}
              fill='silver'
              fillOpacity={0.1}

            />
            <rect 
              x={256}
              y={0}
              height={256}
              width={256}
              fill='purple'
              fillOpacity={0.1}

            />
            {tiles.map((d: TileData) => (
              <image
                xlinkHref={`//s3.amazonaws.com/dsl-general/homesteading/${d.tile_id}/${d.z}/${d.x}/${d.y}.png`}
                width={256}
                x={256 * d.x}
                y={256 *  (Math.pow(2, z) - d.y) - 256}
                key={`${d.tile_id}/${d.z}/${d.x}/${d.y}`}
                opacity={d.opacity}
              />
            ))}
          </g>

          <g transform={`translate(${translateX} ${translateY}) scale(${scale})`}> 
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((x: number) => 
              <g key={`gridX${x}`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((y: number) => 
                  <g key={`gridY${y}`}>
                    <rect
                      x={x * 256}
                      y={(Math.pow(2, z) -y) * 256}
                      width={256}
                      height={256}
                      fill='black'
                      fillOpacity={0}
                      stroke='#224'
                      strokeOpacity={0.2}
                    />
                    <text
                      x={x * 256 + 256/2 / z}
                      y={(Math.pow(2, z) - y) * 256  - 256/2 / z}
                      textAnchor='middle'
                      stroke='#222'
                    >
                      {`${x}, ${y}`}
                    </text>

                  </g>
                )}
              </g>
            )}
          </g>
            <g transform={`translate(${translateX} ${translateY}) scale(${scale * 1024})`}> 

              <rect 
                x={0.5}
                y={0}
                height={0.5}
                width={0.5}
                fill='pink'
                fillOpacity={0.3}

              />
              {data.sort((a: ProjectedTownship, b: ProjectedTownship) => a.acres_claimed / a.area - b.acres_claimed / b.area ).map((projectedTownship: ProjectedTownship) => (
                <path
                  d={projectedTownship.d}
                  key={`office-${projectedTownship.tile_id}`}
                  //fill='#112'
                  //fillOpacity={0.8 - 0.8 * Math.min(1, projectedTownship.acres_claimed * 100 / projectedTownship.area)}
                  fill={shadeRGBColor(d3.interpolateGnBu(1 - projectedTownship.acres_claimed * 100 / projectedTownship.area), -0.9 + 0.9 * projectedTownship.acres_claimed * 100 / projectedTownship.area)}

                  //fillOpacity={(Math.min(1, projectedTownship.acres_claimed * 100 / projectedTownship.area)) / 3}
                  fillOpacity={0}
                  stroke={d3.interpolateViridis(projectedTownship.acres_claimed * 100 / projectedTownship.area)}
                  strokeWidth={(Math.min(1, projectedTownship.acres_claimed * 100 / projectedTownship.area)) / Math.max(width, height) / scale * 3 }
                  //strokeOpacity={(Math.min(1, projectedTownship.acres_claimed * 100 / projectedTownship.area))}
                  //stroke='#112'
                  //strokeWidth={0.75 / (scale * 1024)}
                />
              ))} 
            </g>

            
            {/*
            <g transform={`scale(${scale})`}>
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
              ))} 

            </g>
  j  */}




        </svg>
      </div>
    );
  }

  return null;
};

export default VectorMap;

