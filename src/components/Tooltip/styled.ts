import styled from "styled-components";
import * as Constants from "../../Constants";

const { colors, fonts } = Constants;

export const Container = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid currentColor;
  background: transparent;
  color: ${colors.lightColor};
  cursor: help;
  font-family: ${fonts.sansSerif};
  font-size: 0.7rem;
  line-height: 1;

  &:focus-visible {
    outline: 3px solid ${colors.focusRingColor};
    outline-offset: 2px;
  }
`;

export const Bubble = styled.span<{ $open: boolean }>`
  position: absolute;
  left: 50%;
  top: 18px;
  z-index: 30;
  display: ${({ $open }) => ($open ? "block" : "none")};
  width: max-content;
  max-width: 220px;
  padding: 0.5em 0.65em;
  border: 1px solid ${colors.legendBorderColor};
  background: ${colors.lightColor};
  box-shadow: 0 4px 10px ${colors.legendPanelLandscapeShadowColor};
  color: ${colors.insetBGcolor};
  font-family: ${fonts.sansSerif};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.25;
  text-align: left;
  transform: translateX(-50%);
  white-space: normal;
`;
