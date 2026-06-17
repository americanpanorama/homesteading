import React from 'react';
import { Link } from 'react-router-dom';
import * as Styled from './styled';

const ControllingTheMap = () => {
  return (
    <Styled.TipsSection>
      <h3>Controlling the Map</h3>
      <Styled.Symbol>
        <img src={`${process.env.PUBLIC_URL}/static/images/new-mexico-claims-1902.svg`} alt="a small map of a territory with districts colored by claims for one year" />
      </Styled.Symbol>
      <Styled.Explanation>
        Click on a state or territory to zoom in. From that view, you can then click on a district to explore homesteading activity there in greater depth.
      </Styled.Explanation>

      <Styled.Symbol $imgWidth={120}>
        <img src={`${process.env.PUBLIC_URL}/static/images/timeline.svg`} alt="timeline cells representing different places and fiscal years" />
      </Styled.Symbol>
      <Styled.Explanation>
        The timeline shows homestead activity over time for states and territories when viewing the United States and for districts when a state or territory is selected. It uses the same colors as the map. It can be clicked on to select a year.
      </Styled.Explanation>

      <Styled.Symbol>
        <Styled.ActivitySymbols>
          <Styled.Control $selected={true}>Claims</Styled.Control>
          <Styled.Control $selected={false}>Patents</Styled.Control>
        </Styled.ActivitySymbols>
      </Styled.Symbol>
      <Styled.Explanation>
        The map and timeline can show either claims or patents. They can be further filtered to show activity of federal lands and on Indian lands. For patents, they can also be filtered to show patents from residency or commutations.
      </Styled.Explanation>
    </Styled.TipsSection>
  );
};

export default ControllingTheMap;