import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../Constants';

export const Container = styled.main.attrs({
  id: 'main-content',
  tabIndex: -1,
})`
  grid-column: 1 / -1;
  grid-row: 2 / span 2;
  width: min(100% - 32px, 1280px);
  height: calc(100vh - 75px);
  margin: 0 auto;
  overflow: auto;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  text-align: left;
`;

export const Header = styled.header`
  display: grid;
  gap: 12px;
  padding: 18px 0 12px;
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
  max-width: 82ch;
  margin: 0;
  line-height: 1.5;
`;

export const YearNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const YearLink = styled(Link)<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 4px 10px;
  border: 1px solid ${({ $disabled }) => ($disabled ? Constants.colors.softTextColor : Constants.colors.accentColor)};
  color: ${({ $disabled }) => ($disabled ? Constants.colors.disabledTextColor : Constants.colors.accentColor)};
  text-decoration: none;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;

export const Section = styled.section`
  margin: 24px 0 34px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: ${Constants.colors.accentColor};
  font-family: ${Constants.fonts.serif};
  font-size: clamp(1.4rem, 2vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
`;

export const SubsectionTitle = styled.h4`
  margin: 18px 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(0, 0, 0, 0.34);
  background: ${Constants.colors.whiteColor};
`;

export const DataTable = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  color: ${Constants.colors.lightColor};
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 8px 10px;
    border: 1px solid rgba(0, 0, 0, 0.16);
    vertical-align: top;
  }

  thead th {
    background: ${Constants.colors.insetHeaderBGcolor};
    color: ${Constants.colors.whiteColor};
    font-weight: 700;
    text-align: left;
  }

  tbody tr:nth-child(even) {
    background: #f7f5f1;
  }

  td.numeric,
  th.numeric {
    text-align: right;
  }
`;

export const DetailsList = styled.div`
  display: grid;
  gap: 8px;
`;

export const StateDetails = styled.details`
  border: 1px solid rgba(0, 0, 0, 0.24);
  background: ${Constants.colors.whiteColor};

  summary {
    display: grid;
    grid-template-columns: minmax(180px, 1.2fr) repeat(4, minmax(110px, 0.8fr));
    gap: 10px;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::before {
    content: '+';
    font-weight: 700;
  }

  &[open] summary::before {
    content: '-';
  }

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    summary {
      grid-template-columns: 1fr;
    }
  }
`;

export const DataDisclosure = styled.details`
  margin-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  background: ${Constants.colors.whiteColor};

  summary {
    padding: 10px;
    cursor: pointer;
    font-weight: 700;
  }
`;

export const DetailsBody = styled.div`
  padding: 0 10px 12px;
`;

export const StateName = styled.span`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-weight: 700;
`;

export const Metric = styled.span`
  display: grid;
  gap: 2px;
`;

export const MetricLabel = styled.span`
  color: ${Constants.colors.olive};
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const MetricValue = styled.span`
  font-weight: 700;
`;

export const Muted = styled.span`
  color: ${Constants.colors.mutedTextColor};
`;

export const EmptyMessage = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  background: ${Constants.colors.whiteColor};
`;

export const InlineLink = styled(Link)`
  color: ${Constants.colors.accentColor};
  font-weight: 700;
`;

export const ExternalLink = styled.a`
  color: ${Constants.colors.accentColor};
  font-weight: 700;
`;
