import styled from 'styled-components';
import { colors } from '../../../Constants';
import * as Constants from '../../../Constants';

export const PopupContainer = styled.div`
  font-family: ${Constants.fonts.sansSerif};

  h4 {
    border-bottom: 1px solid ${colors.mutedTextColor};
    margin: 0;
  }
`;

export const PopupData = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;
  column-gap: 5px;

  label {
    text-align: right;
    color: ${colors.mutedTextColor};
  }
`;
