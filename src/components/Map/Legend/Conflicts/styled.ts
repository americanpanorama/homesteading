import styled from "styled-components";
import * as Constants from '../../../../Constants';
import { ColumnTitle } from '../styled';

const { colors } = Constants;

export const Container = styled.section`
  grid-area: conflicts;
  align-self: start;
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: auto auto auto;
  grid-template-areas: 'conflictsTooltip conflictLabel' '. conflictsExplanation' '. conflictsSymbols';
  column-gap: 0.5em;
  row-gap: 0.25em;
  padding: 0.5em;
`;

export const ConflictsTooltip = styled.div`
  grid-area: conflictsTooltip;
  display: flex;
  justify-content: start;
  align-items: center;
`;

export const ConflictsLabel = styled(ColumnTitle)`
  grid-area: conflictLabel;
`;

export const ConflictsExplanation = styled.div`
  grid-area: conflictsExplanation;
  justify-self: start;
  align-self: start;
  text-align: left;
  font-size: 0.85em;
`;

export const ConflictsSymbols = styled.div`
  grid-area: conflictsSymbols;
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5em;
  row-gap: 0em;
  align-items: center;
`;

export const ClashItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.85rem;
  color: ${colors.lightColor};
  font-weight: 700;
`;

export const ClashCross = styled.span<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: 0 0 auto;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background: ${colors.legendConflictColor};
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;
