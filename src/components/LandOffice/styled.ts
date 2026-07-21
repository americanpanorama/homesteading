import styled from 'styled-components';
import * as Constants from '../../Constants';
import { Label as SelectLabel, Select as BaseSelect } from '../Timeline/Controls/Sort/styled';
import { controlBase, selectedControl } from '../Map/Legend/ActivityToggle/styled';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 0 8px;
  background-color: var(--inset-bg-color);
`;

export const ControlsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
`;

export const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 18px;
`;

export const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${Constants.sizes.tabletPortrait}px) {
    grid-template-columns: 1fr;
  }
`;

export const LegendToggleGroup = styled.nav`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  border: 1px solid ${Constants.colors.legendBorderColor};
  background: ${Constants.colors.legendToggleBackgroundColor};
`;


export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  text-align: left;
`;

export const ControlLabel = styled(SelectLabel)``;

export const SegmentedControl = styled(LegendToggleGroup)`
  width: 100%;
`;

export const ControlButton = styled.button<{ $active: boolean }>`
  ${controlBase}
  flex: 1 1 0;
  border: 0;
  border-right: 1px solid #bfc1c2;
  min-width: 0;
  padding: 0 0.75em;

  &:last-child {
    border-right: 0;
  }

  ${({ $active }) => $active && selectedControl}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Select = styled(BaseSelect)`
  width: 100%;
  max-width: 260px;
`;

export const ChartBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  // text-align: left;
  color: ${Constants.colors.olive};
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  // color: var(--light-color);
`;
