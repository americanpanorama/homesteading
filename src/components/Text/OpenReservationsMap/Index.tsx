import * as React from 'react';
import { DimensionsContext } from '../../../DimensionsContext';
import { Dimensions } from '../../../index.d';
import { Point } from '../../Map.d';
import { CANVASSIZE } from '../../../Config';
import * as Styled from './styled';
import { useMapReservations, useMapOpenReservations } from '../../../hooks';
import * as Constants from '../../../Constants';
import NorthAmericaBasemap from '../../Map/NorthAmerica/Index';
import StatesMap from '../../Map/States/Index';
import InternationalBorderMap from '../../Map/InternationalBorder/Index';

interface OpenReservations {
  reservations1912: string;
  openReservations: { d: string; labelCoords: [number, number]; year: number }[]
}

const Map = () => {
  const { useContext } = React;

  const { width: screenWidth } = (useContext(DimensionsContext) as Dimensions);
  const width = Math.min(1300, screenWidth * 0.95);
  const height = 1.5 * width * 500 / 960;
  const indianLands = useMapReservations(1912);
  const reservations = indianLands.filter(d => d.type === 'reservation');
  const openReservations = useMapOpenReservations();

  // calculate value
  const xGutter = 2;
  const yGutter = 2;
  const dx = CANVASSIZE * 0.7; // the 0.7 accounts for there not being any states with homesteading east of MI/OH
  const dy = CANVASSIZE;
  const center: Point = [CANVASSIZE * 0.4, CANVASSIZE * 0.47];
  const rotation = -2;

  const scale = ((width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx);
  const translateX = width / 2 - scale * center[0];
  const translateY = height / 2 - scale * center[1];
  const transform = `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale})`;

  return (
    <Styled.Figure>
      <Styled.Shell $height={height}>
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        >
                <defs>
                  <pattern
                    id='diagonalStripes'
                    patternUnits='userSpaceOnUse'
                    width='6'
                    height='10'
                    patternTransform='rotate(45)'
                  >
                    <rect width='3' height='10' fill={Constants.indianLandsColors} opacity={0.5} />
                  </pattern>
                </defs>
        <g
          transform={transform}
        >
          <g transform={`scale(${scale})`}>
            <NorthAmericaBasemap />
            <StatesMap
              scale={scale}
              year={1912}
              justBoundaries
              disableLink
            />
            <InternationalBorderMap />
              
              {reservations.map(reservation => (
                <Styled.ReservationPath
                  d={reservation.d}
                  $isUnceded={false}
                  $isOpened={false}
                  $strokeWidth={1.5}
                  $uncededStrokeWidth={5}
                  key={reservation.d.substring(0, 50)}
                />
              ))}

              {openReservations.map(reservation => (
                <Styled.ReservationPath
                  d={reservation.d}
                  $isUnceded={false}
                  $isOpened={true}
                  $strokeWidth={1.5}
                  $uncededStrokeWidth={5}
                  key={reservation.d.substring(0, 50)}
                />
              ))}

              <text
                x={440}
                y={412}
                fontSize={11}
                textAnchor='middle'
                transform={`rotate(${rotation * -1} ${440} ${412})`}
              >
                Great Sioux Reservation
              </text>

              <text
                x={490}
                y={570}
                fontSize={11}
                textAnchor='start'
                transform={`rotate(${rotation * -1} ${490} ${570})`}
              >
                Indian Territory
              </text>
          </g>
        </g>
        </svg>
      </Styled.Shell>
      
      <Styled.Legend>
        <Styled.ReservationSwatch />
        <div>Reservations, 1912</div>
        <Styled.ReservationOpenedSwatch />
        <div>Reservations opened to homesteaders, 1891-1912</div>
      </Styled.Legend>

      <Styled.Figcaption>
        By 1912, nearly half of reservation or what had once been reservation lands had been opened to homesteading.
      </Styled.Figcaption>
    </Styled.Figure>
  );
};

export default Map;
