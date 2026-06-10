import styled from "styled-components";
import * as Constants from '../../../../Constants';
import { ColumnTitle } from '../styled';

const { colors, devices } = Constants;

export const Container = styled.section`
  grid-area: indian;
  align-self: start;
  display: grid;
  grid-template-columns: 30px fit-content(10rem);
  row-gap: 0.5em;

  @media ${devices.tabletPortrait} {
    align-content: start;
  }
`;

export const IndianLandsLabel = styled(ColumnTitle)`
  grid-column: 1 / -1;
`;

const Swatch = styled.span`
  display: block;
  width: 20px;
  height: 16px;
  align-self: center;
`

export const UncededSwatch = styled(Swatch)`
  background-color: ${colors.legendIndianLandsMediumColor};
  padding: 1px; /* make it a bit bigger as it has no border */
`;

export const Label = styled.div<{ $dimmed?: boolean }>`
  text-align: left;
  color: ${({ $dimmed }) => ($dimmed ? colors.legendDimmedTextColor : colors.blackColor)} !important;
`;

export const ReservationSwatch = styled(Swatch)`
  border: 1px solid ${colors.legendIndianLandsColor};
  background-color: ${colors.legendIndianLandsFaintColor};
`;

export const ReservationOpenedSwatch = styled(ReservationSwatch)`
  background: repeating-linear-gradient(
    -45deg,
    ${colors.legendIndianLandsMediumColor},
    ${colors.legendIndianLandsMediumColor} 3px,
    transparent 3px,
    transparent 6px
  );
`;









