import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

export const Card = styled.div<{ $selected: boolean }>`
  display: block;
  gap: 8px;
  justify-items: center;
  padding: 8px;
`;

export const Svg = styled.svg`
  display: block;
  overflow: visible;
`;

export const StateTerritoryPath = styled.path.attrs<{ $strokeWidth: number; $selected: boolean }>(({ $strokeWidth, $selected }) => ({
  style: {
    strokeWidth: `${$strokeWidth}px`,
    strokeOpacity: $selected ? 0.85 : 0.38,
  },
}))`
  fill: rgba(255, 255, 255, 0.65);
  stroke: ${Constants.colors.lightColor};
`;

export const DistrictPath = styled.path.attrs<{ $selected: boolean }>(({ $selected }) => ({
  style: {
    fillOpacity: $selected ? 0.42 : 0.2,
  },
}))`
  fill: ${Constants.colors.accentColor};
  stroke: none;
`;

export const Dates = styled.div`
  text-align: center;
  color: ${Constants.colors.lightColor};
  font-size: 0.78rem;
  line-height: 1.3;
`;
