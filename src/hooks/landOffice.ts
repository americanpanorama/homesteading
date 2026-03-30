import { useMemo } from 'react';
// @ts-ignore
import us from '../us.js';
import { TimelinePlaceData, TimelinePlaceDataWithStats, TimelineYearPlaceData, TimelineYearPlaceDataWithStats, PlaceType } from '../index.d';
import { calculateDistrictYearStats } from '../utilities';
import { useTimelineData } from './data';
import { useURLParams } from './routing';

export interface LandOfficeViewModel {
  chartData: TimelinePlaceDataWithStats;
  selectedYearData?: TimelineYearPlaceDataWithStats;
  earliestYear: number;
  latestYear: number;
  earliestYearSYBoundaries: number;
  latestYearSYBoundaries: number;
  hasMultipleClaimTypes: boolean;
  hasMultiplePatentTypes: boolean;
}

const compareConflicts = (a: NonNullable<TimelineYearPlaceData['conflicts']>[number], b: NonNullable<TimelineYearPlaceData['conflicts']>[number]) => {
  if (a.start_date.month !== b.start_date.month) {
    return a.start_date.month - b.start_date.month;
  }
  return a.start_date.day - b.start_date.day;
};

/**
 * Rolls up office-level yearly records into one state or territory timeline so
 * the selected-state charts can share the same shape as office-level data.
 */
const aggregateStateTimelineData = (timelinePlaceData: TimelinePlaceData[], stateTerr: string): TimelinePlaceData => {
  const yearData: TimelineYearPlaceData[] = [];

  timelinePlaceData.forEach(districtData => {
    districtData.yearData.forEach(dyd => {
      const existingYear = yearData.find(yd => yd.year === dyd.year);

      if (!existingYear) {
        yearData.push({
          ...dyd,
          conflicts: dyd.conflicts || [],
        });
        return;
      }

      existingYear.claims += dyd.claims;
      existingYear.claims_indian_lands += dyd.claims_indian_lands;
      existingYear.acres_claimed += dyd.acres_claimed;
      existingYear.acres_claimed_indian_lands += dyd.acres_claimed_indian_lands;
      existingYear.patents += dyd.patents;
      existingYear.patents_indian_lands += dyd.patents_indian_lands;
      existingYear.acres_patented += dyd.acres_patented;
      existingYear.acres_patented_indian_lands += dyd.acres_patented_indian_lands;
      existingYear.commutations_2301 += dyd.commutations_2301;
      existingYear.acres_commuted_2301 += dyd.acres_commuted_2301;
      existingYear.commutations_18800615 += dyd.commutations_18800615;
      existingYear.acres_commuted_18800615 += dyd.acres_commuted_18800615;
      existingYear.commutations_indian_lands += dyd.commutations_indian_lands;
      existingYear.acres_commuted_indian_lands += dyd.acres_commuted_indian_lands;
      existingYear.area += dyd.area;
      existingYear.conflicts = existingYear.conflicts
        ?.concat(dyd.conflicts || [])
        .filter(Boolean)
        .sort(compareConflicts);
    });
  });

  return {
    name: us.lookup(stateTerr).name,
    stateOrTerritory: stateTerr,
    type: 'stateOrTerritory' as PlaceType,
    medianYearClaimsAcres: 2000,
    yearData,
  };
};

/**
 * Builds the common selected-place view model used by the summary text and the
 * claim/patent charts. Office views use one office record; state views are a
 * memoized rollup across every office in the selected state or territory.
 */
export const useLandOfficeData = (): LandOfficeViewModel | null => {
  const { stateTerr, office, yearNum } = useURLParams();
  const timelinePlaceData = useTimelineData(stateTerr || 'national');

  return useMemo(() => {
    if (!stateTerr || timelinePlaceData.length === 0) {
      return null;
    }

    const dataWithoutStats: TimelinePlaceData | undefined = office
      ? timelinePlaceData.find(pt => pt.stateOrTerritory === stateTerr && pt.name.replace(/[^a-zA-Z]/g, '') === office)
      : aggregateStateTimelineData(timelinePlaceData, stateTerr);

    if (!dataWithoutStats) {
      return null;
    }

    if (dataWithoutStats.yearData.length === 0) {
      return null;
    }

    const chartData: TimelinePlaceDataWithStats = {
      ...dataWithoutStats,
      total_claims_federal_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.claims + acc, 0),
      total_claims_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.claims_indian_lands + acc, 0),
      total_patents_federal_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.patents + acc, 0),
      total_patents_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.patents_indian_lands + acc, 0),
      total_commutations_2301: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_2301 + acc, 0),
      total_commutations_18800615: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_18800615 + acc, 0),
      total_commutations_indian_lands: dataWithoutStats.yearData.reduce((acc, curr) => curr.commutations_indian_lands + acc, 0),
      yearData: dataWithoutStats.yearData.map(yd => calculateDistrictYearStats(yd)),
    };

    const selectedYearData = chartData.yearData.find(yd => yd.year === yearNum);
    const earliestYear = Math.min(...chartData.yearData.map(d => d.year));
    const latestYear = Math.max(...chartData.yearData.map(d => d.year));
    const yearDataWithMatchingBoundaries = selectedYearData
      ? chartData.yearData.filter(d => d.area === selectedYearData.area)
      : chartData.yearData;
    const earliestYearSYBoundaries = Math.min(...yearDataWithMatchingBoundaries.map(d => d.year));
    const latestYearSYBoundaries = Math.max(...yearDataWithMatchingBoundaries.map(d => d.year));

    return {
      chartData,
      selectedYearData,
      earliestYear,
      latestYear,
      earliestYearSYBoundaries,
      latestYearSYBoundaries,
      hasMultipleClaimTypes: chartData.total_claims_federal_lands > 0 && chartData.total_claims_indian_lands > 0,
      hasMultiplePatentTypes: [
        chartData.total_patents_federal_lands > 0,
        chartData.total_patents_indian_lands > 0,
        chartData.total_commutations_2301 > 0,
        chartData.total_commutations_18800615 > 0,
        chartData.total_commutations_indian_lands > 0,
      ].filter(Boolean).length > 1,
    };
  }, [office, stateTerr, timelinePlaceData, yearNum]);
};
