import styled, { css } from 'styled-components';
import { MapSize } from '../../index.d';
import * as Constants from '../../Constants';

export const VectorMap = styled.div<{ $mapSize: MapSize; $height: number }>`
  background-color: #eeeeee;
  position: relative;
  width: calc(100vw - 4px);
  height: ${({ $height }) => `${$height}px`};
  overflow: hidden;
  margin: 0;
  z-index: 1000;
  border: 1px solid #aaa;

  @media ${Constants.devices.wideLayout} {
    grid-area: map;
    width: calc(100% - 50px - 2px); /* the 2px is for the border */
    height: calc(100vh - 75px - 150px - 25px - 2px); /* the 2px is for the border */
    margin: 0 0px 25px 25px;
    transition: width 220ms ease, margin 220ms ease, border-radius 220ms ease;

    ${({ $mapSize }) => $mapSize === 'nolegend' && css`
      height: calc(100vh - 75px - 150px - 25px);
    `}

    ${({ $mapSize }) => $mapSize === 'fullscreen' && css`
      grid-column: 1 / -1;
      grid-row: 3;
      width: calc(100vw - 50px) !important;
      height: calc(100vh - 75px - 150px - 25px);
      z-index: 1;
      margin: 0 25px 25px 25px;
    `}
  }
`;

export const FullscreenToggleContainer = styled.div`
 display: none;
 pointer-events: none;

  @media ${Constants.devices.wideLayout} {
    z-index: 10000;
    background: transparent;
    border: none;
        border-right: 5px solid ${Constants.colors.accentColor};
        margin: 0 0px 25px 25px;


    grid-area: map;
    display: flex;
    width: calc(100% - 50px); // the 5px is for the border
    height: calc(100vh - 75px - 150px - 25px);
    margin: 0 0px 25px 25px;
    align-items: center;
    justify-content: end;
    z-index: 5000;
  }
`

export const FullscreenToggle = styled.button<{ $mapSize: MapSize }>`
  @media ${Constants.devices.wideLayout} {
    pointer-events: all;
    cursor: pointer;

    transform: translate(30px, -50%);
    background: transparent;
    border: none;
    svg {
      height: 40px;
      width: 40px;
      path {
        stroke: white;
        fill: none;
      }
      circle {
        fill: ${Constants.colors.accentColor};
      }
    }
  }
`;

export const AlaskaInset = styled.path`
  pointer-events: none;
`;
