import styled from 'styled-components';
import * as Constants from '../../../../Constants';

export const RowGroup = styled.g`
  overflow: visible;
`;

export const StatText = styled.text`
  font-family: Inconsolata, monospace;
  font-weight: 200;
`;

export const HitArea = styled.rect<{ $active?: boolean }>`
  fill: transparent;
  stroke: ${({ $active }) => $active ? 'Constants.colors.accentColor' : 'transparent'};
`;
