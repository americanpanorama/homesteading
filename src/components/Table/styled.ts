import styled from 'styled-components';
import * as Constants from '../../Constants';

export const Container = styled.main.attrs({
  tabIndex: -1,
})`
  grid-column: 1 / -1;
  grid-row: 2 / span 2;
  display: flex;
  flex-direction: column;
  width: min(100% - 32px, 1440px);
  height: calc(100vh - 75px);
  min-width: 0;
  margin: 0 auto;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  text-align: left;
`;

export const Header = styled.header`
  flex: 0 0 auto;
  display: grid;
  gap: 10px;
  padding: 16px 0 8px;
`;

export const Eyebrow = styled.p`
  margin: 0;
  color: ${Constants.colors.olive};
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${Constants.fonts.serif};
  font-size: clamp(1.8rem, 3vw, 3.2rem);
  font-weight: 700;
  line-height: 1.05;
  text-transform: uppercase;
`;

export const Description = styled.p`
  max-width: 78ch;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

export const VisualizationLink = styled.a`
  color: ${Constants.colors.accentColor};
  font-weight: 700;
`;

export const TableWrap = styled.div`
  flex: 1 1 auto;
  min-height: 260px;
  margin-bottom: 24px;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.34);
  background: ${Constants.colors.whiteColor};
  scrollbar-gutter: stable;
`;

export const DataTable = styled.table`
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  color: ${Constants.colors.lightColor};
  font-variant-numeric: tabular-nums;

  .place-column {
    width: 240px;
  }

  .metric-column {
    width: 120px;
  }

  th,
  td {
    border-right: 1px solid rgba(0, 0, 0, 0.16);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    padding: 8px 6px;
    vertical-align: top;
  }


  thead th {
    position: sticky;
    top: 0;
    z-index: 3;
    background: ${Constants.colors.insetHeaderBGcolor};
    color: ${Constants.colors.whiteColor};
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  thead tr:nth-child(2) th {
    top: 34px;
    background: ${Constants.colors.olive};
  }

  thead th[scope='colgroup'],
  .year-start {
    border-left: 3px solid rgba(0, 0, 0, 0.46);
  }

  .year-end {
    border-right: 3px solid rgba(0, 0, 0, 0.46);
  }

  tbody th {
    position: sticky;
    left: 0;
    z-index: 2;
    width: 240px;
    background: ${Constants.colors.whiteColor};
    text-align: left;
    white-space: normal;
  }

  thead .place-header {
    left: 0;
    z-index: 4;
    width: 240px;
    text-align: left;
  }

  tbody tr:nth-child(even) th,
  tbody tr:nth-child(even) td {
    background: #f7f5f1;
  }

  tbody tr:nth-child(even) th {
    background: #f7f5f1;
  }

  td {
    text-align: right;
    white-space: nowrap;
  }
`;

export const EmptyMessage = styled.p`
  padding: 24px 0;
  font-size: 1.1rem;
`;
