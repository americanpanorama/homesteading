import React, { useContext } from 'react';
import { DimensionsContext } from '../../DimensionsContext';
import { Dimensions } from '../../index.d';
import * as Constants from '../../Constants';
import NorthAmericaBasemap from './NorthAmerica/Index';
import InternationalBorder from './InternationalBorder/Index';
import Districts from './Districts/Index';
import States from './States/Index';
import Reservations from './Reservations/Index';
import Clashes from './Clashes/Index';
import * as Styled from './styled';
import Legend from './Legend/Index';
import { MapViewContext } from './ViewContext';
import { useMapViewport, useURLParams, useYearData } from '../../hooks';
import { colors } from '../../Constants';
import Open from '../Buttons/Next';
import Close from '../Buttons/Previous';

const Map = () => {
  const { stateTerr, office, year, yearNum } = useURLParams();
  const { mapDimensions, width: viewportWidth, height: viewportHeight } = useContext(DimensionsContext) as Dimensions;
  const isCompactLayout = !Constants.isWideViewport(viewportWidth, viewportHeight);
  const { width: mapWidth, height: mapHeight, size: mapSize, setMapSize } = mapDimensions;
  const width = mapWidth;
  const height = mapHeight;
  const yearData = useYearData();
  const {
    refTranslate,
    center,
    scale,
    transform,
    rotation,
    isReady,
  } = useMapViewport({
    stateTerr,
    office,
    width,
    height,
    yearData,
  });

  if (yearData && isReady) {
    const mapView = { center, rotation, scale };
    return (
        <MapViewContext.Provider value={mapView}>
        <Styled.VectorMap $mapSize={mapSize} $height={height}>
          {(mapSize === 'default') && (
            <Legend />
          )}

          <svg
            width={width * 2}
            height={height}

          >
            <g
              transform={transform}
              ref={refTranslate}
            >
              <NorthAmericaBasemap />
              {/* <TileLayers /> */}
              <Districts />
              <States />
              <Reservations />
            {/* An inset box around AK */}
            {(yearNum >= 1900) && (

              <Styled.AlaskaInset
                d="M -1000 517 L 100 558 L 160 650 L 147 1024"
                stroke={colors.highlightColor}
                strokeWidth={2}
                fill='transparent'
              />
            )}
              <Clashes />
              
              <InternationalBorder />
            </g>

          </svg>

        </Styled.VectorMap>

        {!isCompactLayout && (
          <Styled.FullscreenToggleContainer>
            <Styled.FullscreenToggle
              type='button'
              $mapSize={mapSize}
              aria-label={mapSize === 'fullscreen' ? 'Collapse expanded map and show timeline' : 'Expand map and collapse timeline'}
              aria-pressed={mapSize === 'fullscreen'}
              onClick={() => setMapSize(mapSize === 'fullscreen' ? 'default' : 'fullscreen')}
            >
              {mapSize === 'fullscreen' ? <Close /> : <Open />}
            </Styled.FullscreenToggle>
          </Styled.FullscreenToggleContainer>
        )}
      </MapViewContext.Provider>
    );
  }
  return null;
};

export default Map;
