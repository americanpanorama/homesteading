import styled from 'styled-components';
import { barCategoryColors } from '../../../../Constants';

const legendColors = {
  federal_lands: barCategoryColors.federalLands,
  indian_lands: barCategoryColors.indianLands,
  commutations_2301: barCategoryColors.commutations2301,
  commutations_18800615: barCategoryColors.commutations18800615,
  commutations_indian_lands: barCategoryColors.commutationsIndianLands,
} as const;

export type LegendVariant = keyof typeof legendColors;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
  line-height: 1.35;
  text-align: left;
  color: var(--light-color);
`;

export const Swatch = styled.span<{ $variant: LegendVariant }>`
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background-color: ${({ $variant }) => legendColors[$variant]};
`;
