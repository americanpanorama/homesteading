import styled from 'styled-components';
import * as Constants from "../../../../../../Constants";
export * from '../../styled';

import { ActivitySymbols as _ActivitySymbols, toggleControlStyles } from '../../../ActivityToggle/styled';

export const ActivitySymbols = styled(_ActivitySymbols)`
  transform: scale(0.7);
  transform-origin: left center;

  @media ${Constants.devices.mobile} {
    transform-origin: right center;
  }
`; 

export const Control = styled.span<{ $selected?: boolean }>`
  ${toggleControlStyles}
`