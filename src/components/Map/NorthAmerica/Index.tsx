import React from 'react';
import NorthAmerica from '../../../../data/northAmerica.json';
import * as Constants from '../../../Constants';

const NorthAmericaBasemap = () => {
  return (
    <>
    {NorthAmerica.map((d: any) => (
      <path
        d={d}
        fill={Constants.colors.northAmericaBackgroundColor}
        key={d.substring(0, 50)}
        stroke='#e9eef1'
        strokeWidth={3}
      />
    ))
      }
    </>
  );
};

export default NorthAmericaBasemap;