import * as React from 'react';
import { useParams } from "react-router-dom";
import { RouterParams, ClaimsAndPatentsAcresType } from '../index.d';
import { ProjectedTownship } from './Map.d';
import IL from '../../data/GLOs/IL.json';
import IN from '../../data/GLOs/IN.json';
import OH from '../../data/GLOs/OH.json';
import MS from '../../data/GLOs/MS.json';

interface YearData {
  year: number;
  opacity: number;
};

interface State {
  features: string[];
  yearData: YearData[];
  office: string;
  labelCoords: [number, number];
  labelRotation: number;
}

const FullStateDistrict = ({abbr, projectedTownship, scale}: {abbr: 'IL' | 'IN' | 'OH' | 'MS', projectedTownship: ProjectedTownship, scale: number}) => {
  const params = useParams<RouterParams>();
  const year = params.year || '1863';
  const { fullOpacity, view } = params;
  const GLOs = {
    IL: (IL as State),
    IN: (IN as State),
    OH: (OH as State),
    MS: (MS as State)
  };

  const types: ClaimsAndPatentsAcresType[] = (view) ? view.split('-') as ClaimsAndPatentsAcresType[] : ["acres_claimed", "acres_claimed_indian_lands"];
  const acres = types.reduce((acc, curr) => projectedTownship[curr] + acc, 0);
  const features = GLOs[abbr].features;
  const opacity = (fullOpacity) ? 1 : (acres === 0) ? 0.03 : 0.15 + 0.85 * acres * 100 / projectedTownship.area;

  if (opacity) {
    return (
      <g>
        {features.filter(d => d).map((d) => (
          <path
            d={d}
            stroke='#7e7578'
            strokeWidth={0.2 / scale}
            strokeOpacity={opacity}
            fill='#8c8686'
            fillOpacity={opacity}
            key={d.substring(0, 50)}
          />
        ))}
        <text
          transform={`translate(0 4) rotate(${GLOs[abbr].labelRotation * -1} ${GLOs[abbr].labelCoords.join(' ')})`}
          x={GLOs[abbr].labelCoords[0]}
          y={GLOs[abbr].labelCoords[1]}
          textAnchor='middle'
          stroke='transparent'
          style={{
            fontFamily: 'Titillium Web',
            textTransform: 'uppercase',
            fontSize: 3,
            fontWeight: 200,
            fill: 'black',
            letterSpacing: 1.6
          }}
        >
          {projectedTownship.office}
        </text>
      </g>
    );
  }
  return null;
}

export default FullStateDistrict;
