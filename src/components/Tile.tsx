import * as React from 'react';
import * as d3 from 'd3';

interface Props {
  tile_id: string;
  z: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  calculateZ: (number) => number;
}

const Tile = (props: Props) => {
  const {
    tile_id,
    z,
    x,
    y,
    opacity,
    calculateZ
  } = props;

  const { useState, useEffect, useRef } = React;

  const [scale, setScale] = useState(props.scale);
  const ref = useRef(null);

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(5000)
      .attr('y', 256 *  (Math.pow(2, z) - y) - 256)
  }, [props.z]);

  return (
    <image
      xlinkHref={`/tiles/${tile_id}/${z}/${x}/${y}.png`}
      width={256}
      x={256 * x}
      y={256 * (Math.pow(2, z) - y) - 256}
      key={`${tile_id}/${z}/${x}/${y}`}
      opacity={opacity}
      ref={ref}
    />
  );
}

export default Tile;
