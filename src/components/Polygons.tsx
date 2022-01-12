import * as React from 'react';
import * as d3 from 'd3';
import { useParams } from "react-router-dom";
import District from './District';
import State from './State';
import Reservations from './Reservations';
import FullStateDistrict from './FullStateDistrict';
import { makeParams, colorGradient, useClaimsAndPatentsTypes } from '../utilities';
import { RouterParams, ProjectedState } from '..';
import { ProjectedTownship, Point } from './Map.d';
import { ANIMATIONDURATION } from '../Config';
import States from '../../data/states.json';
import { closeSync } from 'fs';

interface Props {
  projectedTownships: ProjectedTownship[];
  center: Point;
  scale: number;
}

const Polygons = (props: Props) => {
  const { useState, useEffect, useRef } = React;
  const { projectedTownships } = props;
  const [scale, setScale] = useState(props.scale);
  const params = useParams<RouterParams>();
  const { stateTerr } = params;
  const ref = useRef(null);

  const { acresTypes } = useClaimsAndPatentsTypes();

  // useEffect(() => {
  //   if (scale !== props.scale) {
  //     d3.select(ref.current)
  //       .transition()
  //       .duration(ANIMATIONDURATION)
  //       .attr('transform', `scale(${props.scale})`)
  //       .on('end', () => {
  //         setScale(props.scale);
  //       });
  //   }
  // }, [props.scale]);

  // get the full states that need to be displayed
  const stateGLOs = projectedTownships
    .filter(d => ['IL', 'IN', 'OH', 'MS'].includes(d.state))
    .map(d => d.state);

  return (
    <g
      //transform={`scale(${scale})`}
      ref={ref}
    >
      {projectedTownships
        .sort((a: ProjectedTownship, b: ProjectedTownship) => {
          if (a.state === stateTerr && b.state === stateTerr) {
            return acresTypes.reduce((acc, type) => acc + a[type], 0) / a.area - acresTypes.reduce((acc, type) => acc + b[type], 0) / b.area;
          }
          if (a.state === stateTerr) {
            return 1;
          }
          if (b.state === stateTerr) {
            return -1;
          }
          return 0;
        })
        .map((projectedTownship: ProjectedTownship) => (
          <District
            d={projectedTownship.d}
            link={makeParams(params, [{ type: 'set_office', payload: projectedTownship.office }])}
            strokeWidth={(stateTerr === projectedTownship.state) ? 4 / props.scale : 1 / props.scale}
            //strokeWidth={Math.min(1, projectedTownship.acres_claimed * 100 / projectedTownship.area) * 3 / props.scale}
            //fill={colorGradient(projectedTownship.acres_claimed * 100 / projectedTownship.area)}
            fill={colorGradient(acresTypes.reduce((acc, type) => acc + projectedTownship[type], 0) / projectedTownship.area)}
            //stroke={(stateTerr === projectedTownship.state) ? colorGradient(acresTypes.reduce((acc, type) => acc + projectedTownship[type], 0) / projectedTownship.area) : '#181612'}
            stroke='#181612'
            key={`office-${projectedTownship.office}-${projectedTownship.state}-${projectedTownship.area}`}
          />
        ))
      }

      {stateGLOs.map(state => (
        <FullStateDistrict
          abbr={state as 'IL' | 'IN' | 'OH' | 'MS'}
          projectedTownship={projectedTownships.find(d => d.state === state)}
          fill={colorGradient(acresTypes.reduce((acc, type) => acc + projectedTownships.find(d => d.state === state)[type], 0) / projectedTownships.find(d => d.state === state).area)}
          scale={props.scale}
          key={`fullstate${state}`}
        />
      ))}

      {States
        .filter((_s) => {
          const s = _s as ProjectedState;
          return s.bounds && s.bounds[0] && s.d && s.abbr
            && (projectedTownships.some(pt => pt.state === s.abbr && pt.acres_claimed > 0))
        })
        .map((_s) => {
          const state = _s as ProjectedState;
          // aggregate the data for the state
          state.stats = projectedTownships
            .filter(d => d.state === state.abbr)
            .reduce((acc, curr) => ({
              // OK is an exception where the districts don't cover the entire state/territory--far from it
              area: (curr.state === 'OK') ? 44735360 : acc.area + curr.area,
              acres_visualized: acc.acres_visualized + acresTypes.reduce((acc, type) => acc + curr[type], 0)
            }), {
              area: 0,
              acres_visualized: 0
            });
          return state;
        })
        // sort so those that have the most claims and the brightest boundary are on top
        .sort((a, b) => a.stats.acres_visualized / a.stats.area - b.stats.acres_visualized / b.stats.area)
        .map((state) => {
          return (
            <State
              {...state}
              fillOpacity={0}
              //stroke={(!stateTerr) ? colorGradient(state.stats.acres_visualized / state.stats.area) : 'transparent'}
              stroke='#201D18'
              link={makeParams(params, [{ type: 'set_state', payload: state.abbr }])}
              linkActive={state.abbr !== stateTerr}
              selected={state.abbr === stateTerr}
              scale={props.scale}
              key={state.abbr}
            />
          );
        })
      }

      <Reservations />
    </g>
  );
}

export default Polygons;
