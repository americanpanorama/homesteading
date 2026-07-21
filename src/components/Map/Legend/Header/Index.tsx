import React from "react";
import * as Styled from "./styled";

const LegendHeader = ({ collapsed, setCollapsed, guideOpen, setIsGuideOpen }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>>; guideOpen: boolean; setIsGuideOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <Styled.Container>
      <Styled.Divider />
      <Styled.HeaderButton
        type="button"
        onClick={() => setCollapsed(current => !current)}
        aria-expanded={!collapsed}
        aria-controls="map-legend-panel"
      >
        Legend
        <Styled.Chevron $collapsed={collapsed} />
      </Styled.HeaderButton>
      <Styled.Divider />
      <Styled.GuideLink
        type="button"
        onClick={() => setIsGuideOpen(!guideOpen)}
        aria-expanded={guideOpen}
        aria-controls="map-guide"
      >
        <Styled.GuideIcon></Styled.GuideIcon>
        Guide
      </Styled.GuideLink>
    </Styled.Container>
  );
};

export default LegendHeader;  
