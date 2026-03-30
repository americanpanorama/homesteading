import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const TimelineSvg = styled.svg<{ $marginLeft?: number }>`
  margin-left: ${({ $marginLeft }) => ($marginLeft ? `${$marginLeft}px` : '0')};

  @media ${Constants.devices.desktop} {
    position: fixed;
    bottom: 30px;
    right: 50%;
    left: 50%;
    z-index: 10001;
  }
`;

export const AcreageLabel = styled.text<{ $visible: boolean }>`
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

export const YearTickLabel = styled.text`
  font-size: 1.25em;
`;
