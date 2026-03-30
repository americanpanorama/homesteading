import React from 'react';
import Border from '../../../../data/internationalBorder.json';
import * as Styled from './styled';

const BorderBasemap = () => {
  return (
    <>
    {Border.map((d: any) => (
      <Styled.BorderPath
        d={d}
        fill='transparent'
        key={d.substring(0, 50)}
        stroke='#999'
        strokeWidth={1}
      />
    ))
      }
    </>
  );
};

export default BorderBasemap;
