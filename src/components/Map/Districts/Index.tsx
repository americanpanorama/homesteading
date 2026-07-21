import * as React from 'react';
import District from './District/Index';
import { useMapDistricts, useMapView, useYearData } from '../../../hooks';
import * as Styled from './styled';

const Districts = () => {
  const { scale } = useMapView();
  const yearData = useYearData();
  const { districts, officeLabelPlacements } = useMapDistricts();

  return (
    <g>
      {districts.map(({ projectedTownship, link, linkActive, label, strokeWidth, fill }) => (
          <District
            d={projectedTownship.d}
            link={link}
            linkActive={linkActive}
            label={label}
            strokeWidth={strokeWidth}
            fill={fill}
            key={`office-${projectedTownship.office}-${projectedTownship.state}-${projectedTownship.area}`}
          />
        ))}

      {officeLabelPlacements.map(({ office: projectedTownship, label, x, y, fontSize, strokeWidth, rotation }) => (
        <Styled.OfficeLabel
          x={x}
          y={y}
          fontSize={fontSize}
          strokeWidth={strokeWidth}
          transform={`rotate(${-rotation} ${x} ${y})`}
          key={`office-label-${projectedTownship.office}-${projectedTownship.state}`}
        >
          {label}
        </Styled.OfficeLabel>
      ))}
    </g>
  );
};

export default Districts;
