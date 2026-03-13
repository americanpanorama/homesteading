import styled from "styled-components";

import * as Constants from '../../../Constants';



export const RowsContainer = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 0 8px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--highlight-color);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px var(--inset-header-bg-color);
    border-radius: 8px;
  }
`;

export const HitArea = styled.rect<{ $active?: boolean }>`
  fill: transparent;
  stroke: ${({ $active }) => $active ? Constants.colors.accentColor : 'transparent'};
  stroke-width: 2px;
`;

export const YearHighlight = styled.line`
  stroke: ${Constants.colors.accentColor};
  stroke-width: 4px;
  stroke-opacity: 0.4;
`;

