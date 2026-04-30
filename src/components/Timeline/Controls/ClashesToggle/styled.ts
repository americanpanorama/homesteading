import styled from "styled-components";
import * as Constants from "../../../../Constants";

import { Block } from "../Sort/styled";

export { Label } from "../Sort/styled";

export const ToggleBlock = styled(Block)`
  align-items: flex-start;
`;

export const ToggleRow = styled.label`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  justify-items: start;
  gap: 0.5em;
  width: 100%;
  color: var(--light-color);
  cursor: pointer;
  text-align: left;
`;

export const ToggleInput = styled.input`
  width: 22px;
  height: 22px;
  min-width: 22px;
  margin: 0;
  accent-color: ${Constants.colors.accentColor};
  cursor: pointer;
`;

export const ToggleText = styled.span`
  font-size: 1rem;
  line-height: 1.1;
  text-align: left;
`;
