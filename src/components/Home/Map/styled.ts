import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const Container = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 28px;
  overflow: hidden;
`;

export const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`;

export const YearBadge = styled.div`
  position: absolute;
  top: 330px;
  right: 250px;
  z-index: 2;
  color: white;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
text-shadow: 0 0 4px ${Constants.colors.blackColor}, 0 0 6px ${Constants.colors.blackColor};
`;

export const Legend = styled.div`
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  color: ${Constants.colors.blackColor};
  font-family: ${Constants.fonts.sansSerif};
`;

export const LegendLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const LegendBar = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  width: min(34vw, 220px);
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(33, 29, 22, 0.12);
`;

export const LegendStep = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
`;

export const LegendScale = styled.div`
  display: flex;
  justify-content: space-between;
  width: min(34vw, 220px);
  font-size: 0.75rem;
`;
