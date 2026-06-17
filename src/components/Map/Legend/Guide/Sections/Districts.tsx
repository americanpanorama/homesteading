import React from 'react';
import * as Styled from '../styled';

const District = () => {
  return (
    <Styled.TipsSection>
      <h3>Homesteading Activity in a District, State, or Territory</h3>
      <Styled.Symbol $imgWidth={120}>
        <img src={`${process.env.PUBLIC_URL}/static/images/district_chart.svg`} alt="Districts barchart" />
      </Styled.Symbol>
      <Styled.Explanation>
        Once selected, states, territories, and districts views have charts that show more detail about homesteading activity in that area over time. These charts can be adjusted to show the number of claims and patents, the number of acres claimed and patented, and the average size of claims and patents.
      </Styled.Explanation>
    </Styled.TipsSection>
  );
}

export default District;