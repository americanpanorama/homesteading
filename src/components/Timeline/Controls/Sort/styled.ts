import styled from "styled-components";
import * as Constants from "../../../../Constants";

export { Block } from "../styled";

export const Label = styled.label`
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--light-color);
  text-align: left;
`;

export const Select = styled.select`
  width: min-content;
  min-width: 0;
  max-width: 100%;
  display: block;             
  appearance: none;
  border: 1px solid ${Constants.colors.mutedTextColor};
  background-color: var(--main-bg-color);
  color: var(--light-color);
  font-size: 0.9em;
  line-height: 1.1;
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0.5rem 2.25rem 0.5rem 0.5rem;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M0 0 L5 6 L10 0 Z' fill='%235b4b63'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-size: 0.7rem 0.5rem;

  &:focus {
    border-color: ${Constants.colors.accentColor};
  }

  @media ${Constants.devices.desktop} {
    max-width: 190px;
  }
`;
