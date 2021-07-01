import * as React from 'react';
import * as d3 from 'd3';
import { useParams, Link } from "react-router-dom";
import DimensionsContext from '../DimensionsContext';
import District from './District';
import State from './State';
import { makeParams } from '../utilities';
import { Dimensions, RouterParams, ProjectedState } from '../index.d';
import { TileData, ProjectedTownship, Point, CalculateZ, Bounds  } from './VectorMap.d';
import { CANVASSIZE, TILESIZE, ANIMATIONDURATION } from '../Config';
import States from '../../data/states.json';

interface Props {
  projectedTownships: ProjectedTownship[];
  center: Point;
  scale: number;
}

const DistrictPolygons = (props: Props) => {
  const { useState, useEffect, useRef, useContext } = React;
  const {
    projectedTownships,
    center,
  } = props;
  const [scale, setScale] = useState(props.scale);
  const params = useParams<RouterParams>();
  const { stateTerr, office, fullOpacity } = params;
  const year = params.year || '1863';
  const ref = useRef(null);

  useEffect(() => {
    if (scale !== props.scale) {
      d3.select(ref.current)
        .transition()
        .duration(ANIMATIONDURATION)
        .attr('transform', `scale(${props.scale})`)
        .on('end', () => {
          setScale(props.scale);
        });    
    }
  }, [props.scale]);

  return (
    <g transform={`scale(${scale})`} ref={ref}>
      {projectedTownships
        .sort((a: ProjectedTownship, b: ProjectedTownship) => a.acres_claimed / a.area - b.acres_claimed / b.area )
        .map((projectedTownship: ProjectedTownship) => (
          <District
            d={projectedTownship.d}
            link={makeParams(params, [{ type: 'set_office', payload: projectedTownship.office}])}
            strokeWidth={1 / props.scale}
            key={`office-${projectedTownship.tile_id}`}
          />
        ))
      } 

      {States
        .filter((s: ProjectedState) => s.bounds && s.bounds[0] && s.d && s.abbr
          && projectedTownships.some(pt => pt.state === s.abbr && pt.acres_claimed > 0))
        .map((state: ProjectedState) => {
          return (
            <State
              {...state}
              //fillOpacity={(hoveredState && state.abbr !== hoveredState.abbr) ? 0.4 : 0}
              fillOpacity={0}
              link={makeParams(params, [{ type: 'set_state', payload: state.abbr }])}
              linkActive={state.abbr !== stateTerr}
              selected={state.abbr === stateTerr}
              scale={props.scale}
              // onHover={onStateHover}
              // onUnhover={onStateUnhover}
              key={state.abbr}
            />
          );
        })
      }

    </g>
  );
}

export default DistrictPolygons;
