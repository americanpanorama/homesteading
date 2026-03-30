import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const Container = styled.section<{ $isOffice: boolean }>`
  /* display: grid;
  gap: 18px;
  padding: 20px 0 0;

  ${({ $isOffice }) => $isOffice && `
    grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
    align-items: start;
  `}

  @media (max-width: ${Constants.sizes.tabletLandscape}px) {
    grid-template-columns: 1fr;
  } */
`;

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
`;

export const Paragraph = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--light-color);
`;

export const Highlight = styled.strong`
  font-weight: 700 !important;;
`;

export const ConflictNote = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 999px;
  background-color: rgba(2, 121, 107, 0.08);
  color: var(--light-color);
  font-size: 0.92rem;
  line-height: 1.3;
`;

export const MiniMapPanel = styled.div`
  padding: 14px 0;
`;
