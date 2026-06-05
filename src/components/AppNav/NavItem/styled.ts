import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../../Constants';

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
  color: ${Constants.colors.olive};
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
