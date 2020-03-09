import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const Sliver = ({ p }) => {
  const [fill, setFill] = useState(p.fill);
  const elementRef = useRef();
  useEffect(() => {
    d3.select(elementRef.current)
      .transition()
      .duration(500)
      .style('fill', p.fill)
      .on('end', () => setFill(p.fill));
  }, [p.fill]);

  return (
    <path
      d={p.d}
      fillOpacity={p.fillOpacity}
      key={`sliver${p.id}`}
      stroke='transparent'
      strokeWidth={0}
      id={p.id}
      ref={elementRef}
      style={{
        fill: fill,
      }}
    />
  );
};

export default Sliver;

Sliver.propTypes = {
  geojson: PropTypes.object,
};

Sliver.defaultProps = {
  
};
