import React from 'react';
import NorthAmerica from '../../../../data/northAmerica.json';
import * as Constants from '../../../Constants';

const NorthAmericaBasemap = () => {
  return (
    <>
    {NorthAmerica.map((d: any) => (
      <path
        d={d}
        /* fill={Constants.colors.northAmericaBackgroundColor} */
        fill='#f7f7f7'
        key={d.substring(0, 50)}
        strokeWidth={2.6}
        stroke='#d9d4ca'
        strokeLinejoin='round'
      />
    ))
      }
    </>
  );
};

export default NorthAmericaBasemap;