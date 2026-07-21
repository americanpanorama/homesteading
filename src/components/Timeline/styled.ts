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
  position: absolute;
  left: 12px;
  top: 0;
  z-index: 2;
  max-width: min(420px, calc(100% - 24px));
  padding: 10px 12px;
  background: ${Constants.colors.whiteColor};
  color: ${Constants.colors.lightColor};
  border: 2px solid ${Constants.colors.focusRingColor};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
  text-align: left;
  text-decoration: none;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-140%);
  transition: transform 160ms ease;

  body.keyboard-navigation &:focus {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`;

export const ScrollPanel = styled.div<{ $height: number }>`
  width: 100%;
  min-width: 0;
  height: ${({ $height }) => $height}px;

  @media ${Constants.devices.wideLayout} {
    height: auto;
  }
`;
