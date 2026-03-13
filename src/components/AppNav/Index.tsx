import React from 'react';
import { useURLParams } from '../../hooks';
import { makeParams } from '../../utilities';
import * as Styled from './styled';

const AppNav = () => {
  const params = useURLParams();

  return (
    <Styled.NavContainer aria-label='Site sections'>
      <Styled.NavList>
        <Styled.NavItem>
          <Styled.InternalLink
            to={makeParams(params, [(params.text === 'introduction') ? { type: 'clear_text' } : { type: 'show_text', payload: 'introduction' }])}
            aria-current={params.text === 'introduction' ? 'page' : undefined}
          >
            Introduction
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={makeParams(params, [(params.text === 'dispossession') ? { type: 'clear_text' } : { type: 'show_text', payload: 'dispossession' }])}
            aria-current={params.text === 'dispossession' ? 'page' : undefined}
          >
            Indigenous Dispossession
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={makeParams(params, [(params.text === 'sources') ? { type: 'clear_text' } : { type: 'show_text', payload: 'sources' }])}
            aria-current={params.text === 'sources' ? 'page' : undefined}
          >
            Sources
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.InternalLink
            to={makeParams(params, [(params.text === 'about') ? { type: 'clear_text' } : { type: 'show_text', payload: 'about' }])}
            aria-current={params.text === 'about' ? 'page' : undefined}
          >
            About
          </Styled.InternalLink>
        </Styled.NavItem>
        <Styled.NavItem>
          <Styled.ExternalLink href='//dsl.richmond.edu/panorama#maps'>
            American Panorama
          </Styled.ExternalLink>
        </Styled.NavItem>
      </Styled.NavList>
    </Styled.NavContainer>
  );
};

export default AppNav;
