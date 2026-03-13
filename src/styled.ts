import styled, { createGlobalStyle } from 'styled-components';
import * as Constants from './Constants';

export const BaseStyles = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${Constants.colors.mainBGcolor};
  }

  svg a:focus,
  svg a:focus-visible {
    outline: none;
  }

  svg a:focus-visible path,
  svg a:focus-visible rect,
  svg a:focus-visible text {
    stroke: ${Constants.colors.focusRingColor};
    stroke-opacity: 1;
  }
`;

export const AppContainer = styled.main<{ $isMapFullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: ${Constants.colors.insetBGcolor};
  color: ${Constants.colors.lightColor};
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 300;
  width: 100vw;
  min-height: 100vh;
  --inset-bg-color: ${Constants.colors.insetBGcolor};
  --main-bg-color: ${Constants.colors.mainBGcolor};
  --inset-header-bg-color: ${Constants.colors.insetHeaderBGcolor};
  --light-color: ${Constants.colors.lightColor};
  --highlight-color: ${Constants.colors.highlightColor};
  --map-bg-color: ${Constants.colors.mapBGcolor};
  --white-color: ${Constants.colors.whiteColor};
  --black-color: ${Constants.colors.blackColor};
  --focus-ring-color: ${Constants.colors.focusRingColor};
  --muted-text-color: ${Constants.colors.mutedTextColor};
  --soft-text-color: ${Constants.colors.softTextColor};
  --disabled-text-color: ${Constants.colors.disabledTextColor};
  --district-stroke-color: ${Constants.colors.districtStrokeColor};

  * {
    font-weight: 300;
  }

  header {
    order: -9;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 3px solid ${Constants.colors.focusRingColor};
    outline-offset: 2px;
  }

  @media ${Constants.devices.desktop} {
    display: grid;
    grid-template-columns: ${({ $isMapFullscreen }) => ($isMapFullscreen ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr) max(40%, 600px)')};
    grid-template-rows: 75px 150px auto;
    grid-template-areas: ${({ $isMapFullscreen }) => ($isMapFullscreen
    ? `"masthead appNav"
       "yearHeader yearHeader"
       "map map"`
    : `"masthead appNav"
       "yearHeader sidebar"
       "map sidebar"`)};
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    transition: grid-template-columns 220ms ease;
  }
`;

export const SkipLink = styled.a`
  position: absolute;
  left: 8px;
  top: -40px;
  z-index: 20000;
  background: ${Constants.colors.whiteColor};
  color: ${Constants.colors.blackColor};
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;

  &:focus {
    top: 8px;
  }
`;

export const Sidebar = styled.aside<{ $isCollapsed?: boolean }>`
  @media ${Constants.devices.desktop} {
    grid-area: sidebar;
    grid-row: 2 / span 2;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-top: 0;
    display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
  }

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    padding-top: 20px;
  }
`;
