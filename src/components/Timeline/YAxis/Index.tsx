import React, { useContext } from "react";
import * as Styled from "./styled";
import { TIMELINE_YEAR_LABELS, TIMELINE_SELECTABLE_YEARS } from "../utilities";
import { useTimelineX } from "../../../hooks/timeline";
import { makeParams } from "../../../utilities";
import { useURLParams } from "../../../hooks";
import { Link } from "react-router-dom";
import { Dimensions } from "../../../index.d";
import { DimensionsContext } from "../../../DimensionsContext";

const YAxis = () => {
  const x = useTimelineX();
  const params = useURLParams();
  const { yearNum } = params;
  const { timelineDimensions } = useContext(DimensionsContext) as Dimensions;
  const { width } = timelineDimensions;

  return (
    <svg
      width={width}
      height={65}
    >
      <Styled.AxisLabelsGroup transform="translate(0 18)">
        {/* These labels define the shared year anchors for both the header and the row grid. */}
        {TIMELINE_YEAR_LABELS.map((year: number) => (
          <Styled.Label
            x={x(year + 0.5)}
            y={34}
            key={`yearAxisFor${year}`}
          >
            {year}
          </Styled.Label>
        ))}

        <Styled.CurrentYearLabel
          x={x(yearNum + 0.5)}
          y={34}
        >
          {yearNum}
          <tspan
            dy="0.7em"
            x={x(yearNum + 0.5)}
          >
            ▾
          </tspan>
        </Styled.CurrentYearLabel>



        {TIMELINE_SELECTABLE_YEARS.map(year => (
          <Link
            to={makeParams(params, [{ type: "set_year", payload: year }])}
            key={`linkFor${year}`}
          >
            <Styled.HitArea
              x={x(year + 0.5)}
              y={0}
              width={x(1863) - x(1862)}
              height={52}
            />
          </Link>
        ))}
      </Styled.AxisLabelsGroup>
    </svg>
  );
};

export default YAxis;
