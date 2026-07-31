import styled from "styled-components";

import { Block } from "../Sort/styled";

export { ToggleInput, ToggleRow, ToggleText } from "../ClashesToggle/styled";

export const ToggleBlock = styled(Block)`
  align-items: flex-start;
  flex-shrink: 10;
`;

export const GroupLabel = styled.span`
  color: var(--light-color);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
`;

export const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;
