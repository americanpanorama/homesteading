import React from 'react';
import ContinentalUS from '../../../../data/continentalUS.json';

const ContinentalUSBasemap = () => {
  return (
    <>
      {ContinentalUS.map((d: any) => (
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

export default ContinentalUSBasemap;