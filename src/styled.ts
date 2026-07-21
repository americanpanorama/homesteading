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

  .rc-tooltip {
    position: absolute;
    z-index: 20000;
    display: block;
    visibility: visible;
    max-width: min(280px, calc(100vw - 32px));
    color: ${Constants.colors.lightColor};
    font-family: ${Constants.fonts.sansSerif};
    font-size: 0.95rem;
    line-height: 1.35;
    opacity: 1;
    pointer-events: none;
  }

  .rc-tooltip-hidden {
    display: none;
  }

  .rc-tooltip-placement-top,
  .rc-tooltip-placement-topLeft,
  .rc-tooltip-placement-topRight {
    padding: 0 0 9px;
  }

  .rc-tooltip-placement-bottom,
  .rc-tooltip-placement-bottomLeft,
  .rc-tooltip-placement-bottomRight {
    padding: 9px 0 0;
  }

  .rc-tooltip-placement-left,
  .rc-tooltip-placement-leftTop,
  .rc-tooltip-placement-leftBottom {
    padding: 0 9px 0 0;
  }

  .rc-tooltip-placement-right,
  .rc-tooltip-placement-rightTop,
  .rc-tooltip-placement-rightBottom {
    padding: 0 0 0 9px;
  }

  .rc-tooltip-inner {
    width: max-content;
    max-width: min(260px, calc(100vw - 48px));
    padding: 10px 12px;
    text-align: left;
    background-color: ${Constants.colors.legendPanelBackgroundColor};
    border: 1px solid ${Constants.colors.legendBorderColor};
    border-radius: 4px;
    box-shadow: 0 8px 22px ${Constants.colors.legendPanelShadowColor};
  }

  .rc-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }

  .rc-tooltip-placement-top .rc-tooltip-arrow,
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-topRight .rc-tooltip-arrow {
    bottom: 4px;
    border-width: 6px 6px 0;
    border-top-color: ${Constants.colors.legendBorderColor};
  }

  .rc-tooltip-placement-bottom .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    top: 4px;
    border-width: 0 6px 6px;
    border-bottom-color: ${Constants.colors.legendBorderColor};
  }

  .rc-tooltip-placement-left .rc-tooltip-arrow,
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow,
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow {
    right: 4px;
    border-width: 6px 0 6px 6px;
    border-left-color: ${Constants.colors.legendBorderColor};
  }

  .rc-tooltip-placement-right .rc-tooltip-arrow,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    left: 4px;
    border-width: 6px 6px 6px 0;
    border-right-color: ${Constants.colors.legendBorderColor};
  }

  .rc-tooltip-placement-top .rc-tooltip-arrow,
  .rc-tooltip-placement-bottom .rc-tooltip-arrow {
    left: 50%;
    transform: translateX(-50%);
  }

  .rc-tooltip-placement-left .rc-tooltip-arrow,
  .rc-tooltip-placement-right .rc-tooltip-arrow {
    top: 50%;
    transform: translateY(-50%);
  }

  .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow {
    left: 18px;
  }

  .rc-tooltip-placement-topRight .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    right: 18px;
  }

  .rc-tooltip-placement-leftTop .rc-tooltip-arrow,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow {
    top: 18px;
  }

  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    bottom: 18px;
  }
`;

export const AppContainer = styled.div<{ $isMapFullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: ${Constants.colors.insetBGcolor};
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-weight: 300;
  width: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
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

  @media ${Constants.devices.wideLayout} {
    display: grid;
    grid-template-columns: ${({ $isMapFullscreen }) => ($isMapFullscreen ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr) minmax(360px, 40%)')};
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

export const SkipLinksContainer = styled.nav`
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 20000;
`;

export const SkipLink = styled.a`
  position: absolute;
  left: 0;
  top: 0;
  width: max-content;
  max-width: calc(100vw - 16px);
  background: ${Constants.colors.whiteColor};
  color: ${Constants.colors.blackColor};
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-200%);
  transition: transform 160ms ease;

  body.keyboard-navigation &:focus {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Sidebar = styled.aside<{ $isCollapsed?: boolean }>`
  min-width: 0;

  @media ${Constants.devices.wideLayout} {
    grid-area: sidebar;
    grid-row: 2 / span 2;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding-top: 0;
    display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
  }

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    padding-top: 20px;
  }
`;
