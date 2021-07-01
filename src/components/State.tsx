import * as React from 'react';
import * as d3 from 'd3';
import { Link } from "react-router-dom";
// @ts-ignore
import us from 'us';
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
  const labelRef = useRef(null);

  useEffect(() => {
    d3.select(labelHalo.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', 4 / props.scale)
      .attr('font-size', 18 / props.scale);
    d3.select(labelRef.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('stroke-width', 0 / props.scale)
      .attr('font-size', 18 / props.scale)
      .on('end', () => {
        setScale(props.scale);
      });
  }, [props.scale]);

  const label = us.lookup(abbr).ap_abbr;

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
        strokeWidth={(selected) ? 4 / scale : 1 / scale}       
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
            fontSize={18 / scale}
            strokeWidth={4 / scale}
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
              fillOpacity: 0.85,
            }}
            strokeWidth={0 / scale}
            fontSize={18 / scale}
            ref={labelRef}
          >
            {label}
          </text>
        </g>
      )}
    </Link>
  );
};

export default State;
