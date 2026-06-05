import styled from "styled-components";
import * as Constants from '../../../../Constants';
export { ColumnTitle } from '../styled';

const { devices } = Constants;

export const Container = styled.section`
  grid-area: districts;
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  @media ${devices.tabletPortrait} {
    justify-items: start;
    text-align: left;
    min-width: 200px; /* the gradient is 200px wide, so this allows for some padding */
  }
`;
