import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const NavContainer = styled.nav`
  order: -10;

  @media ${Constants.devices.desktop} {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
  }
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 18px 0 0 0;
  padding: 0 15px 0 0;
  font-size: 16px;
  list-style: none;

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

  & + &::before {
    content: ' | ';
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
