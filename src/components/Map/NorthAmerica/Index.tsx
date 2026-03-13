import React from 'react';
import NorthAmerica from '../../../../data/northAmerica.json';

const NorthAmericaBasemap = () => {
  return (
    <>
    {NorthAmerica.map((d: any) => (
      <path
        d={d}
        fill={'#FFFDFA'}
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