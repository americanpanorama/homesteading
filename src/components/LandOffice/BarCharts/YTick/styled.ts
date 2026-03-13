import { createGlobalStyle } from 'styled-components';

const YTickStyles = createGlobalStyle`
  .tick line {
    stroke: var(--highlight-color);
    stroke-width: 1px;
    stroke-dasharray: 1px 5px;
  }

  .tick.y text {
    text-anchor: end;
  }
`;

export default YTickStyles;
