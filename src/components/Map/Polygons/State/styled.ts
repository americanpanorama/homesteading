import { createGlobalStyle } from 'styled-components';

const StateStyles = createGlobalStyle`
  .statePolygon.selected {
    pointer-events: none;
  }
`;

export default StateStyles;
