import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const ReservationPath = styled.path.attrs<{
  $isUnceded: boolean;
  $isOpened: boolean;
  $strokeWidth: number;
  $uncededStrokeWidth: number;
}>(({ $isUnceded, $isOpened, $strokeWidth, $uncededStrokeWidth }) => ({
  style: {
    fill: $isUnceded ? 'url(#diagonalStripes)' : 'rgba(103, 229, 197, 0.5)',
    strokeWidth: $isUnceded ? $uncededStrokeWidth : $strokeWidth,
    fillOpacity: $isOpened ? 0.22 : 0.32,
  },
}))`
  stroke: ${Constants.indianLandsColors};
  vector-effect: non-scaling-stroke;
`;
