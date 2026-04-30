import styled from 'styled-components';
import * as Constants from '../../Constants';

export const Container = styled.header`
  grid-area: masthead;
  display: flex;
  align-items: center;
  min-height: 56px;
  font-family: "Unica One", serif;
  line-height: 1;

  a {
    display: block;
    width: fit-content;
    color: inherit;
    text-decoration: none;
  }

  h1 {
    display: flex;
    align-items: center;
    gap: 0.25ch;
    margin: 0 0 5px 0;
    padding-left: 1em;
    font-size: 5vw;
    font-weight: 700;
    text-align: left;
    color: ${Constants.heatmapGradientColors[3]};
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  @media ${Constants.devices.mobile} {
    h1 {
      font-size: 24px;
      margin: 0 0 4px 0;
    }
  }

  @media ${Constants.devices.desktop} {
    h1 {
      margin: 0 0 5px 0;
      padding: 5px 0 5px 1em;
      font-size: 26px;
    }
  }
`;

export const Land = styled.span`
  font-weight: 700;
  text-transform: uppercase;
  //font-size: 0.7em;
  /* align-self: flex-start; */
  //font-family: "Inter", sans-serif;
  //font-family: "Zen Dots", sans-serif;
  `;

export const Acquisition = styled.span`
  font-weight: 600;
  `;

export const And = styled.span`
  margin: 0 0.15em;  
  color: ${Constants.colors.fullStateDistrictFillColor};
  font-family: ${Constants.fonts.serif};
  font-size: 1.3em;
  font-weight: 100;
  opacity: 0.75;
  `;

export const Dispossession = styled.span`
  font-weight: 700;
`;
