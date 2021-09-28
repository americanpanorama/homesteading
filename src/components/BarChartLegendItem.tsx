import React from 'react';

const BarChartLegendItem = ({ className, label }: { className: string; label: string }) => (
  <div>
    <div
      className={`box ${className}`}
    />
    {label}
  </div>
);

export default BarChartLegendItem;
