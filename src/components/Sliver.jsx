import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { GeoJSON } from 'react-leaflet';

const Sliver = ({ feature }) => {
  const elementRef = React.useRef();
  const [fill, setFill] = useState(feature.properties.fill);
  useEffect(() => {
    if (fill !== feature.properties.fill) {
      console.log(elementRef.current.leafletElement.options.fillColor, feature.properties.fill);
      setFill(feature.properties.fill);
    }
    //elementRef.current.leafletElement.options.fillColor = feature.properties.fill;
    // console.log();
    // d3.select(d3.select(`#sliver${feature.properties.id}`))
    //   .transition()
    //   .duration(2000)
    //   .style('fill-opacity', feature.properties.fillOpacity);
      // .style('fill-color', feature.properties.fill);
  });


  return (
    <GeoJSON
      data={feature}
      style={{
        fillOpacity: 0, // feature.properties.fillOpacity,
        fillColor: 'pink', //fill,
        color: 'pink', // '#9ea7aa',
        weight: 1,
      }}
      ref={elementRef}
      id={`sliver${feature.properties.id}`}
    />
  );
};

export default Sliver;

Sliver.propTypes = {
  geojson: PropTypes.object,
};

Sliver.defaultProps = {
  
};
