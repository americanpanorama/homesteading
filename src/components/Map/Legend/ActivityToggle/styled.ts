import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import * as Constants from '../../../../Constants';
import { IndianLandsLabel } from '../IndianLands/styled';
import { Container as Conflicts } from '../Conflicts/styled';

const { devices } = Constants;

export const controlBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
  padding: 2px;
  border: 1px solid ${Constants.colors.legendBorderColor};
  background-color: ${Constants.colors.legendControlBackgroundColor};
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;

  &:focus-visible {
    outline: 3px solid ${Constants.colors.focusRingColor};
    outline-offset: 2px;
  }
`;

export const selectedControl = css`
  background-color: ${Constants.colors.accentColor};
  border-color: ${Constants.colors.accentColor};
  color: ${Constants.colors.whiteColor};
`;

export const Container = styled(Conflicts)`
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
  display: grid;
  grid-template-columns: 1fr 1fr;

  /* @media ${devices.tabletPortrait} {
    width: 100%;
  } */
`;

export const ToggleLink = styled(Link) <{ $selected?: boolean }>`
  ${controlBase}
  border: 0;
  padding: 0 0.5em;
  outline: 1px solid ${Constants.colors.accentColor}; 

  &:last-child {
    border-right: 0;
  }

  ${({ $selected }) => $selected && selectedControl}
`;
