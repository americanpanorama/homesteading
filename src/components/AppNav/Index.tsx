import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem/Index';
import Hamburger from './Hamburger/Index';
import * as Constants from '../../Constants';
import { DimensionsContext } from '../../DimensionsContext';
import { Dimensions } from '../../index.d';
import * as Styled from './styled';

const AppNav = () => {
  const { pathname } = useLocation();
  const { width } = useContext(DimensionsContext) as Dimensions;
  const usesHamburgerMenu = width < Constants.sizes.desktop;
  const [isOpen, setIsOpen] = useState(false);

  // this keeps track of the most recent map viewed so if the users checks out the intro or the about page they can return to the map they were looking at most recently
  const isMapPath = pathname.startsWith("/year");
  const [mapPath, setMapPath] = useState(isMapPath ? pathname : "/year/1863");
  useEffect(() => {
    if (isMapPath) {
      setMapPath(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!usesHamburgerMenu) {
      setIsOpen(false);
    }
  }, [usesHamburgerMenu]);

  const closeMenu = () => setIsOpen(false);

  return (
    <Styled.NavContainer id='site-navigation' tabIndex={-1} aria-label='Site sections'>
      {usesHamburgerMenu && (
        <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      <Styled.NavList id='site-nav-list' $isOpen={isOpen}>
        <NavItem to={mapPath} closeMenu={closeMenu}>
          Maps
        </NavItem>
        <NavItem to="/introduction" closeMenu={closeMenu}>
          Introduction
        </NavItem>
        <NavItem to="/dispossession" closeMenu={closeMenu}>
          Indigenous Dispossession  
        </NavItem>
        <NavItem to="/about" closeMenu={closeMenu}>
          About
        </NavItem>
        <NavItem href="//dsl.richmond.edu/panorama#maps" closeMenu={closeMenu}>
          American Panorama
        </NavItem>
      </Styled.NavList>
    </Styled.NavContainer>
  );
};

export default AppNav;
