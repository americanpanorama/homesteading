import styled from 'styled-components';
import * as Constants from '../../Constants';

export const NavContainer = styled.nav`
  order: -10;
  position: fixed;
  top: 10px;
  right: 12px;
  z-index: 13000;

  @media ${Constants.devices.tabletLandscape} {
    grid-area: appNav;
  }
`;

export const NavList = styled.ul<{ $isOpen?: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: absolute;
  top: 48px;
  right: 0;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  // padding: 12px 14px;
  padding: 10px 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  font-size: 15px;
  list-style: none;

  @media ${Constants.devices.desktop} {
    display: flex;
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: right;
    margin: 18px 0 0 0;
    padding: 0 15px 0 0;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;
    font-size: 16px;
  }

  @media ${Constants.devices.desktop} {
    flex-wrap: nowrap;
    font-size: 18px;
    justify-content: flex-end;
    overflow: visible;
    padding-right: 25px;
  }
`;

