import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled(Link)``;

export const StaticContainer = styled.g`
  pointer-events: none;
`;

export const Boundary = styled.path.attrs<{ $strokeWidth: number; $fill: string }>(({ $strokeWidth, $fill }) => ({
  style: {
    strokeWidth: $strokeWidth,
    fill: $fill,
  },
}))`
  stroke: #d4c6b7;
  fill-opacity: 0.8;
`;
