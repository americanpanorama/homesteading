import styled, { createGlobalStyle } from 'styled-components';
import { barCategoryColors, colors } from '../../../../Constants';

const BarSetStyles = createGlobalStyle`
  .bar {
    fill-opacity: 0.45;
  }

  .bar .selected {
    fill-opacity: 1;
  }

  .bar .federal_lands {
    fill: ${barCategoryColors.federalLands};
  }

  .bar .indian_lands {
    fill: ${barCategoryColors.indianLands};
  }

  .bar .commutations_2301 {
    fill: ${barCategoryColors.commutations2301};
  }

  .bar .commutations_18800615 {
    fill: ${barCategoryColors.commutations18800615};
  }

  .bar .commutations_indian_lands {
    fill: ${barCategoryColors.commutationsIndianLands};
  }
`;

export default BarSetStyles;

export const LabelText = styled.text<{ $visible: boolean }>`
  fill: ${colors.blackColor};
  stroke: ${colors.mainBGcolor};
  stroke-width: 4px;
  paint-order: stroke;  /* ensures stroke renders behind fill */
  pointer-events: none;
  text-anchor: middle;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;
