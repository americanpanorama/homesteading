import styled from 'styled-components';
import * as Constants from '../../../../Constants';

export const CitationGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(90px, max-content) minmax(0, 1fr) minmax(52px, max-content);
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

export const CitationAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  background-color: ${Constants.colors.mainBGcolor};
`;

export const CopyButton = styled.button<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid ${({ $copied }) => $copied ? Constants.colors.accentColor : Constants.colors.softTextColor};
  border-radius: 4px;
  background-color: ${({ $copied }) => $copied ? Constants.colors.accentColor : Constants.colors.mainBGcolor};
  color: ${({ $copied }) => $copied ? Constants.colors.mainBGcolor : Constants.colors.accentColor};
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;

  &:hover,
  &:focus {
    border-color: ${Constants.colors.accentColor};
  }

  &:focus {
    outline: 2px solid ${Constants.colors.accentColor};
    outline-offset: 2px;
  }
`;

export const CopyIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;
