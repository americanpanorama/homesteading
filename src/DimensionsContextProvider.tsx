import React, { useEffect, useMemo, useState } from 'react';
import { DimensionsContext } from './DimensionsContext';
import * as Constants from './Constants';
import { Dimensions, MapSize } from './index.d';

const DimensionsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapSize, setMapSize] = useState<MapSize>('default');

  const calculateDimensions = (): Dimensions => {
    const { innerWidth, innerHeight } = window;
    const { clientWidth, clientHeight } = document.documentElement || { clientWidth: null, clientHeight: null };
    const width = clientWidth || innerWidth || 1280;
    const height = clientHeight || innerHeight || 720;
    const isDesktop = width >= Constants.sizes.desktop;
    const sidebarWidth = Math.max(width * 0.4, 600);
    const isExpandedMap = isDesktop && mapSize === 'fullscreen';

    const mapHeights = {
      default: height - 75 - 150 - 25,
      nolegend: height - 75 - 150 - 25,
      fullscreen: isDesktop
        ? height - 75 - 150 - 25
        : Math.max(width * 0.72, height * 0.58),
    };

    const isMobile = width <= Constants.sizes.desktop;
    const isPhoneSize = width <= 500;
    const mapDimensions = {
      // Expanded map mode reclaims the sidebar width while staying inside the app shell.
      width: !isDesktop
        ? width
        : isExpandedMap
          ? width - 50
          : Math.max(320, width - sidebarWidth - 50),
      height: !isMobile ? mapHeights[mapSize] : width * 0.6,
      size: mapSize,
      setMapSize,
    };

    const timelineSidebarWidth = isMobile ? width * 0.95 : sidebarWidth;
    const timelineDimensions = {
      width: Math.max(320, timelineSidebarWidth - 32),
      height: height - 46 - 46,
      leftAxisWidth: 100,
      labelsWidth: 100,
    };

    const officeBarchartDimensions = {
      xAxisHeight: 30,
      yAxisWidth: 70,
      padding: 40,
      paddingTop: 40,
      chartBodyHeight: 160,
      chartBodyWidth: timelineDimensions.width - 70 - 40,
      height: 160 + 40 + 30,
    };

    return {
      width,
      height,
      isMobile,
      isPhoneSize,
      mapDimensions,
      timelineDimensions,
      officeBarchartDimensions,
    };
  };

  const [dimensions, setDimensions] = useState<Dimensions>(() => calculateDimensions());

  useEffect(() => {
    const onResize = () => setDimensions(calculateDimensions());
    window.addEventListener('resize', onResize);
    setDimensions(calculateDimensions());

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    setDimensions(calculateDimensions());
  }, [mapSize]);

  const value = useMemo(() => dimensions, [dimensions]);

  return (
    <DimensionsContext.Provider value={value}>
      {children}
    </DimensionsContext.Provider>
  );
};

export default DimensionsContextProvider;
