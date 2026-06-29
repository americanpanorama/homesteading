import styled from 'styled-components';
import * as Constants from '../../../../Constants';

export const RowGroup = styled.g`
  overflow: visible;
`;

export const LabelText = styled.text<{ $fill?: string }>`
  fill: ${({ $fill }) => $fill || Constants.colors.lightColor};
  text-decoration: none;
  width: 100px;
`;

export const StatText = styled.text<{ $fill?: string }>`
  fill: ${({ $fill }) => $fill || Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-weight: 200;
`;

export const HitArea = styled.rect<{ $active?: boolean }>`
  fill: transparent;
  stroke: ${({ $active }) => $active ? Constants.colors.accentColor : 'transparent'};
`;
