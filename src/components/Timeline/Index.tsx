import React, { useState, useContext } from "react";
import { DimensionsContext } from "../../DimensionsContext";
import { useTimelineChart  } from "../../hooks";
import { Dimensions } from "../../index.d";
import * as Styled from "./styled";
import Controls from "./Controls/Index";
import XAxis from "./XAxis/Index";
import Heatmap from "./Heatmap/Index";
import { TimelineSortOption } from "./types";
import { useTableLinkBuilder } from "../Table/routing";

const TimelineHeatmap = () => {
  const { timelineDimensions } = useContext(DimensionsContext) as Dimensions;
  const { height } = timelineDimensions;
  const buildTableLink = useTableLinkBuilder();
  const [sortBy, setSortBy] = useState<TimelineSortOption>("alphabetical");
  const [showClashes, setShowClashes] = useState(false);
  const [showInactiveAreasForSelectedYear, setShowInactiveAreasForSelectedYear] = useState(true);
  const { rows, rowHeight } = useTimelineChart({ sortBy, showInactiveAreasForSelectedYear });

  return (
    <Styled.Container data-timeline-host>
      <Styled.ScrollPanel $height={Math.min(height, rows.length * rowHeight + 340)}>
        <Controls
          sortBy={sortBy}
          onSortChange={setSortBy}
          showClashes={showClashes}
          onToggleClashes={setShowClashes}
          showInactiveAreasForSelectedYear={showInactiveAreasForSelectedYear}
          onToggleInactiveAreasForSelectedYear={setShowInactiveAreasForSelectedYear}
        />
      <Styled.TableAccessLink to={buildTableLink()}>
        <Styled.TableIcon aria-hidden='true' />
        Tabular View
      </Styled.TableAccessLink>

        <XAxis />

        <Heatmap
          sortBy={sortBy}
          showClashes={showClashes}
          showInactiveAreasForSelectedYear={showInactiveAreasForSelectedYear}
        />
      </Styled.ScrollPanel>
    </Styled.Container>
  );
};

export default TimelineHeatmap;
