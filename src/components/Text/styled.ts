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
    grid-row: 3 / span 1;
    height: calc(100vh - 150px - 75px);
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

export const Citation = styled.div`
  padding-left: 40px;
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
  max-width: 600px;
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
