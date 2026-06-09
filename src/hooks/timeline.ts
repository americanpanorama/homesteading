import { useContext, useMemo } from 'react';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, TimelinePlaceData, TimelineYearPlaceData } from '../index.d';
import { buildTimelineRows, getTimelineXScale, TIMELINE_ROW_HEIGHT } from '../components/Timeline/utilities';
import { TimelineSortOption } from '../components/Timeline/types';
import { getTimelineConflictOfficeKey, useStateTimelineConflicts, useTimelineData } from './data';
import { useClaimsAndPatentsTypes, useLinkBuilder, useURLParams } from './routing';

interface UseTimelineChartArgs {
  sortBy?: TimelineSortOption;
  showInactiveAreasForSelectedYear?: boolean;
}

/**
 * The x-scale only depends on timeline width and the compact phone label mode,
 * so memoizing it here keeps downstream consumers from rebuilding the scale
 * unless the underlying dimensions actually change.
 */
export const useTimelineX = () => {
  const { timelineDimensions, isPhoneSize } = useContext(DimensionsContext) as Dimensions;
  const { width } = timelineDimensions;

  return useMemo(
    () => getTimelineXScale(width, isPhoneSize),
    [width, isPhoneSize],
  );
};

/**
 * Centralizes timeline chart derivation so the component can focus on controls and SVG structure.
 */
export const useTimelineChart = ({
  sortBy = 'alphabetical',
  showInactiveAreasForSelectedYear = true,
}: UseTimelineChartArgs = {}) => {
  const { timelineDimensions, isPhoneSize } = useContext(DimensionsContext) as Dimensions;
  const { width } = timelineDimensions;
  const params = useURLParams();
  const { stateTerr, yearNum } = params;
  const data = useTimelineData(stateTerr || 'national');
  const stateConflictsByOffice = useStateTimelineConflicts(stateTerr);
  const { acresTypes: types, countTypes } = useClaimsAndPatentsTypes();
  const buildLink = useLinkBuilder();
  const x = useTimelineX();

  const dataWithDistrictConflicts = useMemo<TimelinePlaceData[]>(() => {
    if (!stateTerr || stateConflictsByOffice.size === 0) {
      return data;
    }

    return data.map(place => {
      const conflicts = stateConflictsByOffice.get(getTimelineConflictOfficeKey(place.name));
      if (!conflicts || conflicts.length === 0 || place.yearData.length === 0) {
        return place;
      }

      const conflictsByYear = new Map<number, NonNullable<TimelineYearPlaceData['conflicts']>>();
      conflicts.forEach(conflict => {
        const yearConflicts = conflictsByYear.get(conflict.start_date.year) || [];
        yearConflicts.push(conflict);
        conflictsByYear.set(conflict.start_date.year, yearConflicts);
      });

      // Most clash markers line up with an existing district year. If a conflict
      // falls just outside the district's recorded claim years, keep it on the
      // row by attaching it to the first year datum; marker x-position still
      // comes from conflict.start_date, not from the host year datum.
      const firstYear = place.yearData[0].year;
      const yearData = place.yearData.map((yearDatum, index) => {
        const exactYearConflicts = conflictsByYear.get(yearDatum.year) || [];
        const orphanedConflicts = index === 0
          ? conflicts.filter(conflict => !place.yearData.some(datum => datum.year === conflict.start_date.year))
          : [];
        const nextConflicts = exactYearConflicts.concat(orphanedConflicts);

        if (nextConflicts.length === 0) {
          return yearDatum;
        }

        return {
          ...yearDatum,
          year: yearDatum.year || firstYear,
          conflicts: (yearDatum.conflicts || []).concat(nextConflicts),
        };
      });

      return {
        ...place,
        yearData,
      };
    });
  }, [data, stateConflictsByOffice, stateTerr]);

  const rows = useMemo(() => buildTimelineRows({
    placeData: dataWithDistrictConflicts,
    sortBy,
    yearNum,
    stateTerr,
    isPhoneSize,
    width,
    types,
    countTypes,
    xScale: x,
    showInactiveAreasForSelectedYear,
    buildLink,
  }), [buildLink, countTypes, dataWithDistrictConflicts, isPhoneSize, showInactiveAreasForSelectedYear, sortBy, stateTerr, types, width, x, yearNum]);

  return {
    x,
    rows,
    rowHeight: TIMELINE_ROW_HEIGHT,
  };
};
