import React from "react";
import { useLinkBuilder, useURLParams } from "../../../../hooks";
import { ClaimsAndPatentsAcresType } from "../../../../index.d";
import Tooltip from "../../../Tooltip/Index";
import * as Styled from "./styled";

const claimsTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed", "acres_claimed_indian_lands"];
const patentTypes: ClaimsAndPatentsAcresType[] = ["acres_patented", "acres_patented_indian_lands", "acres_commuted_2301", "acres_commuted_18800615", "acres_commuted_indian_lands"];

const ActivityToggle = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { view } = params;

  const claimsSelected = !view || view.includes("claimed");
  const toggledViewLink = buildLink({
    view: claimsSelected ? patentTypes.join("-") : claimsTypes.join("-"),
  });
  return (
    <Styled.Container>
      <Styled.ActivityTooltip>
        <Tooltip text="A patent officially turned a land claim into the homesteader’s private property. Homesteaders registered claims for land, typically up to 160 acres in size. After living on and cultivating their parcel for five years they could then apply for a patent. Alternately, if homestead settlers did not wish to wait, they could buy the land at the government price of usually $1.25 per acre but up to $2.50 per acre in selected areas. These early purchases were known as “commutations.”" />
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
    </Styled.Container>

  )
};

export default ActivityToggle;
