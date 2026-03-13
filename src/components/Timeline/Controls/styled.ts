import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const Container = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: auto auto auto;
  gap: 20px 28px;
  align-items: end;
  padding: 12px 12px 18px;

  @media only screen and (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;


export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;



