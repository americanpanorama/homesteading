import * as React from 'react';
// @ts-ignore
import us from 'us';
import MiniMap from './MiniMap';
import { TimelineYearPlaceDataWithStats, PlaceType } from '../index.d';

interface Props {
  office: string;
  type: PlaceType;
  year: string;
  earliestYear: number;
  latestYear: number;
  earliestYearSYBoundaries: number;
  latestYearSYBoundaries: number;
  selectedYearData: TimelineYearPlaceDataWithStats;
}

const DistrictText = (props: Props) => {
  const {
    office,
    year,
    type,
    earliestYear,
    latestYear,
    earliestYearSYBoundaries,
    latestYearSYBoundaries,
    selectedYearData: syd,
  } = props;

  if (!syd) {
    return null;
  }

  return (
    <div>
      {(type === 'office') && (
        <p>
          The {office} district land office operated between <strong>{earliestYear}</strong> and <strong>{latestYear}</strong>
          {(earliestYear !== earliestYearSYBoundaries || latestYear !== latestYearSYBoundaries) ? (
            <React.Fragment>
              . It had the displayed boundaries between <strong>{earliestYearSYBoundaries}</strong> and <strong>{latestYearSYBoundaries}</strong>. The area of the district during these years was <strong>{Math.round(syd.area).toLocaleString()}</strong> acres ({Math.round(syd.area / 640).toLocaleString()} square miles).
            </React.Fragment>
          ) : (
            <React.Fragment>
              , always with the displayed boundaries. The area of the district during these years was <strong>{Math.round(syd.area).toLocaleString()}</strong> acres ({Math.round(syd.area / 640).toLocaleString()} square miles).
            </React.Fragment>
          )}
        </p>
      )}
      {(type === 'office') && (
      <MiniMap />
      )}
      <p>
        In {year}, <strong>{(syd.total_claims).toLocaleString()}</strong> claims were filed for <strong>{syd.total_acres_claimed.toLocaleString()}</strong> acres, {syd.area_claimed_percent}% of the area of the {(type === 'office') ? 'land office' : (us.lookup(office).statehood_year <= parseInt(year)) ? 'state' : 'territory'}
          {(syd.claims_indian_lands && syd.claims) ? (
            <React.Fragment>
              . <strong>{(syd.claims).toLocaleString()}</strong> ({syd.claims_federal_lands_percent}%) of those claims were on federal land; <strong>{(syd.claims_indian_lands).toLocaleString()}</strong> ({syd.claims_indian_lands_percent}%) on Indian lands.
            </React.Fragment> 
           ) : (
              <React.Fragment>
                , all on {(syd.claims) ? 'federal' : 'Indian'} lands.
              </React.Fragment>
           )
          }
      </p>
      {(syd.total_patents > 0) && (
        <p>
          <strong>{syd.total_patents.toLocaleString()}</strong> patents were issued that conveyed legal title to land.
          {(syd.total_patents_residency > 0) ? (
            <React.Fragment>
              {' '}<strong>{syd.total_patents_residency.toLocaleString()}</strong> ({syd.total_patents_residency_percent.toLocaleString()}%) patents were issued to individuals who had met the five-year residency requirement to satisfy their claim
              {(syd.patents && syd.patents_indian_lands > 0) ? (
                <React.Fragment>
                  {'. '}<strong>{syd.patents.toLocaleString()}</strong> of those patents were on federal land, <strong>{syd.patents_indian_lands.toLocaleString()}</strong> on Indian lands.
                </React.Fragment>
              ): (
                <React.Fragment>
                  {', '}all on {(syd.patents) ? 'federal' : 'Indian'} lands.
                </React.Fragment>
              )}
            </React.Fragment>
          ): null}
          {(syd.total_patents_commutations > 0) ? (
            <React.Fragment>
              {' '}<strong>{syd.total_patents_commutations.toLocaleString()}</strong> ({syd.total_patents_commutations_percent.toLocaleString()}%) patents were issued to individuals who commuted their claims early by paying $1.25 per acre
              {((syd.commutations_2301 + syd.commutations_18800615), syd.commutations_indian_lands) ? (
                <React.Fragment>
                  {'. '}<strong>{(syd.commutations_2301 + syd.commutations_18800615).toLocaleString()}</strong> of those commutations were on federal land, <strong>{syd.commutations_indian_lands.toLocaleString()}</strong> on Indian lands.
                </React.Fragment>
              ): (
                <React.Fragment>
                  {', '}all on {(syd.commutations_2301 + syd.commutations_18800615) ? 'federal' : 'Indian'} lands.
                </React.Fragment>
              )}
            </React.Fragment>
          ) : null}
        </p>
      )}

      {(syd.conflicts && syd.conflicts.length > 0) && (
        <React.Fragment>
          <p>
            <strong>{syd.conflicts.length}</strong> clashes, battles, or skirmishes occurred in the {(type === 'office') ? 'district': (us.lookup(office).statehood_year <= parseInt(year)) ? 'state' : 'territory'} in {year}: 
          </p>
          <table style={{ display: 'block', margin: '10px auto' }}>
            <thead>
              <tr>
                <td>date</td>
                <td>name</td>
                <td>nations</td>
                <td>native casualties</td>
                <td>US casualties</td>
              </tr>
            </thead>
            <tbody>

          {(syd.conflicts.map(conflict => (
            <tr
              key={conflict.names}
            >
              <td>{`${conflict.start_date.month}/${conflict.start_date.day}/${conflict.start_date.year}`}</td>
              <td>{conflict.names}</td>
              <td>{conflict.nations.join(', ')}</td>
              <td>{conflict.native_casualties}</td>
              <td>{conflict.us_casualties}</td>
            </tr>

          )))}

            </tbody>

          </table>
        </React.Fragment>
      )}
    </div>
  );
};

export default DistrictText;
