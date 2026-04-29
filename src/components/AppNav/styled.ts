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

export const NavItem = styled.li`
  display: inline-block;
  width: 100%;
  padding: 1px 0;
  white-space: nowrap;

  & + &::before {
    content: '';
  }

  @media ${Constants.devices.desktop} {
    width: auto;
    padding: 0;

    & + &::before {
      content: ' ';
      margin: 0 0.7em;
    }
  }
`;

const navLinkStyles = `
  display: block;
  padding: 5px 1em;
  color: ${Constants.colors.blackColor};
  text-decoration: none;
  border-radius: 5px;

  &:hover,
  &:focus,
  &:active {
    background-color: ${Constants.colors.softTextColor};
  }

  &[aria-current='page'] {
    color: var(--light-color);
  }

  @media ${Constants.devices.desktop} {
    position: relative;
    display: inline;
    padding: 0;

    &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 1px;
      width: 100%;
      background-color: transparent;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    &:hover,
    &:focus,
    &:active {
      color: ${Constants.colors.accentColor};
      background-color: transparent;

      &::before {
        background-color: currentColor;
      }
    }
  }
`;

export const InternalLink = styled(Link)`
  ${navLinkStyles}
`;

export const ExternalLink = styled.a`
  ${navLinkStyles}

  &::after {
    content: '';
    display: inline-block;
    margin-left: 0.25rem;
    width: 0.75em;
    height: 0.75em;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M14 3h7v7'/%3E%3Cpath d='M10 14L21 3'/%3E%3Cpath d='M21 14v7h-7'/%3E%3Cpath d='M3 10v11h11'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;    
  }
`;
