import * as React from 'react';
import * as d3 from 'd3';
import { useParams, Link } from 'react-router-dom';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, RouterParams } from '../index.d';
import { Bar as BarI } from './Barchart.d';
import './BarSet.css';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
}

const Bar = (props: Props) => {
  const { useState, useEffect, useRef } = React;
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);
  const ref = useRef(null);

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(1000)
      .attr('x', props.x)
      .attr('y', props.y)
      .attr('width', props.width)
      .attr('height', props.height)
      .on('end', () => {
        setX(props.x);
        setWidth(props.width);
        setY(props.y);
        setHeight(props.height);
      });
  }, [props.width, props.height, props.x, props.y]);

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={props.className}
      ref={ref}
    />
  );
};

export default Bar;
