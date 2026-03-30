import styled from 'styled-components';
import * as Constants from '../../../../../Constants';

export const CellRect = styled.rect.attrs<{ $fill: string; $fillOpacity: number; $selected: boolean }>(({ $fill, $fillOpacity }) => ({
  style: {
    fill: $fill,
    fillOpacity: $fillOpacity,
  },
}))`
  stroke: ${({ $selected }) => ($selected ? Constants.colors.accentColor : Constants.colors.mutedTextColor)};
  stroke-width: 0.25;
`;
