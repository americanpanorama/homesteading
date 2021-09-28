import * as React from 'react';
import { Link } from "react-router-dom";
import * as d3 from 'd3';
import './District.css';
import { ANIMATIONDURATION } from '../Config';

interface Props {
  d: string;
  link: string;
  strokeWidth: number;
  fill: string;
  stroke: string;
}

const District = (props: Props) => {
  const { useEffect, useRef } = React;
  const { d, link, fill, stroke } = props;
  const strokeWidth = useRef(props.strokeWidth);
  const ref = useRef(null);

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .style("stroke-width", props.strokeWidth)
      .on('end', () => {
        strokeWidth.current = props.strokeWidth;
      });
  }, [props.strokeWidth]);

  return (
    <Link
      to={link}
    >
      <path
        d={d}
        style={{
          strokeWidth: strokeWidth.current,
          fill: fill,
          fillOpacity: 0,
          stroke: stroke,
        }}
        className='district'
        ref={ref}
      />
    </Link>
  );
};

export default District;
