import * as React from 'react';
// @ts-ignore
import us from 'us';
import MiniMap from '../../Map/MiniMap';
import { useURLParams } from '../../../hooks';
import { LandOfficeViewModel } from '../../../hooks/landOffice';
import * as Styled from './styled';
import { DimensionsContext } from '../../../DimensionsContext';
import { Dimensions } from '../../../index.d';

const SelectedPlaceSummary = ({ data }: { data: LandOfficeViewModel }) => {
  const { isPhoneSize } = React.useContext(DimensionsContext) as Dimensions;
  const { year, yearNum } = useURLParams();
  const { chartData, selectedYearData, earliestYear, latestYear, earliestYearSYBoundaries, latestYearSYBoundaries } = data;

  if (!selectedYearData) {
    return null;
  }

  const isOffice = chartData.type === 'office';
  const isState = !isOffice && us.lookup(chartData.name)?.statehood_year <= yearNum;
  const isSingleYearOffice = isOffice && earliestYear === latestYear;

  return (
    <Styled.Container $isOffice={isOffice}>
      <Styled.Copy>
        {isOffice && (
          <Styled.Paragraph>
            {isSingleYearOffice ? (
              <React.Fragment>
                The {chartData.name} district land office operated only in {earliestYear}. The area of the district was <Styled.Highlight>{Math.round(selectedYearData.area).toLocaleString()}</Styled.Highlight> acres ({Math.round(selectedYearData.area / 640).toLocaleString()} square miles).
              </React.Fragment>
            ) : (
              <React.Fragment>
                The {chartData.name} district land office operated between <Styled.Highlight>{earliestYear}</Styled.Highlight> and <Styled.Highlight>{latestYear}</Styled.Highlight>
                {(earliestYear !== earliestYearSYBoundaries || latestYear !== latestYearSYBoundaries) ? (
                  <React.Fragment>
                    . It had the displayed boundaries between <Styled.Highlight>{earliestYearSYBoundaries}</Styled.Highlight> and <Styled.Highlight>{latestYearSYBoundaries}</Styled.Highlight>. The area of the district during these years was <Styled.Highlight>{Math.round(selectedYearData.area).toLocaleString()}</Styled.Highlight> acres ({Math.round(selectedYearData.area / 640).toLocaleString()} square miles).
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    , always with the displayed boundaries. The area of the district during these years was <Styled.Highlight>{Math.round(selectedYearData.area).toLocaleString()}</Styled.Highlight> acres ({Math.round(selectedYearData.area / 640).toLocaleString()} square miles).
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Styled.Paragraph>
        )}

        <Styled.Paragraph>
          In {year}, <Styled.Highlight>{selectedYearData.total_claims.toLocaleString()}</Styled.Highlight> claims were filed for <Styled.Highlight>{selectedYearData.total_acres_claimed.toLocaleString()}</Styled.Highlight> acres, {selectedYearData.area_claimed_percent}% of the area of the {isOffice ? 'land office' : isState ? 'state' : 'territory'}
          {(selectedYearData.claims_indian_lands && selectedYearData.claims) ? (
            <React.Fragment>
              . <Styled.Highlight>{selectedYearData.claims.toLocaleString()}</Styled.Highlight> ({selectedYearData.claims_federal_lands_percent}%) of those claims were on federal land; <Styled.Highlight>{selectedYearData.claims_indian_lands.toLocaleString()}</Styled.Highlight> ({selectedYearData.claims_indian_lands_percent}%) on Indian lands.
            </React.Fragment>
          ) : (
            <React.Fragment>
              , all on {(selectedYearData.claims) ? 'federal' : 'Indian'} lands.
            </React.Fragment>
          )}
        </Styled.Paragraph>

        {(selectedYearData.total_patents > 0) && (
          <Styled.Paragraph>
            <Styled.Highlight>{selectedYearData.total_patents.toLocaleString()}</Styled.Highlight> patents were issued that conveyed legal title to land.
            {(selectedYearData.total_patents_residency > 0) ? (
              <React.Fragment>
                {' '}<Styled.Highlight>{selectedYearData.total_patents_residency.toLocaleString()}</Styled.Highlight> ({selectedYearData.total_patents_residency_percent.toLocaleString()}%) followed the five-year residency requirement
                {(selectedYearData.patents && selectedYearData.patents_indian_lands > 0) ? (
                  <React.Fragment>
                    {'. '}<Styled.Highlight>{selectedYearData.patents.toLocaleString()}</Styled.Highlight> of those patents were on federal land, <Styled.Highlight>{selectedYearData.patents_indian_lands.toLocaleString()}</Styled.Highlight> on Indian lands.
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {', '}all on {(selectedYearData.patents) ? 'federal' : 'Indian'} lands.
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
            {(selectedYearData.total_patents_commutations > 0) ? (
              <React.Fragment>
                {' '}<Styled.Highlight>{selectedYearData.total_patents_commutations.toLocaleString()}</Styled.Highlight> ({selectedYearData.total_patents_commutations_percent.toLocaleString()}%) were commutations
                {((selectedYearData.commutations_2301 + selectedYearData.commutations_18800615) || selectedYearData.commutations_indian_lands) ? (
                  <React.Fragment>
                    {'. '}<Styled.Highlight>{(selectedYearData.commutations_2301 + selectedYearData.commutations_18800615).toLocaleString()}</Styled.Highlight> of those commutations were on federal land, <Styled.Highlight>{selectedYearData.commutations_indian_lands.toLocaleString()}</Styled.Highlight> on Indian lands.
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {', '}all on {(selectedYearData.commutations_2301 + selectedYearData.commutations_18800615) ? 'federal' : 'Indian'} lands.
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : null}
          </Styled.Paragraph>
        )}

        {(selectedYearData.conflicts && selectedYearData.conflicts.length > 0) && (
          <Styled.ConflictNote>
            <Styled.Highlight>{selectedYearData.conflicts.length}</Styled.Highlight>
            clashes, battles, or skirmishes occurred in the {isOffice ? 'district' : isState ? 'state' : 'territory'} in {year}.
          </Styled.ConflictNote>
        )}
      </Styled.Copy>

      {isOffice && !isPhoneSize && (
        <Styled.MiniMapPanel>
          <MiniMap />
        </Styled.MiniMapPanel>
      )}
    </Styled.Container>
  );
};

export default SelectedPlaceSummary;
