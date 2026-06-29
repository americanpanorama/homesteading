import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const LongformContainer = styled.div`
  padding: 10px calc(50vw - 500px);
  max-width: 95vw;
  overflow-y: scroll;
  overflow-x: visible;
  text-align: left;
  font-size: 1em;
  line-height: 1.8;
  font-family: ${Constants.fonts.sansSerif};
  color: ${Constants.colors.lightColor};
  margin: 0 auto;

  h3 {
    text-align: center;
    color: ${Constants.colors.olive};
    font-family: ${Constants.fonts.serif};
    font-size: 2em;
  }

  a {
    color: ${Constants.colors.accentColor};
  }
   
  li {
    margin-bottom: 0.5em;
    line-height: 1.6;
  }

  figcaption {
    padding-bottom: 1rem;
  }

  @media ${Constants.devices.desktop} {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
    height: calc(100vh - 75px);
    justify-self: center;
    font-size: 1.2em;
    max-width: 1300px;

    p, ul, figcaption {
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;





