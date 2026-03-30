import styled from 'styled-components';
import { colors, fonts } from '../../../Constants';

export const OfficeLabel = styled.text`
  fill: ${colors.lightColor};
  stroke: rgba(255, 255, 250, 0.9);
  paint-order: stroke;
  stroke-linejoin: round;
  text-anchor: middle;
  font-family: ${fonts.sansSerif};
  font-weight: 700;
  letter-spacing: 0.02em;
  pointer-events: none;
`;
