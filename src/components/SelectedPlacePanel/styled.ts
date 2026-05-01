import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 1em 0.5em 32px;
  background-color: var(--inset-bg-color);

  @media ${Constants.devices.tabletLandscape} {
    padding: 24px 24px 32px;
  }

`;

export const Header = styled.header`
  display: none;

  @media ${Constants.devices.tabletLandscape} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    text-align: left;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid ${Constants.colors.accentColor};
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  color: ${Constants.colors.accentColor};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700 !important;

  &:hover {
    background-color: ${Constants.colors.accentColor};
    color: ${Constants.colors.whiteColor};
    border-color: ${Constants.colors.accentColor};
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1;
  font-family: ${Constants.fonts.serif};
  font-weight: 700;
  color: var(--light-color);
  color: ${Constants.colors.olive};
  align-self: center;
`;

export const Summary = styled.div`
  text-align: left;
`;

export const ToggleGroup = styled.div`
  display: inline-flex;
  align-self: center;
  padding: 4px;
  gap: 0.5em;

`;

export const ToggleLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 5px 18px;
  border: ${({ $active }) => ($active ? `1px solid ${Constants.colors.accentColor}` : '1px solid transparent')};
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? Constants.colors.accentColor : 'transparent')};
  color: ${({ $active }) => ($active ? Constants.colors.whiteColor : Constants.colors.accentColor)};
  font-family: inherit;
  font-size: 1rem;
  letter-spacing: 0.04em;

  text-transform: uppercase;
  font-weight: 700 !important;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    border-color: ${Constants.colors.accentColor};
  }
`;

export const Content = styled.div`
  min-width: 0;
  padding-top: 4px;
`;
