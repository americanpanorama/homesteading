import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const NavContainer = styled.nav`
  order: -10;
  position: fixed;
  top: 10px;
  right: 12px;
  z-index: 13000;

  @media ${Constants.devices.desktop} {
    position: static;
    top: auto;
    right: auto;
    z-index: auto;
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
  }
`;


export const Hamburger = styled.div`

    span {
        width: 30px;
        height: 3px;
        background-color: ${Constants.colors.accentColor};
        display: block;
        margin: 3px auto;
        -webkit-transition: all 0.3s ease-in-out;
        -ms-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
    }
    &.is-open {
        span:nth-child(2){
            opacity: 0;
        }
        span:nth-child(1){
            -webkit-transform: translateY(6px) rotate(45deg);
            -ms-transform: translateY(6px) rotate(45deg);
            -o-transform: translateY(6px) rotate(45deg);
            transform: translateY(6px) rotate(45deg);
        }
        span:nth-child(3){
            -webkit-transform: translateY(-6px) rotate(-45deg);
            -ms-transform: translateY(-6px) rotate(-45deg);
            -o-transform: translateY(-6px) rotate(-45deg);
            transform: translateY(-6px) rotate(-45deg);
        }
    }

  @media ${Constants.devices.desktop} {
    display: none;
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
  padding: 12px 14px;
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

export const NavItem = styled.li`
  display: inline-block;
  white-space: nowrap;
  width: 100%;

  & + &::before {
    content: '';
  }

  @media ${Constants.devices.desktop} {
    width: auto;

    & + &::before {
      content: ' | ';
    }
  }
`;

const navLinkStyles = `
  color: ${Constants.colors.blackColor};
  text-decoration: none;
  padding: 0 5px;

  &:hover {
    color: var(--light-color);
    text-decoration: underline;
  }

  &[aria-current='page'] {
    color: var(--light-color);
  }
`;

export const InternalLink = styled(Link)`
  ${navLinkStyles}
`;

export const ExternalLink = styled.a`
  ${navLinkStyles}
`;
