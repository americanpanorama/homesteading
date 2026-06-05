import React from "react";
import Tooltip from "../../../Tooltip/Index";
import * as Styled from "./styled";

const ConflictsLegend = () => {

  const clashSizes = [
    { label: "0-50", size: 10 },
    { label: "50-200", size: 14 },
    { label: "200-500", size: 18 },
    { label: "500+", size: 22 },
  ];

  return (
    <Styled.Container>
      <Styled.ConflictsTooltip>
        <Tooltip text="Please note, the details recorded were heavily influenced by the perspectives of army officials, on whose reports the data points are mostly based. The data should therefore be treated with caution regarding the identity of the nations involved, as well as the casualty figures and the often euphemistic naming of confrontations." />
      </Styled.ConflictsTooltip>
      <Styled.ConflictsLabel>Armed conflicts involving Indians</Styled.ConflictsLabel>
      <Styled.ConflictsExplanation>Casualties reported by U.S. Army officials</Styled.ConflictsExplanation>
      <Styled.ConflictsSymbols>
        {clashSizes.map(item => (
          <Styled.ClashItem key={item.label}>
            <Styled.ClashCross $size={item.size} />
            {item.label}
          </Styled.ClashItem>
        ))}
      </Styled.ConflictsSymbols>
    </Styled.Container>
  );
};

export default ConflictsLegend;
