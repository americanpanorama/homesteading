import styled from 'styled-components';
import * as Constants from '../../../../Constants';
import { hexToRgb } from '../../../../utilities';
import { hextoRgba } from '../../../../utilities';

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

    &:focus {
      outline: none;
      border-color: ${Constants.colors.accentColor};
      box-shadow: 0 0 0 4px color-mix(in srgb, ${Constants.colors.accentColor} 20%, white);
    }
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
