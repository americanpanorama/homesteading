import styled from "styled-components";
import * as Constants from "../../../../Constants";
import { hexToRgb } from '../../../../utilities';
import { hextoRgba } from '../../../../utilities';

export const Container = styled.div`
  display: flex;
  gap: 0;
  max-width: min(95%, 900px);
  margin: 0 auto;
  pointer-events: auto;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1.1rem;

`;

export const Nav = styled.nav`

  display: none;
  
  @media ${Constants.devices.tabletPortrait},
  ${Constants.devices.tabletLandscape}, ${Constants.devices.desktop} {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: black;
    padding: 1em;
    color: white;
    text-align: right;
  }
`;

export const Content = styled.div<{ $mapHeight: number }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  max-height: ${p => `${p.$mapHeight - 100}px`};
  overflow-y: auto;
`;

export const SectionContainer = styled.div<{ $active: boolean }>`
  background-color: ${(p) => (p.$active ? 'white' : '#f1f1f1')};
  padding: 0 1.5em;
`;

export const TipsSection = styled.div`
  padding-bottom: 1em;
  border-bottom: 1px solid rgba(${hexToRgb(Constants.colors.blackColor)}, 0.25);

  @media ${Constants.devices.mobile} {
    display: grid;
    grid-template-columns: 100px auto;
    grid-column-gap: 10px;
    align-items: center;
    grid-template-columns: 110px auto;
  }

  @media ${Constants.devices.desktop} {
    grid-template-columns: 110px auto;
  }

  h3 {
    grid-column: 1 / span 2;
    text-align: left;
    font-weight: 400;
  }
`;

export const TopNote = styled.div`
  grid-column: 1 / span 2;
  font-weight: 300;
`; 

export const SVGContainer = styled.div<{ width?: number }>`
  ${p => (p.width) && (`
    svg {
      width: ${p.width}px;
    }
  `)}
`;


export const Explanation = styled.div<{ vPadding?: number }>`
  grid-column: 2 / span 1;
  font-size: 0.9em;
  font-weight: 300;
  line-height: 1.1;
  text-align: left;
  padding: 0.5em 0;
  // padding-top: ${p => (typeof p.vPadding === 'number') ? p.vPadding : 20}px;
  // padding-bottom: ${p => (typeof p.vPadding === 'number') ? p.vPadding : 20}px;
`;

export const Symbol = styled.div<{ $imgWidth?: number | string }>`
  grid-column: 1 / span 1;
  display: flex;
  align-items: center;
  grid-gap: 2px;
  padding-top: 0.5em;

  @media ${Constants.devices.mobile} {
    justify-content: flex-end;
    padding-top: 0;
  }

  button {
    margin: 0;
  }

  figure {
    text-align: center;

    figcaption {
      font-size: 0.75em;
    }
  }

  img {
    width: ${p => p.$imgWidth || 50}px;
  }
`;

export const Term = styled.div`
  grid-column: 1 / span 1;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: ${Constants.colors.accentColor};
  font-weight: 700;
  align-self: start;
  padding-top: 0.5em;
  font-size: 0.9em;

  @media ${Constants.devices.mobile} {
    justify-content: flex-end;
  }
`;

export const Tip = styled.div`
  grid-column: 1 / span 2;
  position: relative;
  margin-bottom: 1rem;
  padding: 1em;
  font-weight: 300;
  font-size: 0.9em;
  font-style: italic;
  background-color: rgba(${hexToRgb(Constants.colors.blackColor)}, 0.05);
  text-align: left;

  img {
    position: absolute;
    top: 1.1em;
    left: -0.5em;
    height: 1em;
  }
`;

export const CloseMenu = styled.li`
  display: flex;
  justify-content: center;
  padding: 20px;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;

  svg {
    height: 20px;

    line {
      stroke: white !important;
    }
  }
`;

export const MenuItem = styled.li<{ $active: boolean }>`
  padding: 20px;
  color: ${(p => (p.$active) ? Constants.colors.accentColor : Constants.colors.whiteColor)};
  background-color: ${(p => (p.$active) ? Constants.colors.whiteColor : Constants.colors.accentColor)};
  cursor: pointer;
    
  &:hover,
  &:focus,
  &:active {
    background-color: ${(p => (p.$active) ? Constants.colors.whiteColor : hextoRgba(Constants.colors.whiteColor, 0.2))};
  }
`; 

export const Menu = styled.ul`
  z-index: 2600;
  background-color: ${Constants.colors.accentColor};
  list-style: none;
  text-align: right;
  padding: 0;
  display: none;

  @media ${Constants.devices.tabletPortrait},
  ${Constants.devices.tabletLandscape},
  ${Constants.devices.desktop} {
    margin: 0;
    display: block;
    height: min-content;
    color: white;
  }
`;