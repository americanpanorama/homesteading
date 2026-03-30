import React from 'react';
import * as Styled from './styled';

const BarChartLegendItem = ({ className, label }: { className: Styled.LegendVariant; label: string }) => (
  <Styled.Item>
    <Styled.Swatch $variant={className} />
    {label}
  </Styled.Item>
);

export default BarChartLegendItem;
