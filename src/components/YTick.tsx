import * as React from 'react';
import * as d3 from 'd3';
import { YTick as Tick } from './Barchart.d';
import './YTick.css';

const YTick = ({ tick, width }: { tick: Tick, width: number }) => {
  const { useState, useEffect, useRef } = React;
  const [y, setY] = useState(tick.y);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current)
        .transition()
        .duration(1000)
        .attr('transform', `translate(0, ${tick.y})`)
        .on('end', () => {
          setY(tick.y);
        });
    }
  }, [tick.y]);
  return (
    <g
      transform={`translate(0 ${y})`}
      className='tick y'
      ref={ref}
    >
      <text
        x={-5}
        y={6}
      >
        {tick.label}
      </text>
      <line
        x1={0}
        x2={width}
        y1={0}
        y2={0}
      />
    </g>
  )
}

export default YTick;
