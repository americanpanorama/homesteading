import * as React from 'react';
import * as d3 from 'd3';
import { Link } from "react-router-dom";
//import * as d3 from 'd3';
import './State.css';
import { StyledState } from '../index.d';
import { ANIMATIONDURATION } from '../Config';

interface Props extends StyledState {
  link: string;
  linkActive: boolean;
  selected: boolean;
  scale: number;
  // onHover(arg0: string): void;
  // onUnhover(): void;
}

const State = (props: Props) => {
  const { useRef, useEffect, useState } = React;
  const {
    abbr,
    name,
    link,
    nhgis_join,
    d,
    labelCoords,
    labelRotation,
    fillOpacity,
    linkActive,
    selected,
    // onHover,
    // onUnhover,
  } = props;
  const [scale, setScale] = useState(props.scale);
  const labelHalo = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    d3.select(labelHalo.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', 7 / props.scale)
      .attr('font-size', 24 / props.scale);
    d3.select(label.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', 2.5 / props.scale)
      .attr('font-size', 24 / props.scale)
      .on('end', () => {
        setScale(props.scale);
      });
  }, [props.scale]);

  return (
    <Link
      to={link}
      key={abbr}
      onClick={(!linkActive) ? (e: any) => { e.preventDefault()   } : () => {}}
      className={`statePolygon ${selected ? 'selected' : ''}`}
    >
      <path
        d={d}
        className={`stateBoundary ${(!linkActive) ? 'unselectable' : ''}`}
        fill='transparent'
        stroke={(selected) ? 'white' : '#6B512D'}  
        strokeWidth={(selected) ? 4 / scale : 2 / scale}       
      />
      {(labelCoords && labelCoords[0]) && (
        <g
          className='inspected'
          transform={`rotate(${labelRotation * -1} ${labelCoords[0]} ${labelCoords[1]})`}
        >
          <text
            x={labelCoords[0]}
            y={labelCoords[1]}
            textAnchor='middle'
            stroke='#6B512D'
            strokeOpacity={0.8}
            fontSize={24 / scale}
            strokeWidth={7 / scale}
            ref={labelHalo}
          >
            {abbr}
          </text>
          <text
            x={labelCoords[0]}
            y={labelCoords[1]}
            textAnchor='middle'
            stroke='#F4DFB8'
            strokeOpacity={0.5}
            strokeWidth={2.5 / scale}
            fontSize={24 / scale}
            ref={label}
          >
            {abbr}
          </text>
        </g>
      )}
    </Link>
  );
};

export default State;
