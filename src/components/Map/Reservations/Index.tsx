import React from 'react';
import { useMapReservations, useMapView } from '../../../hooks';
import * as Constants from '../../../Constants';
import { getScaledStrokeWidth } from '../utilities';
import * as Styled from './styled';

const Reservations = () => {
  const { scale } = useMapView();
  const polygons = useMapReservations();

  return (
    <g>
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
      {polygons.map((reservation) => (
        <Styled.ReservationPath
          d={reservation.d}
          key={`reservation${reservation.d.substring(0, 15)}`}
          $isUnceded={reservation.type === 'unceded land'}
          $isOpened={reservation.type === 'open_res'}
          $strokeWidth={getScaledStrokeWidth(scale, 1.9, 0.2, 0.9)}
          $uncededStrokeWidth={getScaledStrokeWidth(scale, 0.7, 0.14, 0.35)}
        />
      ))}
    </g>
  );
};

export default Reservations;
