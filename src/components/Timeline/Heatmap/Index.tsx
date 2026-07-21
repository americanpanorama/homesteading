import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Row from "./Row/Index";
import { DimensionsContext } from "../../../DimensionsContext";
import { useLinkBuilder, useTimelineChart, useTimelineX, useURLParams } from "../../../hooks";
import { Dimensions } from "../../../index.d";
import * as Styled from "./styled";

import { TIMELINE_GRID_YEARS, TIMELINE_SELECTABLE_YEARS } from "../utilities";

const TimelineHeatmap = ({
  sortBy,
  showClashes,
  showInactiveAreasForSelectedYear,
}: {
  sortBy: "alphabetical" | "descending" | "chronological";
  showClashes: boolean;
  showInactiveAreasForSelectedYear: boolean;
}) => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { yearNum } = params;
  const { timelineDimensions } = useContext(DimensionsContext) as Dimensions;
  const { width } = timelineDimensions;
  const x = useTimelineX();

  const { rows, rowHeight } = useTimelineChart({ sortBy, showInactiveAreasForSelectedYear });

  if (!rows) return null;

  return (
    <Styled.RowsContainer>
      <svg
        width={width}
        height={rows.length * rowHeight + 50}
      >
        <g transform="translate(0 10)">
          {/* Grid lines stay separate from the header so the rows can scroll independently. */}
          {TIMELINE_GRID_YEARS.map((y: number) => (
            <line
              x1={x(y + 0.5)}
              x2={x(y + 0.5)}
              y1={0}
              y2={rows.length * rowHeight + 10}
              stroke="grey"
              strokeOpacity={0.3}
              key={`tickFor${y}`}
            />
          ))}

          {/* A little underlay to highlight the selected year */}
          <Styled.YearHighlight
            x1={x(yearNum + 0.5)}
            y1={-10}
            x2={x(yearNum + 0.5)}
            y2={rows.length * rowHeight + 10}
          />

          {rows.map(p => (
            <Row
              {...p}
              emphasize={false}
              width={width}
              labelSize={16}
              showClashes={showClashes}
              key={`timelineRowFor${p.label}`}
            />
          ))}

          {TIMELINE_SELECTABLE_YEARS.map(y => (
            <Link
              to={buildLink({ year: y })}
              aria-label={`Show fiscal year ${y}`}
              aria-current={yearNum === y ? 'page' : undefined}
              aria-hidden='true'
              tabIndex={-1}
              key={`linkFor${y}`}
            >
              <Styled.HitArea
                x={x(y)}
                y={0}
                width={x(1863) - x(1862)}
                height={rows.length * rowHeight}
                $active={false && yearNum === y}
              />
            </Link>
          ))}
        </g>
      </svg>
    </Styled.RowsContainer>
  );
};

export default TimelineHeatmap;
