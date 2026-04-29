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
    color: ${Constants.colors.lightColor};
    font-family: ${Constants.fonts.sansSerif};
    font-size: 2em;
  }

  a {
    color: ${Constants.colors.lightColor};
    text-decoration: none;
  }

  a:hover {
    color: ${Constants.colors.whiteColor};
    text-decoration: underline;
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
  background-color: ${Constants.colors.mainBGcolor};
  color: ${Constants.colors.lightColor};
  font-size: 18px;
  font-family: ${Constants.fonts.sansSerif};
  margin: 4px 10px;
  border: 2px solid ${Constants.colors.highlightColor};
  border-radius: 5px;
  padding: 5px 12px;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${Constants.colors.whiteColor};
    text-decoration: none;
  }
`;

export const Citation = styled.div`
  padding-left: 40px;
`;

export const ContactSection = styled.div``;

export const ContactFormContainer = styled.div``;

export const ContactForm = styled.form`
  display: grid;
  grid-template-columns: 230px auto;
  gap: 10px;
  padding-bottom: 10vh;

  label {
    grid-column: 1 / span 1;
    text-align: right;
  }

  input,
  textarea {
    grid-column: 2 / span 1;
  }

  input[type='submit'] {
    width: min-content;
    background-color: ${Constants.colors.mainBGcolor};
    color: ${Constants.colors.lightColor};
    font-size: 18px;
    font-family: ${Constants.fonts.sansSerif};
    margin: 4px 10px;
    border: 2px solid ${Constants.colors.highlightColor};
    border-radius: 5px;
    padding: 5px 12px;
    cursor: pointer;
  }

  textarea {
    height: 200px;
  }
`;

export const ContactFormIntro = styled.p`
  text-align: center;
`;
