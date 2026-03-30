import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled(Link)<{ $selected: boolean }>`
  pointer-events: ${({ $selected }) => ($selected ? 'none' : 'auto')};
`;

export const Boundary = styled.path.attrs<{
  $strokeWidth: number;
  $fill: string;
}>(({ $strokeWidth, $fill }) => ({
  style: {
    strokeWidth: $strokeWidth,
    fill: $fill,
  },
}))`
  stroke: #aaa;
  fill-opacity: 0.8;
`;
