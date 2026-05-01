import styled from 'styled-components';
import * as Constants from '../../Constants';
import { Label as SelectLabel, Select as BaseSelect } from '../Timeline/Controls/Sort/styled';
import { controlBase, selectedControl, ToggleGroup as LegendToggleGroup } from '../Map/Legend/styled';

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

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`;

export const ControlLabel = styled(SelectLabel)``;

export const SegmentedControl = styled(LegendToggleGroup)`
  width: auto;
  align-self: flex-start;
`;

export const ControlButton = styled.button<{ $active: boolean }>`
  ${controlBase}
  border: 0;
  border-right: 1px solid #bfc1c2;
  min-width: 120px;
  padding: 0 1em;

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
  font-family: ${Constants.fonts.serif};
  font-weight: 700;
  // color: var(--light-color);
`;
