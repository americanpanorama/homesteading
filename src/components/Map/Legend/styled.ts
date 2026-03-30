import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../../Constants';
import { hextoRgba } from '../../../utilities';

const { colors, fonts, devices } = Constants;

export const controlBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
  padding: 2px;
  border: 1px solid #bfc1c2;
  background-color: rgba(255, 255, 255, 0.9);
  color: ${colors.lightColor};
  font-family: ${fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;

  &:focus-visible {
    outline: 3px solid ${colors.focusRingColor};
    outline-offset: 2px;
  }
`;

export const selectedControl = css`
  background-color: ${colors.accentColor};
  border-color: ${colors.accentColor};
  color: ${colors.whiteColor};
`;

export const Container = styled.section<{ $collapsed: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 20;
  display: grid;
  align-items: start;
  gap: 1em;
  pointer-events: none;

  @media ${devices.desktop} {
    top: 18px;
    left: 24px;
    right: 24px;
  }
`;

export const ColumnTitle = styled.h3`
  margin: 0;
  color: ${colors.lightColor};
  font-family: ${fonts.sansSerif};
  font-size: 1rem;
  font-weight: 700 !important;
  text-align: left;
`;



export const HeaderBar = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
    border: 0;
    border-radius: 0;
    background: transparent;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);

  @media ${devices.desktop} {
    padding: 0 4px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }
`;

export const Divider = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(33, 29, 22, 0.26);
`;

export const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 0 12px;
  background: transparent;
  cursor: pointer;
  color: ${colors.lightColor};
  font-family: ${fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  // add a halo for better visibility on the map

`;

export const Chevron = styled.span<{ $collapsed: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $collapsed }) => ($collapsed ? 'rotate(45deg) translateY(-1px)' : 'rotate(225deg) translateY(-1px)')};
`;

export const GuideLink = styled(Link)`
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${colors.lightColor};
  text-decoration: none;
  font-family: ${fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;

  &:focus-visible {
    outline: 3px solid ${colors.focusRingColor};
    outline-offset: 2px;
  }
`;

export const GuideIcon = styled.span`
  font-size: 1rem;
  line-height: 1;
`;

export const Panel = styled.div<{ $collapsed: boolean }>`
  pointer-events: auto;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'grid')};
  width: 100%;
  max-width: 100%;
  max-height: min(72vh, calc(100vh - 140px));
  margin-top: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  grid-template-columns: 1fr;
  justify-content: stretch;
  background: rgba(255, 255, 250, 0.97);
  border: 1px solid #bfc1c2;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);

  /* section:not(:last-child) {
    border-bottom: 1px solid #bfc1c2;
  } */

  @media ${devices.tabletPortrait} {
    grid-template-columns: minmax(200px, 0.9fr) minmax(260px, 1.1fr);
    grid-template-areas:
      'indian conflicts'
      'districts activity';
    grid-template-rows: max-content max-content;
    grid-auto-rows: max-content;
    align-items: start;
    max-height: min(68vh, calc(100vh - 220px));

    section {
      border-right: 0;
      border-bottom: 0;
    }

    section:nth-child(1),
    section:nth-child(3) {
      border-right: 1px solid #bfc1c2;
    }

    section:nth-child(3),
    section:nth-child(4) {
      border-top: 1px solid #bfc1c2;
    }
  }

  @media ${devices.tabletLandscape} {
    grid-template-columns: minmax(160px, 0.95fr) minmax(220px, 1.05fr);
    justify-content: center;
    max-height: none;
    margin-top: 0;
    overflow: hidden;
    background: rgba(247, 245, 241, 0.96);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    max-width: 1200px;

    section:not(:last-child) {
      border-bottom: 0;
      border-right: 1px solid #bfc1c2;
    }
  }

  @media ${devices.desktop} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
    justify-content: center;
    align-items: stretch;
    width: auto; 
    border: 1px solid #bfc1c2;

    section {
      border: 0 !important;
      height: 100%;
      align-self: stretch;
    }

    section:not(:last-child) {
      border-right: 1px solid #bfc1c2 !important;
    }
    
    
  }
`;

export const IndianLands = styled.section`
  grid-area: indian;
  align-self: start;
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-areas: 'indianLandsLabel' 'reservations' 'unceded';
  row-gap: 0.5em;
  padding: 0.5em;

  @media ${devices.tabletPortrait} {
    align-content: start;
  }
`;

export const IndianLandsLabel = styled(ColumnTitle)`
  grid-area: indianLandsLabel;
`;

export const Reservations = styled.div`
  grid-area: reservations;
  text-align: left;
`;

export const Unceded = styled.div`
  grid-area: unceded;
  text-align: left;
`;

export const Conflicts = styled.section`
  grid-area: conflicts;
  align-self: start;
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: auto auto auto;
  grid-template-areas: 'conflictsTooltip conflictLabel' '. conflictsExplanation' '. conflictsSymbols';
  column-gap: 0.5em;
  row-gap: 0.25em;
  padding: 0.5em;
`;

export const ConflictsTooltip = styled.div`
  grid-area: conflictsTooltip;
  justify-content: start;
  align-content: center;
`;

export const ConflictsLabel = styled(ColumnTitle)`
  grid-area: conflictLabel;
`;

export const ConflictsExplanation = styled.div`
  grid-area: conflictsExplanation;
  justify-self: start;
  align-self: start;
  font-size: 0.85em;
`;

export const ConflictsSymbols = styled.div`
  grid-area: conflictsSymbols;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

export const Districts = styled(IndianLands)`
  grid-area: districts;
  grid-template-rows: auto auto;
  grid-template-areas: 'districtLabel' 'districtSymbols';

  @media ${devices.tabletPortrait} {
    justify-items: start;
    text-align: left;
  }
`;

export const DistrictLabel = styled(IndianLandsLabel)`
  grid-area: districtLabel;
`;

export const DistrictSymbols = styled.div`
  grid-area: districtSymbols;
  text-align: left;

  @media ${devices.tabletPortrait} {
    width: 100%;
    text-align: left;
  }
`;

export const Activity = styled(Conflicts)`
  grid-area: activity;
  grid-template-rows: auto auto;
  grid-template-areas: 'activityTooltip activityLabel' '. activitySymbols';
`;

export const ActivityTooltip = styled.div`
  grid-area: activityTooltip;
  justify-content: start;
  align-content: center;
`;

export const ActivityLabel = styled(IndianLandsLabel)`
  grid-area: activityLabel;
`;

export const ActivitySymbols = styled.div`
  grid-area: activitySymbols;
  text-align: left;

  @media ${devices.tabletPortrait} {
    width: 100%;
    max-width: 280px;
  }
`;

export const Column = styled.section`
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 0.5em;
  border-bottom: 1px solid #bfc1c2;

  &:last-child {
    border-bottom: 0;
  }

  @media ${devices.tabletLandscape} {
    border-right: 1px solid #bfc1c2;
    border-bottom: 0;

    &:last-child {
      border-right: 0;
    }

    &:nth-child(2) {
      border-right: 0;
    }
  }

  @media ${devices.desktop} {
    &:nth-child(2) {
      border-right: 1px solid #bfc1c2;
    }
  }
`;

export const ColumnWithTooltip = styled(Column)`
  display: flex;
`;

export const ActivityColumn = styled(Column)`
  @media ${devices.tabletLandscape} {
    grid-column: 1 / -1;
    border-top: 1px solid #bfc1c2;
    border-right: 0;
  }

  @media ${devices.desktop} {
    grid-column: auto;
    border-top: 0;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const TooltipMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 0.7rem;
  line-height: 1;
`;

export const ColumnText = styled.p`
  margin: 0;
  color: ${colors.lightColor};
  font-size: 0.85rem;
  line-height: 1.25rem;
`;

export const IndianRow = styled.div`
  display: grid;
  gap: 8px;
`;

export const IndianLegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${colors.lightColor};
  font-size: 0.9rem;
  font-weight: 700;
`;

export const ReservationSwatch = styled.span`
  display: inline-block;
  width: 16px;
  height: 10px;
  border: 2px solid #67e5c5;
  background-color: rgba(103, 229, 197, 0.5);
  margin-right: 1em;
`;

export const UncededSwatch = styled(ReservationSwatch)`
  background: repeating-linear-gradient(
    -45deg,
    rgba(103, 229, 197, 0.5),
    rgba(103, 229, 197, 0.5) 4px,
    transparent 4px,
    transparent 8px
  );
`;

export const ClashLegend = styled.div`
  display: grid;
  gap: 4px;
`;

export const ClashText = styled.div`
  color: ${colors.lightColor};
  font-size: 0.85rem;
  font-weight: 700;
`;

export const ClashRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
`;

export const ClashItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${colors.lightColor};
  font-weight: 700;
`;

export const ClashCross = styled.span<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: 0 0 auto;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background: #e12727;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

export const ActivityLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  gap: 12px 18px;
  align-items: start;

  @media ${devices.desktop} {
    grid-template-columns: auto auto;
  }
`;

export const ToggleGroup = styled.nav`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  border: 1px solid #bfc1c2;
  background: rgba(255, 255, 255, 0.88);
`;

export const ToggleLink = styled(Link)<{ $selected?: boolean }>`
  ${controlBase}
  flex: 1 1 0;
  border: 0;
  border-right: 1px solid #bfc1c2;
  min-width: 0;
  padding: 0 1em;

  &:last-child {
    border-right: 0;
  }

  ${({ $selected }) => $selected && selectedControl}
`;

export const GradientBlock = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const GradientLabel = styled.div`
  color: ${colors.lightColor};
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const GradientBar = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
  height: 22px;
  min-width: 0;
`;

export const GradientStep = styled.div<{ $color: string }>`
  background-color: ${({ $color }) => $color};
`;

export const GradientScale = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
  color: ${colors.lightColor};
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
`;
