import * as React from "react";
import { DimensionsContext } from "../../../DimensionsContext";
import * as Constants from "../../../Constants";
import * as Styled from "./styled";
import { Dimensions } from "../../../index.d";
import IndianLandsLegend from "./IndianLands/Index";
import ConflictsLegend from "./Conflicts/Index";
import DistrictsLegend from "./Districts/Index";
import ActivityToggle from "./ActivityToggle/Index";
import LegendHeader from "./Header/Index";
import Guide from "./Guide/Index";


const Legend = () => {
  const { width, height } = React.useContext(DimensionsContext) as Dimensions;
  const isCompactLayout = !Constants.isWideViewport(width, height);
  const [collapsed, setCollapsed] = React.useState(isCompactLayout);
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  return (
    <Styled.Container
      $collapsed={collapsed}
      aria-label="Map legend"
    >
      <LegendHeader
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        guideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
      />
  
      <Styled.Panel
        id="map-legend-panel"
        $collapsed={collapsed || isGuideOpen}
      >
        <IndianLandsLegend />
        <ConflictsLegend />
        <DistrictsLegend />
        <ActivityToggle />
      </Styled.Panel>

      {isGuideOpen && <Guide setIsGuideOpen={setIsGuideOpen} />}
    </Styled.Container>
  );
};

export default Legend;
