import styled from 'styled-components';
import { colors } from '../../../Constants';
import * as Constants from '../../../Constants';

export const PopupContainer = styled.div`
  font-family: ${Constants.fonts.sansSerif};
  min-width: 190px;

  h4 {
    border-bottom: 1px solid ${colors.mutedTextColor};
    margin: 0 0 8px;
    padding-bottom: 5px;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.15;
  }
`;

export const PopupData = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 10px;
  row-gap: 3px;

  label {
    text-align: right;
    color: ${colors.mutedTextColor};
    white-space: nowrap;
  }
`;
