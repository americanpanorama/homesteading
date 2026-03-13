import React from 'react';
import * as Styled from './styled';
import { useClaimsAndPatentsTypes, useURLParams } from '../../../../hooks';

const Legend = () => {
  const { stateTerr } = useURLParams();
  const { acresLabel } = useClaimsAndPatentsTypes();
  const label = `% ${!stateTerr ? "state or territory" : "district"} area ${acresLabel}:`;
  return (
    <Styled.Block>
      <Styled.LegendTitle>{label}</Styled.LegendTitle>
      <Styled.LegendRow>
        <span>0%</span>
        <Styled.LegendBar aria-hidden='true' />
        <span>5%+</span>
      </Styled.LegendRow>
    </Styled.Block>
  );
};

export default Legend;
