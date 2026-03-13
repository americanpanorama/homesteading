import { createGlobalStyle } from 'styled-components';
import { barCategoryColors } from '../../../../Constants';

const BarSetStyles = createGlobalStyle`
  .bar {
    fill-opacity: 0.45;
  }

  .bar .selected {
    fill-opacity: 1;
  }

  .barLegend {
    margin: 10px auto;
    display: inline-block;
  }

  .barLegend .box {
    width: 10px;
    height: 20px;
    transform: translateY(4px);
    margin-right: 7px;
    display: inline-block;
  }

  .barLegend div {
    text-align: left;
  }

  .bar .federal_lands {
    fill: ${barCategoryColors.federalLands};
  }

  .barLegend .box.federal_lands {
    background-color: ${barCategoryColors.federalLands};
  }

  .bar .indian_lands {
    fill: ${barCategoryColors.indianLands};
  }

  .barLegend .box.indian_lands {
    background-color: ${barCategoryColors.indianLands};
  }

  .bar .commutations_2301 {
    fill: ${barCategoryColors.commutations2301};
  }

  .barLegend .box.commutations_2301 {
    background-color: ${barCategoryColors.commutations2301};
  }

  .bar .commutations_18800615 {
    fill: ${barCategoryColors.commutations18800615};
  }

  .barLegend .box.commutations_18800615 {
    background-color: ${barCategoryColors.commutations18800615};
  }

  .bar .commutations_indian_lands {
    fill: ${barCategoryColors.commutationsIndianLands};
  }

  .barLegend .box.commutations_indian_lands {
    background-color: ${barCategoryColors.commutationsIndianLands};
  }
`;

export default BarSetStyles;
