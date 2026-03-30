import styled from "styled-components";
import * as Constants from "../../../../Constants";

export { Block } from "../styled";


export const LegendTitle = styled.div`
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--light-color);
  text-align: left;
  line-height: 1.15;
  max-width: 100%;
`;

export const LegendRow = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  color: var(--light-color);
  font-size: 0.95rem;
`;

export const LegendBar = styled.div`
  width: 100%;
  min-width: 0;
  height: 17px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    ${Constants.heatmapGradientColors[0]} 0%,
    ${Constants.heatmapGradientColors[1]} 18%,
    ${Constants.heatmapGradientColors[2]} 38%,
    ${Constants.heatmapGradientColors[3]} 60%,
    ${Constants.heatmapGradientColors[4]} 80%,
    ${Constants.heatmapGradientColors[5]} 100%
  );
`;
