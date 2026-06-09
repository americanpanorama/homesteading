import React, { useContext } from "react";
import * as Styled from "./styled";
import { TIMELINE_YEAR_LABELS, TIMELINE_SELECTABLE_YEARS } from "../utilities";
import { useLinkBuilder, useTimelineX, useURLParams } from "../../../hooks";
import { Link } from "react-router-dom";
import { Dimensions } from "../../../index.d";
import { DimensionsContext } from "../../../DimensionsContext";

const XAxis = () => {
  const x = useTimelineX();
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { yearNum } = params;
  const { timelineDimensions } = useContext(DimensionsContext) as Dimensions;
  const { width } = timelineDimensions;

  return (
    <svg
      width={width}
      height={35}
    >
      <Styled.AxisLabelsGroup>
        {/* These labels define the shared year anchors for both the header and the row grid. */}
        {TIMELINE_YEAR_LABELS.map((year: number) => (
          <Styled.Label
            x={x(year + 0.5)}
            y={25}
            key={`yearAxisFor${year}`}
          >
            {year}
          </Styled.Label>
        ))}

        <Styled.CurrentYearLabel
          x={x(yearNum + 0.5)}
          y={25}
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
            to={buildLink({ year })}
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

export default XAxis;
