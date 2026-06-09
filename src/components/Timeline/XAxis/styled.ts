import styled from "styled-components";
import * as Constants from "../../../Constants";

export const AxisLabelsGroup = styled.g`

`;

export const Label = styled.text`
  font-size: 1em;
  text-anchor: middle;
  fill: silver;
`;

export const CurrentYearLabel = styled(Label)`
  fill: ${Constants.colors.accentColor};
  stroke: ${Constants.colors.mainBGcolor};
  stroke-width: 0.5em;
  font-size: 1.1em;
  font-weight: 700 !important;
  paint-order: stroke fill;
  stroke-linejoin: round;
`;

export const HitArea = styled.rect<{ $active?: boolean }>`
  fill: transparent;
  stroke: ${({ $active }) => $active ? Constants.colors.accentColor : 'transparent'};
  stroke-width: 2px;
`;