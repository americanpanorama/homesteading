import styled from 'styled-components';
import * as Constants from '../../Constants';

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  font-weight: 300;
  background-color: var(--inset-bg-color);
  margin: 20px 0;
  padding-bottom: 12px;
  overflow-x: hidden;
`;

export const ScrollPanel = styled.div<{ $height: number }>`
  width: 100%;
  min-width: 0;
  height: ${({ $height }) => $height}px;

  @media ${Constants.devices.tabletLandscape} {
    height: auto;
  }
`;
