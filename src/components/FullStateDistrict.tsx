import * as React from 'react';
import { useParams } from "react-router-dom";
import { RouterParams } from '../index.d';
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

const FullStateDistrict = ({abbr, scale}: {abbr: 'IL' | 'IN' | 'OH' | 'MS', scale: number}) => {
  const params = useParams<RouterParams>();
  const year = params.year || '1863';
  const GLOs = {
    IL: (IL as State),
    IN: (IN as State),
    OH: (OH as State),
    MS: (MS as State),
  };

  const features = GLOs[abbr].features;
  const opacity = (GLOs[abbr].yearData.find(yd => yd.year === parseInt(year))) ? GLOs[abbr].yearData.find(yd => yd.year === parseInt(year)).opacity : 0;

  if (opacity) {
    return (
      <g>
        {features.filter(d => d).map((d) => (
          <path
            d={d}
            stroke='#7e7578'
            strokeWidth={0.2 / scale}
            strokeOpacity={IL.yearData.find(yd => yd.year === parseInt(year)).opacity}
            fill='#8c8686'
            fillOpacity={IL.yearData.find(yd => yd.year === parseInt(year)).opacity}
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
          {GLOs[abbr].office}
        </text>
      </g>
    );
  }
  return null;
}

export default FullStateDistrict;
