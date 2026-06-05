import React from "react";
import * as Styled from "./styled";

const LegendHeader = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
      <Styled.GuideLink to="/guide">
        <Styled.GuideIcon></Styled.GuideIcon>
        Map Guide
      </Styled.GuideLink>
    </Styled.Container>
  );
};

export default LegendHeader;  