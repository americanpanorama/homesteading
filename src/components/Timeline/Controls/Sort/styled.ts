import styled from "styled-components";
import * as Constants from "../../../../Constants";

export { Block } from "../styled";

export const Label = styled.label`
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--light-color);
`;

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  appearance: none;
  border: 2px solid ${Constants.colors.mutedTextColor};
  background-color: var(--main-bg-color);
  color: var(--light-color);
  font-size: 1em;
  font-family: 'Roboto Condensed', sans-serif;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--light-color) 50%),
    linear-gradient(135deg, var(--light-color) 50%, transparent 50%);
  background-position:
    calc(100% - 28px) calc(50% - 3px),
    calc(100% - 18px) calc(50% - 3px);
  background-size: 10px 10px, 10px 10px;
  background-repeat: no-repeat;
  padding: 0.5em;

  &:focus {
    border-color: ${Constants.colors.accentColor};
    outline: 3px solid ${Constants.colors.focusRingColor};
    outline-offset: 2px;
  }
`;