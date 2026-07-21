import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const ReservationPath = styled.path<{
  $isUnceded: boolean;
  $isOpened: boolean;
  $strokeWidth: number;
  $uncededStrokeWidth: number;
}>`
  // styling for unceded lands
  ${({ $isUnceded }) => $isUnceded &&`
    fill: rgba(103, 229, 197, 0.35);
    stroke: #008F76;
    stroke-width: 0.5;
    stroke-opacity: 0.85;
  `}

  // styling for reservations
  ${({ $isUnceded, $isOpened }) => !$isUnceded && !$isOpened && `
    fill : rgba(103, 229, 197, 0.1);
    stroke: ${Constants.indianLandsColors};
    stroke-width: 1.5;
  `}

  // styling for opened reservations
  ${(props) => !props.$isUnceded && props.$isOpened && `
    fill : url(#diagonalStripes);
    stroke-width: 1.5;
    stroke: ${Constants.indianLandsColors};

  `}

  //stroke: ${Constants.indianLandsColors};
  vector-effect: non-scaling-stroke;
`;
