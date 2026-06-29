import styled from "styled-components";
import { Link } from "react-router-dom";
import * as Constants from "../../Constants";

export const Home = styled.div`
    grid-column: 1 / -1;
    // grid-row: 2 / -1;
    grid-row: 1 / -1;
    height: 100%;
    height: 100vh;
    width: 100%;
    margin: 0 auto;
    // padding: 2em 0 50em 0;
    font-size: 1em;
    line-height: 1.5;
    overflow: auto;
    background-image: url(${process.env.PUBLIC_URL}/static/landing.jpg);
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100% auto;

    @media ${Constants.devices.tabletLandscape} {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content min-content auto;
      grid-template-areas: "title" "subtitle" "description" "explore";
      // max-height: clamp(600px, 100vw, 900px);
      overflow-y: visible;
      background-image: url(${process.env.PUBLIC_URL}/static/landing.jpg);
    }
    @media ${Constants.devices.desktop} {
      background-image: url(${process.env.PUBLIC_URL}/static/landing.jpg);
    }
    @media (min-width: 2000px) {
      background-image: url(${process.env.PUBLIC_URL}/static/landing.jpg);
      background-position: center 70%;
    }

    ~ header {
    display: none;
    }

    ~ nav {
    grid-column: 1 / -1;
    grid-row: 1;
    max-width: none;
    margin-right: auto;
    }
`;

export const Title = styled.h1`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
    margin-bottom: 0;
    font-size: calc(2rem + ((1vw - 4.8px) * 2.5));
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
    font-family: "Unica One", serif;
    text-transform: uppercase;
    color: ${Constants.heatmapGradientColors[3]};
  
    @media ${Constants.devices.tabletLandscape} {
        grid-area: title;
        margin-top: 8vh;
    }
`;

export const Land = styled.span`
  font-weight: 700;
  text-transform: uppercase;
  //font-size: 0.7em;
  /* align-self: flex-start; */
  //font-family: "Inter", sans-serif;
  //font-family: "Zen Dots", sans-serif;
  `;

export const Acquisition = styled.span`
  font-weight: 600;
  `;

export const And = styled.span`
  font-weight: 100;
  font-size: 1.5em;
  // color: ${Constants.heatmapGradientColors[5]};
  color: ${Constants.colors.fullStateDistrictFillColor};
  font-family: "Zen Dots", sans-serif;
  //font-family: ${Constants.fonts.serif};
  margin: 0 0.2em;
  opacity: 0.5;
  `;

export const Dispossession = styled.span`
  font-weight: 700;
`;


export const Subtitle = styled.h2`
  display: block;
  margin-top: 0;
  color: ${Constants.colors.olive};
  font-size: calc(1.125rem + ((1vw - 4.8px) * 1.3462)) !important;
  text-align: center;
  line-height: 1.1;

  @media ${Constants.devices.tabletLandscape} {
    grid-area: subtitle;
  }
`;

export const Description = styled.p`
  max-width: min(90%, 800px);
  margin: 0 auto;
  color: black;
  font-weight: 300;
  text-align: center;
  line-height: 1.4;
  text-shadow: 0px 0px 50px ${Constants.colors.mainBGcolor}, 0px 0px 50px ${Constants.colors.mainBGcolor}, 0px 0px 50px ${Constants.colors.mainBGcolor};

  @media ${Constants.devices.tabletLandscape} {
    grid-area: description;
    padding-bottom: 3vh;
  }
`;

export const Explore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: min(90%, 800px);
  height: 300px;
  margin: 1rem auto;
  position: relative;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    top: -200px;
    bottom: -200px;
    left: -100px;
    right: -100px;
    background: radial-gradient(circle, white 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }

  @media ${Constants.devices.tabletLandscape} {
    grid-area: explore;
    height: 520px;
    width: 100%;
    // align-self: flex-end;
    align-self: center;
    margin: 0 auto 3rem auto;
  }
`;

export const ExploreButton = styled(Link)`
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  margin: 0 auto;
  color: ${Constants.colors.whiteColor};
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  line-height: 1;
  background-color: ${Constants.colors.accentColor};
  padding: 1.2em 3em;
  border-radius: 999px;
  z-index: 1000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background-color 0.2s;

  &:hover,
  &:focus,
  &:active {
    background-color: color-mix(in srgb, ${Constants.colors.accentColor} 75%, black);
  }
`;
