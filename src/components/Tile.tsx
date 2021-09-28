import * as React from 'react';
import * as d3 from 'd3';
import { TileData } from './Map.d';
import { TILESIZE, ANIMATIONDURATION } from '../Config';

const Tile = (props: TileData) => {
  const { useState, useEffect, useRef } = React;
  const ref = useRef(); 
  const [opacity, setOpacity] = useState(props.opacity);

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .attr('opacity', props.opacity)
      .on('end', () => {
        setOpacity(props.opacity);
      });
  }, [props.opacity]);

  return (
    <image
      xlinkHref={`//s3.amazonaws.com/dsl-general/homesteading/${props.tile_id}/${props.z}/${props.x}/${props.y}.png`}
      //xlinkHref={`/tiles/${props.tile_id}/${props.z}/${props.x}/${props.y}.png`}
      transform={`translate(${(props.translate) ? props.translate.join(' ') : '0 0'})`}
      width={TILESIZE}
      x={TILESIZE * props.x}
      y={TILESIZE *  (Math.pow(2, props.z) - props.y) - TILESIZE}
      opacity={opacity}
      ref={ref}
    />
  );
};

export default Tile;
