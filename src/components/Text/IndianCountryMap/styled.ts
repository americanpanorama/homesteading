import styled from 'styled-components';
export { NorthAmericaPath, StatePath, BorderPath, Figure, Figcaption } from '../SourceTileFigure/styled'

export const Shell = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  background: #e9e6df;
  border: 1px solid #aaa;
  overflow: hidden;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 0.5em;
`; 

export const LegendCircle = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;