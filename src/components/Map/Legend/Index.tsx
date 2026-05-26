import * as React from "react";
import { DimensionsContext } from "../../../DimensionsContext";
import { useLinkBuilder, useURLParams } from "../../../hooks";
import { heatmapGradientColors } from "../../../Constants";
import * as Constants from "../../../Constants";
import { ClaimsAndPatentsAcresType } from "../../../index.d";
import { useClaimsAndPatentsTypes } from "../../../hooks";
import * as Styled from "./styled";
import { Dimensions } from "../../../index.d";

const claimsTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed", "acres_claimed_indian_lands"];
const patentTypes: ClaimsAndPatentsAcresType[] = ["acres_patented", "acres_patented_indian_lands", "acres_commuted_2301", "acres_commuted_18800615", "acres_commuted_indian_lands"];

const clashSizes = [
  { label: "0-50", size: 10 },
  { label: "50-200", size: 14 },
  { label: "200-500", size: 18 },
  { label: "500+", size: 22 },
];

const Legend = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { view } = params;
  const { acresLabel } = useClaimsAndPatentsTypes();
  const { width, height } = React.useContext(DimensionsContext) as Dimensions;
  const isCompactLayout = !Constants.isWideViewport(width, height);
  const [collapsed, setCollapsed] = React.useState(isCompactLayout);

  // React.useEffect(() => {
  //   setCollapsed(isCompactLayout);
  // }, [isCompactLayout]);

  const claimsSelected = !view || view.includes("claimed");
  // The two buttons act as a mode toggle so users can quickly flip the map
  // and timeline between claims and patents while keeping the rest of the URL
  // state intact.
  const toggledViewLink = buildLink({
    view: claimsSelected ? patentTypes.join("-") : claimsTypes.join("-"),
  });

  return (
    <Styled.Container
      $collapsed={collapsed}
      aria-label="Map legend"
    >
      <Styled.HeaderBar>
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
      </Styled.HeaderBar>

      <Styled.Panel
        id="map-legend-panel"
        $collapsed={collapsed}
      >
        <Styled.IndianLands>
          <Styled.IndianLandsLabel>Indian Lands</Styled.IndianLandsLabel>
          <Styled.Reservations>
            <Styled.ReservationSwatch />
            Reservations
          </Styled.Reservations>
          <Styled.ReservationsOpened>
            <Styled.ReservationOpenedSwatch />
            Reservations opened to homesteading
          </Styled.ReservationsOpened>
          <Styled.Unceded>
            <Styled.UncededSwatch />
            Unceded Lands
          </Styled.Unceded>
        </Styled.IndianLands>

        <Styled.Conflicts>
          <Styled.ConflictsTooltip>
            <Styled.TooltipMark>i</Styled.TooltipMark>
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
        </Styled.Conflicts>

        <Styled.Districts>
          <Styled.DistrictLabel>{`% of area ${acresLabel} (${params.year})`}</Styled.DistrictLabel>
          <Styled.DistrictSymbols>
            <svg
              width={200}
              height={45}
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="legend-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  {heatmapGradientColors.map((color, i) => (
                    <stop
                      key={color}
                      offset={`${(i / (heatmapGradientColors.length - 1)) * 97}%`}
                      stopColor={color}
                    />
                  ))}
                  <stop
                    offset="100%"
                    stopColor={heatmapGradientColors[heatmapGradientColors.length - 1]}
                  />
                </linearGradient>
              </defs>
              <g transform="translate(10, 0)">
                <rect
                  x={0}
                  y={0}
                  width={180}
                  height={20}
                  fill="url(#legend-gradient)"
                />
                {[0, 0.01, 0.02, 0.03, 0.04, 0.05].map((value, i) => (
                  <text
                    key={value}
                    x={i * 36}
                    y={35}
                    fontSize={12}
                    fontWeight={300}
                    stroke="grey"
                    textAnchor="middle"
                  >
                    {(value * 100).toFixed(0)}%{value === 0.05 && "+"}
                  </text>
                ))}
              </g>
            </svg>
          </Styled.DistrictSymbols>
        </Styled.Districts>

        <Styled.Activity>
          <Styled.ActivityTooltip>
            <Styled.TooltipMark>i</Styled.TooltipMark>
          </Styled.ActivityTooltip>
          <Styled.ActivityLabel>Homesteading activity</Styled.ActivityLabel>
          <Styled.ActivitySymbols aria-label="Map data type selector">
            <Styled.ToggleLink
              to={toggledViewLink}
              $selected={claimsSelected}
              aria-current={claimsSelected ? "page" : undefined}
            >
              Claims
            </Styled.ToggleLink>
            <Styled.ToggleLink
              to={toggledViewLink}
              $selected={!claimsSelected}
              aria-current={!claimsSelected ? "page" : undefined}
            >
              Patents
            </Styled.ToggleLink>
          </Styled.ActivitySymbols>
        </Styled.Activity>
      </Styled.Panel>
    </Styled.Container>
  );
};

export default Legend;
