import * as React from 'react';
import * as d3 from 'd3';
import { TimelineCell } from '../index.d';

const Tile = (props: TimelineCell) => {
  const { useState, useEffect, useRef } = React;
  const ref = useRef(); 
  const [height, setHeight] = useState(props.height);
  const [fill, setFill] = useState(props.fill);
  const [fillOpacity, setFillOpacity] = useState(props.fillOpacity);

  const rowHeight = 25;

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(1000)
      .attr('y', (rowHeight - props.height) / 2)
      .attr('height', props.height)
      .style('fill', props.fill)
      .style('fill-opacity', props.fillOpacity)
      .on('end', () => {
        setHeight(props.height);
        setFill(props.fill);
        setFillOpacity(props.fillOpacity);
      });
  }, [props.height, props.fill, props.fillOpacity]);

  return (
    <rect
      x={props.x}
      y={(rowHeight - height) / 2}
      width={props.width}
      height={height}
      stroke='#15262F'
      strokeWidth={1}
      //className={`cell`} 
      style={{
        fill: fill,
        fillOpacity: fillOpacity,
      }}
      ref={ref}
      key={`cellFor${props.x}`}
    />
);
};

export default Tile;
