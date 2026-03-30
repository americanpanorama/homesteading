import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: center;
  justify-content: space-around;
  padding: 12px 12px 18px;

  @media ${Constants.devices.tabletLandscape} {
    gap: 16px 18px;
  }

  @media ${Constants.devices.desktop} {
    gap: 18px 16px;
  }
`;


export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  align-self: start;
`;
