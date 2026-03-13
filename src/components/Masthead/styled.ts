import styled from 'styled-components';
import * as Constants from '../../Constants';

export const Container = styled.header`
  grid-area: masthead;
  font-family: "Unica One", serif;
  line-height: 1;

  a {
    text-decoration: none;
    color: inherit;
  }

  h1 {
    font-weight: 700;
    font-size: 4vw;
    margin: 20px 0 5px 0;
    text-align: left;
    padding-left: 1em;
    display: flex;
    align-items: center;
    gap: 0.25ch;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #666;
    color: ${Constants.heatmapGradientColors[3]}
    
  }

  @media ${Constants.devices.mobile} {
    h1 {
      font-size: 20px;
    }
  }

  @media ${Constants.devices.desktop} {
    h1 {
      font-size: 26px;
      margin: 0 0 5px 0;
      padding: 5px 0 5px 1em;
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
  font-weight: 100;
  font-size: 0.6em;
  color: ${Constants.heatmapGradientColors[5]};
  text-transform: uppercase;
  font-family: "Zen Dots", sans-serif;
  `;

export const Dispossession = styled.span`
  font-weight: 700;
`;
