import styled from 'styled-components';
import * as Constants from '../../../Constants';
export { LongformContainer } from '../styled';

export const AboutMenu = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0;
  width: 100%;
  margin: 0 auto 2rem;
`;

export const AboutMenuButton = styled.button<{ $selected: boolean }>`
  min-width: 0;
  border: 0;
  border-right: 1px solid ${Constants.colors.accentColor};
  border-bottom: 1px solid ${Constants.colors.accentColor};
  border-top: 1px solid ${Constants.colors.accentColor};
  padding: 0.65em 0.75em;
  background-color: ${({ $selected }) => ($selected ? Constants.colors.accentColor : 'transparent')};
  color: ${({ $selected }) => ($selected ? Constants.colors.whiteColor : Constants.colors.accentColor)};
  cursor: pointer;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;

  @media ${Constants.devices.tabletPortrait} {
    padding: 0.65em 2em;
  }

  &:first-child {
    border-left: 1px solid ${Constants.colors.accentColor};
  }

  &:hover,
  &:focus-visible {
    background-color: ${({ $selected }) => ($selected ? Constants.colors.accentColor : Constants.colors.softTextColor)};
  }
`;

export const AboutPanel = styled.section`
  margin: 0 auto;
  max-width: 100%;
`;