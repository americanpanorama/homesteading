import { useContext, useMemo } from 'react';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions } from '../index.d';
import { buildTimelineRows, getTimelineXScale, TIMELINE_ROW_HEIGHT } from '../components/Timeline/utilities';
import { TimelineSortOption } from '../components/Timeline/types';
import { useTimelineData } from './data';
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
  const { acresTypes: types, countTypes } = useClaimsAndPatentsTypes();
  const buildLink = useLinkBuilder();
  const x = useTimelineX();

  const rows = useMemo(() => buildTimelineRows({
    placeData: data,
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
  }), [buildLink, countTypes, data, isPhoneSize, showInactiveAreasForSelectedYear, sortBy, stateTerr, types, width, x, yearNum]);

  return {
    x,
    rows,
    rowHeight: TIMELINE_ROW_HEIGHT,
  };
};
