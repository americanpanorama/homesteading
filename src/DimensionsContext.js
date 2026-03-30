import React from 'react';

const defaultDimensions = {
  width: 1280,
  height: 720,
  isMobile: false,
  isPhoneSize: false,
  mapDimensions: {
    width: 768,
    height: 460,
    size: 'default',
    setMapSize: (_nextSize) => {},
  },
  timelineDimensions: {
    width: 600,
    height: 400,
  },
  officeBarchartDimensions: {
    xAxisHeight: 30,
    yAxisWidth: 70,
    padding: 40,
    paddingTop: 40,
    chartBodyHeight: 160,
    chartBodyWidth: 490,
    height: 230,
  },
};

export const DimensionsContext = React.createContext(defaultDimensions);

export const CategoriesContext = React.createContext();
