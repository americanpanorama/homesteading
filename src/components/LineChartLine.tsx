import * as React from 'react';
import * as d3 from 'd3';

interface ColorStop {
  offset: number;
  transparent: boolean;
}

interface Props {
  d: string;
  color: string;
  id: string;
  colorStops: ColorStop[];
}


const Line = (props: Props) => {
  const {
    d,
    color,
    id,
    colorStops
  } = props;
  const { useRef, useEffect } = React;
  const ref = useRef(null);
  const currentD = useRef(d);

  useEffect(() => {
    if (ref.current) {    
      d3.select(ref.current)
        .transition()
        .duration(750)
        .attr('d', d);
    }
  }, [d])

  return (
    <g>
      <defs>
        <linearGradient
          id={`gradientFor${id}`}
       >
         {colorStops.map(cs => (
           <stop
             offset={`${cs.offset * 100}%`}
             style={{
               stopColor: (cs.transparent) ? 'transparent' : color
             }}
             //stopOpacity={(cs.transparent) ? 1 : 1}
           />
         ))}
        </linearGradient>
      </defs>
      <path 
        d={currentD.current}
        stroke={`url(#gradientFor${id})`}
        //stroke={'pink'}
        fill='transparent'
        ref={ref}
      />
    </g>
  );
}

export default Line;
