import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  font-weight: 300;
  background-color: var(--inset-bg-color);
  margin: 20px 0;
  padding-bottom: 12px;
  overflow-x: clip;
  overflow-y: visible;
`;

export const TableAccessLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 7px;
  width: fit-content;
  max-width: calc(100% - 24px);
  box-sizing: border-box;
  margin: 0 12px 8px auto;
  padding: 0;
  background: transparent;
  color: ${Constants.colors.mutedTextColor};
  border: 0;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

export const TableIcon = styled.span`
  display: inline-block;
  width: 1.25em;
  height: 1em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 16' fill='none' stroke='%23777676' stroke-width='1.5'%3E%3Crect x='1' y='1' width='18' height='14'/%3E%3Cpath d='M1 5h18M1 10h18M7 1v14M13 1v14'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

export const ScrollPanel = styled.div<{ $height: number }>`
  width: 100%;
  min-width: 0;
  height: ${({ $height }) => $height}px;

  @media ${Constants.devices.wideLayout} {
    height: auto;
  }
`;
