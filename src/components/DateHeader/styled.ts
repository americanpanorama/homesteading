import styled from "styled-components";
import * as Constants from "../../Constants";

export const Container = styled.div<{ $isExpanded: boolean }>`
  grid-area: yearHeader;
  box-sizing: border-box;

  display: grid;
  position: relative;
  width: 100%;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "headerLabel headerLabel headerLabel" "previous year next";
  padding: 6px 12px 14px;
  min-height: 92px;

  @media ${Constants.devices.tabletLandscape} {
    grid-template-rows: auto 1fr 1fr;
    grid-template-areas: "headerLabel headerLabel headerLabel" "previous year next" ". fiscalYear .";
    padding: 0;
    min-height: auto;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 20px;
      width: 100%;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.4) 15%, rgba(0, 0, 0, 0.4) 85%, transparent);
    }
  }

  @media ${Constants.devices.desktop} {
    ${({ $isExpanded }) =>
      $isExpanded &&
      `
      padding: 0 25px;
    `}
  }
`;

export const Previous = styled.div`
  grid-area: previous;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2em;

  svg {
    width: 30px;
    height: 30px;
    padding: 3px;
    border: 1px solid ${Constants.colors.accentColor};
    border-radius: 50%;
    transition: background-color 0.25s ease;

    circle {
      fill: transparent;
    }

    path {
      stroke: ${Constants.colors.accentColor};
      stroke-width: 2px;
      fill: none;
    }
  }

  @media ${Constants.devices.tabletLandscape} {
    justify-content: flex-end;
    padding-left: 0;
  }
`;

export const Year = styled.h1`
  grid-area: year;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  color: ${Constants.colors.accentColor};
  font-family: ${Constants.fonts.serif};
  font-size: clamp(2.2rem, 8vw, 4rem);
  text-align: center;
`;

export const Next = styled(Previous)`
  grid-area: next;
  justify-content: flex-end;
  align-items: center;
  padding-right: 2em;

  @media ${Constants.devices.tabletLandscape} {
    justify-content: flex-start;
    padding-right: 0;
  }
`;

export const FiscalYear = styled.h2`
  grid-area: fiscalYear;
  display: none;
  text-align: center;
  font-size: clamp(0.8rem, 3vw, 1rem);
  font-family: "Roboto Condensed", sans-serif;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  @media ${Constants.devices.tabletLandscape} {
    display: block;
  }
`;

export const Header = styled.div`
  grid-area: headerLabel;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.35));
  }

  &::after {
    transform: scaleX(-1);
  }
`;
