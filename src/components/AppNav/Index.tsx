import React, { useContext, useEffect, useState } from 'react';
import * as Constants from '../../Constants';
import { useLinkBuilder, useURLParams } from '../../hooks';
import { DimensionsContext } from '../../DimensionsContext';
import { Dimensions } from '../../index.d';
import * as Styled from './styled';

  const AppNav = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { width } = useContext(DimensionsContext) as Dimensions;
  const usesHamburgerMenu = width < Constants.sizes.desktop;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!usesHamburgerMenu) {
      setIsOpen(false);
    }
  }, [usesHamburgerMenu]);

  const closeMenu = () => setIsOpen(false);

  return (
    <Styled.NavContainer aria-label='Site sections'>
      {usesHamburgerMenu && (
        <Styled.Hamburger
          aria-expanded={isOpen}
          aria-controls='site-nav-list'
          onClick={() => setIsOpen(current => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </Styled.Hamburger>
      )}

      <Styled.NavList id='site-nav-list' $isOpen={isOpen}>
        <Styled.NavItem>
          <Styled.InternalLink
            to={params.text === 'introduction' ? buildLink({ clearText: true }) : buildLink({ text: 'introduction' })}
            aria-current={params.text === 'introduction' ? 'page' : undefined}
            onClick={closeMenu}
          >
            Introduction
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={params.text === 'dispossession' ? buildLink({ clearText: true }) : buildLink({ text: 'dispossession' })}
            aria-current={params.text === 'dispossession' ? 'page' : undefined}
            onClick={closeMenu}
          >
            Indigenous Dispossession
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={params.text === 'sources' ? buildLink({ clearText: true }) : buildLink({ text: 'sources' })}
            aria-current={params.text === 'sources' ? 'page' : undefined}
            onClick={closeMenu}
          >
            Sources
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={params.text === 'about' ? buildLink({ clearText: true }) : buildLink({ text: 'about' })}
            aria-current={params.text === 'about' ? 'page' : undefined}
            onClick={closeMenu}
          >
            About
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.ExternalLink href='//dsl.richmond.edu/panorama#maps' onClick={closeMenu}>
            American Panorama
          </Styled.ExternalLink>
        </Styled.NavItem>
      </Styled.NavList>
    </Styled.NavContainer>
  );
};

export default AppNav;
