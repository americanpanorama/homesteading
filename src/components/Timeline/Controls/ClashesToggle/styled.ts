import styled from "styled-components";
import * as Constants from "../../../../Constants";

import { Block } from "../Sort/styled";

export { Label } from "../Sort/styled";

export const ToggleBlock = styled(Block)`
  align-items: flex-start;
`;

export const ToggleRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--light-color);
  cursor: pointer;
`;

export const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${Constants.colors.accentColor};
  cursor: pointer;
`;

export const ToggleText = styled.span`
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;
