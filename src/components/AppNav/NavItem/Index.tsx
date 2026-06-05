import React from 'react';
import * as Styled from './styled';
import { useURLParams } from '../../../hooks';

type NavItemProps = {
  to?: string;
  href?: string;
  children: React.ReactNode;
  closeMenu: () => void;
};

const NavItem = ({ to, href, closeMenu, children }: NavItemProps) => {
  const params = useURLParams();

  if (to) {
    return (
      <Styled.NavItem>
        <Styled.InternalLink
          to={to}
          aria-current={params.text === to ? 'page' : undefined}
          onClick={closeMenu}
        >
          {children}
        </Styled.InternalLink>
      </Styled.NavItem>
    );
  }

  if (href) {
    return (
      <Styled.NavItem>
        <Styled.ExternalLink href={href} onClick={closeMenu}>
          {children}
        </Styled.ExternalLink>
      </Styled.NavItem>
    );
  }

  return null;

};

export default NavItem;
