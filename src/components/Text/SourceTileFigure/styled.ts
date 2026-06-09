import styled, { css } from 'styled-components';
import * as Constants from '../../../Constants';
import { hextoRgba } from '../../../utilities';

export const Figure = styled.figure<{ $expanded?: boolean }>`
  margin: 2.2rem auto;
  width: 100%;
  max-width: ${({ $expanded }) => ($expanded ? 'none' : '980px')};
  color: ${Constants.colors.lightColor};
  overflow: visible;
`;

export const Shell = styled.div<{ $expanded?: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  overflow: visible;
  min-height: ${({ $expanded }) => ($expanded ? 'min(86vh, 820px)' : '420px')};
  border: 1px solid #aaa;
  background-color: #ece9e2;
  box-shadow: ${({ $expanded }) => ($expanded ? '0 22px 70px rgba(0, 0, 0, 0.32)' : 'none')};

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    min-height: ${({ $expanded }) => ($expanded ? '82vh' : '360px')};
  }
`;

export const MapViewport = styled.div`
  position: relative;
  min-height: 0;
  background-color: #e9e6df;
`;

export const ExpandRail = styled.div<{ $expanded?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 5px;
  border-right: 5px solid ${Constants.colors.accentColor};
  pointer-events: none;
`;

export const ExpandToggle = styled.button`
  pointer-events: all;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform: translateX(22px);

  svg {
    width: 40px;
    height: 40px;

    circle {
      fill: ${Constants.colors.accentColor};
    }

    path {
      stroke: ${Constants.colors.whiteColor};
      stroke-width: 2px;
      fill: none;
    }
  }
`;

export const ZoomControls = styled.div`
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 4;
  display: flex;
  gap: 7px;
  align-items: center;
`;

export const ZoomButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid ${Constants.colors.accentColor};
  border-radius: 50%;
  background-color: ${hextoRgba(Constants.colors.mainBGcolor, 0.88)};
  color: ${Constants.colors.accentColor};
  cursor: pointer;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Constants.colors.accentColor};
    color: ${Constants.colors.whiteColor};
  }
`;

export const ZoomSymbol = styled.span`
  display: block;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1.45rem;
  font-weight: 400 !important;
  line-height: 0.9;
  transform: translateY(-1px);
`;

export const ZoomIcon = styled.svg`
  width: 20px;
  height: 20px;

  line {
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export const ResetIcon = styled.svg`
  width: 20px;
  height: 20px;

  path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export const MapSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

export const SourceTile = styled.image`
  image-rendering: auto;
  transition: opacity 180ms ease;
`;

export const NorthAmericaPath = styled.path`
  fill: ${Constants.colors.northAmericaBackgroundColor};
  stroke: #d9d4ca;
  stroke-width: 2.6;
`;

export const StatePath = styled.path`
  fill: rgba(255, 255, 255, 0.05);
  stroke: #ccc;
  stroke-width: 0.75;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

export const DistrictPath = styled.path`
  fill: rgba(255, 255, 255, 0.08);
  stroke: rgba(138, 67, 83, 0.74);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

export const BorderPath = styled.path`
  fill: transparent;
  stroke: rgba(138, 67, 83, 0.1);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

export const TimelineControl = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 20px 20px 22px;
  background-color: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(33, 29, 22, 0.12);

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    gap: 10px;
    padding: 20px 12px 22px;
  }
`;

export const Slider = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

export const StepButton = styled.button`
  width: 34px;
  height: 34px;
  padding: 2px;
  border: 1px solid ${Constants.colors.accentColor};
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.25s ease;

  svg {
    width: 100%;
    height: 100%;

    circle {
      fill: transparent;
    }

    path {
      stroke: ${Constants.colors.accentColor};
      stroke-width: 2px;
      fill: none;
    }
  }

  &:hover,
  &:focus-visible {
    background-color: rgba(90, 69, 90, 0.08);
  }
`;

export const TimelineRail = styled.div`
  position: relative;
  height: 76px;
  min-width: 0;
`;

export const Ticks = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 31px;
  height: 34px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background-color: rgba(33, 29, 22, 0.32);
  }
`;

export const Tick = styled.div<{ $left: number; $decade: boolean }>`
  position: absolute;
  left: ${({ $left }) => `${$left}%`};
  top: 0;
  width: 1px;
  height: ${({ $decade }) => ($decade ? '17px' : '9px')};
  background-color: ${({ $decade }) => ($decade ? 'rgba(33, 29, 22, 0.5)' : 'rgba(33, 29, 22, 0.28)')};
  transform: translateX(-50%);
`;

export const TickLabel = styled.span`
  position: absolute;
  top: 22px;
  left: 50%;
  color: silver;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.82rem;
  line-height: 1;
  text-align: center;
  transform: translateX(-50%);
`;

export const SelectedYearMarker = styled.div<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => `${$left}%`};
  top: 31px;
  width: 13px;
  height: 13px;
  border: 2px solid ${Constants.colors.accentColor};
  border-radius: 50%;
  background-color: #aaa;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export const SelectedYearLabel = styled.div<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => `${$left}%`};
  top: 0;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1rem;
  font-weight: 700 !important;
  line-height: 1;
  transform: translateX(-50%);
  pointer-events: none;
`;

export const Figcaption = styled.figcaption`
  margin-top: 0.75rem;
  color: ${Constants.colors.olive};
  font-size: 1rem;
  line-height: 1.45;
  width: 90%;
  margin: 1em 5%;
  font-style: italic;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: rgba(33, 29, 22, 0.72);

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    padding: 10px;
  }
`;

export const ModalPanel = styled.div`
  width: min(1500px, 96vw);
  max-height: 94vh;
`;

export const LoadingMessage = styled.text`
  fill: ${Constants.colors.olive};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 16px;
  letter-spacing: 0.04em;
  text-anchor: middle;
`;

export const TileGroup = styled.g<{ $faded: boolean }>`
  ${({ $faded }) => $faded && css`
    opacity: 0.42;
  `}
`;
