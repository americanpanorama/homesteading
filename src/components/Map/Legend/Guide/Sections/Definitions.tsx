import React from 'react';
import * as Styled from '../styled';
import { Link } from 'react-router-dom';

const Definitions = () => {
  return (
    <Styled.TipsSection>
      <h3>Definitions</h3>
      <Styled.Term>District</Styled.Term>
      <Styled.Explanation>
        A district was a geographic area that is used to manage land distribution through claims and patents. Districts were established by the federal government with a land office located in a town or city within the district that oversaw all land management and distribution. Districts were often named after the town or city where the land office was located, and they could cover large areas of land that included multiple counties or even entire states.
      </Styled.Explanation>
      <Styled.Term>Claim</Styled.Term>
      <Styled.Explanation>
        Homesteaders could file a claim for a piece of land under the Homestead Act. A claim was a request to occupy and use a specific piece of land. Homestead claims were often for 160 acres, though acreage varied by law, place, and period. Filing a claim was the first step in the process of obtaining ownership of that land.
      </Styled.Explanation>
      <Styled.Term>Patent</Styled.Term>
      <Styled.Explanation>
        A patent was the legal document that transferred ownership of public land from the U.S. government to the claimant. It was issued after the claimant fulfilled the relevant legal requirements and served as evidence of title.
      </Styled.Explanation>
      <Styled.Term>Residency</Styled.Term>
      <Styled.Explanation>
        Residence was the requirement that a claimant live on the land for a specified period, usually five years under the original Homestead Act, while also improving or cultivating it. The requirement was intended to encourage settlement rather than speculation.
      </Styled.Explanation>
      <Styled.Term>Commutation</Styled.Term>
      <Styled.Explanation>
        Commutation allowed a claimant to obtain title before completing the full residence period by paying the legal purchase price, usually $1.25 per acre, after meeting a shorter residence and improvement requirement. Because it shortened the path to ownership, commutation was sometimes abused for speculation.
      </Styled.Explanation>

      <Styled.Tip>
        <img src={`${process.env.PUBLIC_URL}/static/images/icon_info.svg`} alt="info icon" />For more information about the Homestead Act and homesteading, see the <Link to='/introduction'>Introduction</Link>.
      </Styled.Tip>
    </Styled.TipsSection>


  );
};

export default Definitions;