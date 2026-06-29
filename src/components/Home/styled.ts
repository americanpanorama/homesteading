import styled from "styled-components";
import { Link } from "react-router-dom";
import * as Constants from "../../Constants";

export const Home = styled.div`
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    height: 100%;
    height: 100vh;
    width: 100%;
    max-width: 100vw;
    margin: 0 auto;
    font-size: 1em;
    line-height: 1.5;
    overflow: auto;
    background-image: url(${process.env.PUBLIC_URL}/static/landing.jpg);
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100% auto;
    // padding: 1rem 1rem 4rem;

    @media ${Constants.devices.tabletLandscape} {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content min-content auto;
      grid-template-areas: "title" "subtitle" "description" "explore";
      overflow-y: visible;
      padding: 0;
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
    display: grid;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: clamp(2.5rem, 5vw + 0.5em, 5rem);
    font-weight: 700;
    text-align: center;
    line-height: 1.1;
    font-family: ${Constants.fonts.serif};
    text-transform: uppercase;
    color: ${Constants.heatmapGradientColors[3]};

    @media ${Constants.devices.tabletPortrait} {
        display: flex;
        justify-content: center;
    }
  
    @media ${Constants.devices.tabletLandscape} {
        grid-area: title;
        margin-top: 8vh;
    }
`;

export const Land = styled.span`
  font-weight: 700;
  text-transform: uppercase;
`;

export const Acquisition = styled.span`
  font-weight: 600;
`;

export const And = styled.span`
  font-weight: 100;
  font-size: 1.5em;
  color: ${Constants.colors.fullStateDistrictFillColor};
  font-family: ${Constants.fonts.altFont};
  margin: 0 0.2em;
  opacity: 0.5;
`;

export const Dispossession = styled.span`
  font-weight: 700;
`;

export const Subtitle = styled.h2`
  display: block;
  max-width: 100vw;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: ${Constants.colors.olive};
  font-size: clamp(1.1rem, 4vw + 0.5em, 1.6rem);
  text-align: center;
  line-height: 1.2;
  padding: 0;

  @media ${Constants.devices.tabletLandscape} {
    grid-area: subtitle;
  }
`;

export const Description = styled.p`
  max-width: 100vw;
  margin: 0 auto 2rem;
  color: black;
  font-weight: 300;
  text-align: center;
  line-height: 1.5;
  padding: 0 1rem;
  text-shadow: 0px 0px 50px ${Constants.colors.mainBGcolor}, 
               0px 0px 50px ${Constants.colors.mainBGcolor}, 
               0px 0px 50px ${Constants.colors.mainBGcolor};

  @media ${Constants.devices.tabletLandscape} {
    grid-area: description;
    max-width: min(90%, 800px);
    padding-bottom: 3vh;
  }
`;

export const Explore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: min(90%, 800px);
  height: 280px;
  margin: 0 auto;
  position: relative;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    top: -150px;
    bottom: -150px;
    left: -80px;
    right: -80px;
    background: radial-gradient(circle, white 0%, transparent 60%);
    z-index: 0;
    pointer-events: none;
  }

  @media ${Constants.devices.tabletLandscape} {
    grid-area: explore;
    height: 520px;
    width: 100%;
    align-self: center;
    margin: 0 auto 3rem auto;
  }
`;

export const ExploreButton = styled(Link)`
  position: absolute;
  left: 50%;
  bottom: 1.2rem;
  transform: translateX(-50%);
  color: ${Constants.colors.whiteColor};
  font-size: 1em;
  font-weight: 400 !important;
  text-align: center;
  text-decoration: none;
  line-height: 1;
  background-color: ${Constants.colors.accentColor};
  padding: 1rem 2.5rem;
  border-radius: 999px;
  z-index: 1000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover,
  &:focus,
  &:active {
    background-color: color-mix(in srgb, ${Constants.colors.accentColor} 75%, black);
  }

  @media (max-width: 480px) {
    padding: 0.9rem 2rem;
    font-size: 0.95em;
  }
`;