import React, { useState, useContext } from "react";
import { DimensionsContext } from "../../DimensionsContext";
import { useTimelineChart  } from "../../hooks";
import { Dimensions } from "../../index.d";
import * as Styled from "./styled";
import Controls from "./Controls/Index";
import YAxis from "./YAxis/Index";
import Heatmap from "./Heatmap/Index";
import { TimelineSortOption } from "./types";

const TimelineHeatmap = () => {
  const { timelineDimensions } = useContext(DimensionsContext) as Dimensions;
  const { height } = timelineDimensions;
  const [sortBy, setSortBy] = useState<TimelineSortOption>("alphabetical");
  const [showClashes, setShowClashes] = useState(false);
  const { rows, rowHeight } = useTimelineChart({ sortBy });

  return (
    <Styled.Container>
      <Styled.ScrollPanel $height={Math.min(height, rows.length * rowHeight + 340)}>
        <Controls
          sortBy={sortBy}
          onSortChange={setSortBy}
          showClashes={showClashes}
          onToggleClashes={setShowClashes}
        />

        <YAxis />

        <Heatmap
          sortBy={sortBy}
          showClashes={showClashes}
        />
      </Styled.ScrollPanel>
    </Styled.Container>
  );
};

export default TimelineHeatmap;
