import React from 'react';
import { useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();

  if (to) {
    const textPath = to.replace(/^\//, '');
    const isCurrent = pathname === to || (params.text
      ? params.text === textPath
      : to.startsWith('/year') && pathname.startsWith('/year'));

    return (
      <Styled.NavItem>
        <Styled.InternalLink
          to={to}
          aria-current={isCurrent ? 'page' : undefined}
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
