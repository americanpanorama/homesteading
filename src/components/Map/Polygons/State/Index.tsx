import * as React from 'react';
import * as d3 from 'd3';
import { Link } from "react-router-dom";
// @ts-ignore
import us from '../../../../us.js';
import { useURLParams } from '../../../../hooks';
import { StyledState } from '../../../../index.d';
import { ANIMATIONDURATION } from '../../../../Config';
import StateStyles from './styled';
import { getScaledStrokeWidth } from '../../utilities';

interface Props extends StyledState {
  link: string;
  linkActive: boolean;
  selected: boolean;
  scale: number;
}

const State = (props: Props) => {
  const { useRef, useEffect, useState } = React;
  const {
    fill,
    abbr,
    link,
    d,
    labelCoords,
    labelRotation,
    linkActive,
    selected,
  } = props;
  const { yearNum } = useURLParams();
  const [scale, setScale] = useState(props.scale);
  const [stroke, setStroke] = useState(props.stroke);
  const boundaryRef = useRef(null);
  const labelHalo = useRef(null);
  const labelRef = useRef(null);

  const fontSize = 12;

  useEffect(() => {
    d3.select(labelHalo.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', fontSize / 4 / props.scale)
      .attr('font-size', fontSize / props.scale);
    d3.select(labelRef.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', 0 / props.scale)
      .attr('font-size', fontSize / props.scale)
      .on('end', () => {
        setScale(props.scale);
      });
  }, [props.scale]);

  useEffect(() => {
    d3.select(boundaryRef.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke', props.stroke)
      .on('end', () => {
        setStroke(props.stroke);
      });
  }, [props.stroke]);

  const label = `${us.lookup(abbr).ap_abbr}${(!us.lookup(abbr).statehood_year || us.lookup(abbr).statehood_year > yearNum) ? ' Terr.' : ''}`;

  return (
    <>
      <StateStyles />
      <Link
        to={link}
        key={abbr}
        onClick={(!linkActive) ? (e: any) => { e.preventDefault() } : () => {}}
        className={`statePolygon ${selected ? 'selected' : ''}`}
        aria-label={label}
        aria-disabled={!linkActive}
        tabIndex={linkActive ? 0 : -1}
      >
        <path
          d={d}
          className={`stateBoundary ${(!linkActive) ? 'unselectable' : ''}`}
          style={{
            stroke: '#D6C3B1',
            strokeWidth: selected
              ? getScaledStrokeWidth(scale, 3.2, 0.45, 1.35)
              : getScaledStrokeWidth(scale, 1.35, 0.22, 0.8),
            fill: fill || 'transparent',
            fillOpacity: 0.8,
          }}
          ref={boundaryRef}
        />
        {/* {(labelCoords && labelCoords[0]) && (
          <g
            className='inspected'
            transform={`rotate(${labelRotation * -1} ${labelCoords[0]} ${labelCoords[1]})`}
          >
            <text
              x={labelCoords[0]}
              y={labelCoords[1]}
              textAnchor='middle'
              //stroke='#6B512D'
              stroke='#000000'
              strokeOpacity={0.5}
              fontSize={fontSize / scale}
              strokeWidth={fontSize / 4 / scale}
              ref={labelHalo}
            >
              {label}
            </text>
            <text
              x={labelCoords[0]}
              y={labelCoords[1]}
              textAnchor='middle'
              style={{
                fill: '#F4DFB8',
                fillOpacity: 0.5,
              }}
              strokeWidth={0 / scale}
              fontSize={fontSize / scale}
              ref={labelRef}
            >
              {label}
            </text>
          </g>
        )} */}
      </Link>
    </>
  );
};

export default State;
