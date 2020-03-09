import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, FeatureGroup, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import Sliver from './Sliver.jsx';
import './Map.css';

const TheMap = ({ polygons, features, tileUrls, selectedYear, selectYear }) => {
  useEffect(() => {
    if (selectedYear < 1912) {
      // setTimeout(() => {
      //   selectYear(selectedYear + 1);
      // }, 1000);
    }
  });

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Map 
        bounds={[
          [36, -101],
          [42, -109]
        ]}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}@2x.png"
          detectRetina={true}
        />

        {tileUrls.map(urlData => (
          <TileLayer
            url={urlData.url}
            bounds={urlData.bounds}
            key={`tl4${urlData.url}`}
            tms={true}
          />
        ))}

          {features.map(f => (
            <FeatureGroup
             key={`${f.properties.id}-${f.properties.startYear}-${f.properties.endYear}-${selectedYear}`}
            >
              <GeoJSON
                data={f}
                style={{
                  fillOpacity: f.properties.fillOpacity,
                  fillColor: 'transparent',
                  color: '#9ea7aa',
                  weight: 1,
                }}
              />
            </FeatureGroup>
          ))}

          {polygons.map(f => (
            <Sliver
              feature={f}
              key={`sliver${f.properties.id}`}
            />
          ))}
      </Map>
    </div>
  );
};

export default TheMap;

TheMap.propTypes = {

};

TheMap.defaultProps = {
  


};
