import styled from "styled-components";
import * as Constants from '../../../../Constants';
import { Link } from "react-router-dom";

const { colors, fonts, devices } = Constants;

export const Container = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
    border: 0;
    border-radius: 0;
    background: transparent;
  box-shadow: 0 4px 16px ${colors.legendHeaderShadowColor};
  backdrop-filter: blur(10px);

  @media ${devices.desktop} {
    padding: 0 4px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }
`;

export const Divider = styled.div`
  flex: 1;
  height: 1px;
  background: ${colors.legendHeaderDividerColor};
`;

export const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  padding: 0 12px;
  background: transparent;
  cursor: pointer;
  color: ${colors.lightColor};
  font-family: ${fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  // add a halo for better visibility on the map
`;

export const Chevron = styled.span<{ $collapsed: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $collapsed }) => ($collapsed ? 'rotate(45deg) translateY(-1px)' : 'rotate(225deg) translateY(-1px)')};
`;

export const GuideLink = styled.div`
  pointer-events: auto;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${colors.lightColor};
  text-decoration: none;
  font-family: ${fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;

  &:focus-visible {
    outline: 3px solid ${colors.focusRingColor};
    outline-offset: 2px;
  }
`;

export const GuideIcon = styled.span`
  display: inline-block;
  width: 1.25em;
  height: 1em;
  line-height: 1;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round'%3E%3Cpath d='M1 2l7-1 8 2 7-1v13l-7 1-8-2-7 1z'/%3E%3Cpath d='M8 1v13M16 3v13'/%3E%3C/svg%3E");
`;
