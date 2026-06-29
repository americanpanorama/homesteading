import styled from 'styled-components';
import * as Constants from '../../../Constants';

const { colors, fonts, devices } = Constants;

export const Container = styled.section<{ $collapsed: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  max-height: calc(100% - 24px);
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

export const Panel = styled.div<{ $collapsed: boolean }>`
  pointer-events: auto;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
  width: 100%;
  max-width: 100%;
  max-height: min(72vh, calc(100vh - 140px));
  margin-top: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  justify-content: stretch;
  text-align:left;
  background: ${colors.legendPanelBackgroundColor};
  border: 1px solid ${colors.legendBorderColor};
  box-shadow: 0 12px 32px ${colors.legendPanelShadowColor};
  overflow: visible; /* allow tooltips to overflow the container */

  /* for each of the children, set a bit of padding */
  > * {
    padding: 0.5em;
  }

  section:nth-child(1),
  section:nth-child(3) {
    padding-left: 33px;
  }

  @media ${devices.mobile} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'grid')};
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
      padding-left: 0.5em;
      border-right: 1px solid ${colors.legendBorderColor};
    }

    section:nth-child(3),
    section:nth-child(4) {
      border-top: 1px solid ${colors.legendBorderColor};
    }
  }

  @media ${devices.tabletLandscape} {
    grid-template-columns: minmax(160px, 0.95fr) minmax(220px, 1.05fr);
    justify-content: center;
    max-height: none;
    margin: 0 auto;
    background: ${colors.legendPanelLandscapeBackgroundColor};
    box-shadow: 0 4px 10px ${colors.legendPanelLandscapeShadowColor};
    max-width: 1000px;

    section:not(:last-child) {
      border-bottom: 0;
      border-right: 1px solid ${colors.legendBorderColor};
    }
  }

  @media ${devices.desktop} {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
    justify-content: center;
    width: auto; 
    border: 1px solid ${colors.legendBorderColor};
    align-self: stretch;

    section {
      border: 0 !important;
      height: auto;
      align-self: stretch;
      align-content: start;
    }

    section:not(:last-child) {
      border-right: 1px solid ${colors.legendBorderColor} !important;
    }
  }
`;


/* styles used by subcomponents */
export const ColumnTitle = styled.h3`
  margin: 0;
  color: ${colors.lightColor};
  font-family: ${fonts.sansSerif};
  font-size: 1rem;
  font-weight: 500 !important;
  text-align: left;
`;


