import React from "react";
import { useNavigate } from "react-router-dom";
import { useLinkBuilder, useURLParams } from "../../../../hooks";
import { ClaimsAndPatentsAcresType } from "../../../../index.d";
import Tooltip from "../../../Tooltip/Index";
import Claims from "./FilterTooltips/Claims";
import * as Styled from "./styled";

interface FilterOption {
  label: string;
  types: ClaimsAndPatentsAcresType[];
}

const claimsFederalTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed"];
const claimsIndianTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed_indian_lands"];
const patentResidencyFederalTypes: ClaimsAndPatentsAcresType[] = ["acres_patented"];
const patentResidencyIndianTypes: ClaimsAndPatentsAcresType[] = ["acres_patented_indian_lands"];
const patentCommutationFederalTypes: ClaimsAndPatentsAcresType[] = ["acres_commuted_2301", "acres_commuted_18800615"];
const patentCommutationIndianTypes: ClaimsAndPatentsAcresType[] = ["acres_commuted_indian_lands"];

const getValue = (types: ClaimsAndPatentsAcresType[]) => types.join("-");

const getClaimsFilterOptions = (isIndianLandsYear: boolean): FilterOption[] => {
  if (!isIndianLandsYear) {
    return [
      { label: "All Claims", types: claimsFederalTypes },
    ];
  }

  return [
    { label: "All Claims", types: [...claimsFederalTypes, ...claimsIndianTypes] },
    { label: "on Federal Lands", types: claimsFederalTypes },
    { label: "on Indian Lands", types: claimsIndianTypes },
  ];
};

const getPatentFilterOptions = (isIndianLandsYear: boolean): FilterOption[] => {
  const residencyTypes = isIndianLandsYear
    ? [...patentResidencyFederalTypes, ...patentResidencyIndianTypes]
    : patentResidencyFederalTypes;
  const commutationTypes = isIndianLandsYear
    ? [...patentCommutationFederalTypes, ...patentCommutationIndianTypes]
    : patentCommutationFederalTypes;
  const allPatentTypes = isIndianLandsYear
    ? [...residencyTypes, ...commutationTypes]
    : [...patentResidencyFederalTypes, ...patentCommutationFederalTypes];
  const options = [
    { label: "All Patents", types: allPatentTypes },
    { label: "from Residency", types: residencyTypes },
    { label: "from Commutations", types: commutationTypes },
  ];

  if (!isIndianLandsYear) {
    return options;
  }

  return [
    ...options,
    { label: "on Federal Lands", types: [...patentResidencyFederalTypes, ...patentCommutationFederalTypes] },
    { label: "on Indian Lands", types: [...patentResidencyIndianTypes, ...patentCommutationIndianTypes] },
  ];
};

const ActivityToggle = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const navigate = useNavigate();
  const { view, isIndianLandsYear, yearNum } = params;

  const claimsSelected = !view || view.includes("claimed");
  const claimsFilterOptions = getClaimsFilterOptions(isIndianLandsYear);
  const patentFilterOptions = getPatentFilterOptions(isIndianLandsYear);
  const filterOptions = claimsSelected ? claimsFilterOptions : patentFilterOptions;
  const activeView = view || getValue(claimsFilterOptions[0].types);
  const selectedFilterValue = filterOptions.some(option => getValue(option.types) === activeView)
    ? activeView
    : getValue(filterOptions[0].types);
  const filterTooltipText = claimsSelected
    ? "Choose whether the map includes all claims, claims on federal lands, or claims on Indian lands when those records are available."
    : "Choose whether the map includes all patents, patents from residency, patents from commutations, or patents grouped by land status when those records are available.";

  return (
    <Styled.Container>
      <Styled.ActivityTooltip>
        <Tooltip text="A patent officially turned a land claim into the homesteader’s private property. Homesteaders registered claims for land, typically up to 160 acres in size. After living on and cultivating their parcel for five years they could then apply for a patent. Alternately, if homestead settlers did not wish to wait, they could buy the land at the government price of usually $1.25 per acre but up to $2.50 per acre in selected areas. These early purchases were known as “commutations.”" />
      </Styled.ActivityTooltip>
      <Styled.ActivityLabel>Homesteading activity</Styled.ActivityLabel>
      <Styled.ActivitySymbols aria-label="Map data type selector">
        <Styled.ToggleLink
          to={buildLink({ view: getValue(claimsFilterOptions[0].types) })}
          $selected={claimsSelected}
          aria-current={claimsSelected ? "page" : undefined}
        >
          Claims
        </Styled.ToggleLink>
        <Styled.ToggleLink
          to={buildLink({ view: getValue(patentFilterOptions[0].types) })}
          $selected={!claimsSelected}
          aria-current={!claimsSelected ? "page" : undefined}
        >
          Patents
        </Styled.ToggleLink>
      </Styled.ActivitySymbols>
      {(yearNum >= 1890 || !claimsSelected) && (
        <>
      <Styled.FilterLabel htmlFor="homesteading-activity-filter">Filter by</Styled.FilterLabel>
        <Styled.FilterRow>
          {/* {claimsSelected && params.yearNum >= 1890 && (
          <Styled.FilterTooltip>
            <Tooltip text={<Claims />} />
          </Styled.FilterTooltip>
        )} */}

        
          <Styled.FilterSelect
            id="homesteading-activity-filter"
            value={selectedFilterValue}
            disabled={filterOptions.length === 1}
            onChange={event => navigate(buildLink({ view: event.target.value }))}
          >
            {filterOptions.map(option => (
              <option key={getValue(option.types)} value={getValue(option.types)}>
                {option.label}
              </option>
            ))}
          </Styled.FilterSelect>
          </Styled.FilterRow>
          </>
      )}
    </Styled.Container>

  )
};

export default ActivityToggle;
