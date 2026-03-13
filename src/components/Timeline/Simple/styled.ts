import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const TimelineSvg = styled.svg`
  @media ${Constants.devices.desktop} {
    position: fixed;
    bottom: 30px;
    right: 50%;
    left: 50%;
    z-index: 10001;
  }
`;
