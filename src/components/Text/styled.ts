import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const LongformContainer = styled.div`
  padding: 10px calc(50vw - 500px);
  max-width: 90vw;
  overflow-y: scroll;
  text-align: left;
  font-size: 1em;
  line-height: 1.8;
  font-family: ${Constants.fonts.sansSerif};
  color: ${Constants.colors.lightColor};
  margin: 0 auto;

  h3 {
    text-align: center;
    color: ${Constants.colors.olive};
    font-family: ${Constants.fonts.serif};
    font-size: 2em;
  }

  a {
    color: ${Constants.colors.accentColor};
    // text-decoration: none;
  }
   
  li {
    margin-bottom: 0.5em;
  }

  @media ${Constants.devices.desktop} {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
    height: calc(100vh - 75px);
    justify-self: center;
    font-size: 1.2em;
    max-width: 1000px;
  }
`;

export const LongformNav = styled.nav`
  text-align: right;
  position: sticky;
  top: 20px;
`;

export const CloseTextLink = styled(Link)`
  display: inline-block;
  margin: 4px 10px;
  padding: 5px 15px;
  color: ${Constants.colors.accentColor};
  font-size: 0.9rem;
  font-family: ${Constants.fonts.sansSerif};
  text-decoration: none !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${Constants.colors.mainBGcolor};
  border: 2px solid ${Constants.colors.accentColor};
  border-radius: 999px;

  &:hover,
  &:focus-visible {
    color: ${Constants.colors.whiteColor};
    background-color: ${Constants.colors.accentColor};
    text-decoration: none !important;
  }
`;

export const AboutMenu = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0;
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

export const CitationGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(90px, max-content) minmax(0, 1fr);
  gap: 1px;
  margin: 1.5rem 0 0;
  border: 1px solid ${Constants.colors.softTextColor};
  background-color: ${Constants.colors.softTextColor};
`;

export const CitationStyle = styled.div`
  padding: 1em;
  background-color: ${Constants.colors.mainBGcolor};
  color: ${Constants.colors.accentColor};
  font-weight: 700 !important;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const CitationText = styled.div`
  padding: 1em;
  background-color: ${Constants.colors.mainBGcolor};
`;

export const ContactSection = styled.div``;

export const ContactFormContainer = styled.div``;

export const ContactForm = styled.form`
  // display: grid;
  // grid-template-columns: 100px auto;
  // gap: 10px;
  padding-bottom: 10vh;
  // justify-content: center;
  
  display: block;
  width: 100%;
  margin: 0 auto;

  label {
    // grid-column: 1 / span 1;
    // text-align: right;
    display: block;
    pointer-events: auto;
    color: ${Constants.colors.lightColor};
    text-decoration: none;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  input,
  textarea {
    // grid-column: 2 / span 1;
    display: block;
    width: calc(100% - 2em - 2px);
    margin-bottom: 1em;
    padding: 1em;
    border-width: 1px;
  }

  input[type='submit'] {
    width: min-content;
    margin: 25px auto 0 auto;
    padding: 1em 2em;
    color: ${Constants.colors.whiteColor};
    font-family: ${Constants.fonts.sansSerif};
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    line-height: 1;    
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background-color: ${Constants.colors.accentColor};
    border: none;
    border-radius: 999px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    z-index: 1000;

    &:hover,
    &:focus,
    &:active {
      background-color: color-mix(in srgb, ${Constants.colors.accentColor} 75%, black);
    }

  }

  textarea {
    height: 200px;
  }
`;

export const ContactFormIntro = styled.p`
  text-align: center;
`;
