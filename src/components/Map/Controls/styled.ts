import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ZoomOutLink = styled(Link)`
  -moz-appearance: button;
  appearance: button;
  text-decoration: none;
  background-color: var(--highlight-color);
  color: var(--light-color);
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid var(--main-bg-color);
  margin: 0;
  vertical-align: top;
`;
