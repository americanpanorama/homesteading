import styled, { css, keyframes } from 'styled-components';
import * as Constants from '../../../../Constants';

const hideshow = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const ReservationPath = styled.path<{ $isOpened: boolean; $isUnceded: boolean }>`
  fill: ${Constants.indianLandsColors};
  stroke: ${Constants.indianLandsColors};
  stroke-width: 1px;
  fill-opacity: 0.2;
  pointer-events: none;

  ${({ $isOpened }) => $isOpened && css`
    animation: ${hideshow} 2s ease infinite;
    stroke: ${Constants.indianLandsColors};
    fill-opacity: 0.5;
    stroke-dasharray: 1 10;
  `}

  ${({ $isUnceded }) => $isUnceded && css`
    // fill with a striped pattern running at a 45 degree angle, with stripes that are 2px wide and 4px apart
    fill: url(#diagonalStripes);
    stroke-dasharray: 2 4;
    stroke: ${Constants.indianLandsColors};
    stroke-width: 0.35px;
    fill-opacity: 0.5;
  `}
`;
