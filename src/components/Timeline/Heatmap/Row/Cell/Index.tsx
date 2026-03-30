import * as React from 'react';
import * as d3 from 'd3';
import { TimelineCell } from '../../../../../index.d';
import { useURLParams } from '../../../../../hooks';
import * as Styled from './styled';

const Tile = (props: TimelineCell) => {
  const { useState, useEffect, useRef } = React;
  const ref = useRef<SVGRectElement>(null);
  const [fill, setFill] = useState(props.fill);
  const [fillOpacity, setFillOpacity] = useState(props.fillOpacity);

  const { yearNum } = useURLParams();

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(1000)
      .style('fill', props.fill)
      .style('fill-opacity', props.fillOpacity)
      .on('end', () => {
        setFill(props.fill);
        setFillOpacity(props.fillOpacity);
      });
  }, [props.fill, props.fillOpacity]);

  return (
    <Styled.CellRect
      x={props.x}
      y={2.5}
      width={props.width}
      height={20}
      $selected={props.year === yearNum}
      $fill={fill}
      $fillOpacity={fillOpacity}
      ref={ref}
      key={`cellFor${props.year}`}
    />
);
};

export default Tile;
