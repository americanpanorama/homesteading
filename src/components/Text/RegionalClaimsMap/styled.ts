import styled from 'styled-components';
import * as Constants from '../../../Constants';
import { hextoRgba } from '../../../utilities';
export { PopupContainer, PopupData } from '../../Map/Clashes/styled';
export { Legend } from '../IndianCountryMap/styled';
export { NorthAmericaPath } from '../SourceTileFigure/styled';
import { ClashCross as _ClashCross, ClashItem } from '../../Map/Legend/Conflicts/styled';

export { ClashItem };
  
export const ClashCross = styled(_ClashCross)<{ $opacity?: number }>`
  opacity: ${({ $opacity }) => $opacity ?? 1};
`;

export const Figure = styled.figure`
  margin: 2.2rem auto;
  width: 100%;
  max-width: 980px;
  color: ${Constants.colors.lightColor};
  background-color: ${Constants.colors.northAmericaBackgroundColor};
  box-shadow: 0 4px 10px ${Constants.colors.legendPanelLandscapeShadowColor};
`;

export const Shell = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid #aaa;
  background-color: #ece9e2;
`;

export const MapSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  min-height: 360px;
  background-color: #e9e6df;

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    min-height: 300px;
  }
`;

export const MapLayer = styled.g`
`;


export const DistrictPath = styled.path.attrs<{
  $fill: string;
  $strokeWidth: number;
}>(({ $fill, $strokeWidth }) => ({
  style: {
    fill: $fill,
    strokeWidth: $strokeWidth,
  },
}))`
  stroke: ${Constants.colors.districtStrokeColor};
  fill-opacity: 0.82;
  stroke-opacity: 0.62;
  stroke-linejoin: round;
  pointer-events: none;
`;

export const StateBoundaryPath = styled.path`
  fill: transparent;
  stroke: rgba(33, 29, 22, 0.2);
  stroke-width: 0.75;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
  stroke-linejoin: round;
`;

export const StatePath = styled.path`
  fill: rgba(255, 255, 255, 0.04);
  stroke: rgba(33, 29, 22, 0.44);
  stroke-width: 1.35;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
  stroke-linejoin: round;
`;

export const ConflictMarker = styled.g<{ $currentYear: boolean }>`
  opacity: ${({ $currentYear }) => ($currentYear ? 1 : 0.58)};
  pointer-events: auto;

  /* first two lines are drop shadow */
  line:nth-of-type(-n + 2) {
    stroke: rgba(255, 255, 255, 0.7);
    stroke-linecap: round;
  }

  /* last two lines are the cross */
  line:nth-of-type(n + 3) {
    stroke: ${({ $currentYear }) =>
    $currentYear
      ? Constants.colors.legendConflictColor
      : hextoRgba(Constants.colors.legendConflictColor, 0.78)};
    stroke-linecap: round;
  }
`;

export const Controls = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 14px 18px 18px;
  background-color: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(33, 29, 22, 0.12);

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    gap: 12px;
    padding: 14px 12px 18px;
  }
`;

export const PlayButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid ${Constants.colors.accentColor};
  border-radius: 50%;
  background-color: transparent;
  color: ${Constants.colors.accentColor};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: ${hextoRgba(Constants.colors.accentColor, 0.1)};
  }
`;

export const PlayIcon = styled.svg.attrs({
  viewBox: '0 0 24 24',
})`
  width: 24px;
  height: 24px;

  path {
    fill: currentColor;
  }
`;

export const PauseIcon = styled.svg.attrs({
  viewBox: '0 0 24 24',
})`
  width: 24px;
  height: 24px;

  rect {
    fill: currentColor;
  }
`;

export const TimelineRail = styled.div`
  position: relative;
  height: 58px;
  min-width: 0;
`;

export const Ticks = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 28px;
  height: 26px;

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

export const TickButton = styled.button<{ $left: number; $labeled: boolean; $selected: boolean }>`
  position: absolute;
  left: ${({ $left }) => `${$left}%`};
  top: 0;
  width: 28px;
  height: 42px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transform: translateX(-50%);

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: ${({ $selected }) => ($selected ? '2px' : '1px')};
    height: ${({ $labeled }) => ($labeled ? '16px' : '9px')};
    background-color: ${({ $labeled, $selected }) => {
      if ($selected) {
        return Constants.colors.accentColor;
      }

      return $labeled ? 'rgba(33, 29, 22, 0.5)' : 'rgba(33, 29, 22, 0.28)';
    }};
    transform: translateX(-50%);
  }

  &:hover::before,
  &:focus-visible::before {
    background-color: ${Constants.colors.accentColor};
  }

  &:focus-visible {
    outline: 2px solid ${hextoRgba(Constants.colors.accentColor, 0.48)};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: default;
  }

  &:disabled:hover::before {
    background-color: ${({ $labeled, $selected }) => {
      if ($selected) {
        return Constants.colors.accentColor;
      }

      return $labeled ? 'rgba(33, 29, 22, 0.5)' : 'rgba(33, 29, 22, 0.28)';
    }};
  }
`;

export const TickLabel = styled.span`
  position: absolute;
  top: 20px;
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
  top: 28px;
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
  top: 3px;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1rem;
  font-weight: 700 !important;
  line-height: 1;
  transform: translateX(-50%);
  pointer-events: none;
`;

export const Figcaption = styled.figcaption`
  margin: 1em 5%;
  width: 90%;
  color: ${Constants.colors.olive};
  font-size: 1rem;
  font-style: italic;
  line-height: 1.45;
`;
