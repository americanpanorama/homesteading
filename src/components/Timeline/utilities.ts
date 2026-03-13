import * as d3 from 'd3';
// @ts-ignore
import us from '../../us';
import { ClaimsAndPatentsAcresType, ClaimsAndPatentsCountType, RouterParams, TimelineConflict, TimelinePlaceData, TimelineRowStyled, TimelineYearPlaceData } from '../../index.d';
import { colors } from '../../Constants';
import { acresValue, colorGradient, makeParams } from '../../utilities';
import { TimelineSortOption } from './types';

export const TIMELINE_YEAR_LABELS = [1870, 1880, 1890, 1900, 1910];
export const TIMELINE_GRID_YEARS = [1865, 1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910];
export const TIMELINE_SELECTABLE_YEARS = Array.from({ length: 50 }, (_, index) => index + 1863);
export const TIMELINE_ROW_HEIGHT = 25;

/**
 * The timeline uses a narrower left margin on phones because the state abbreviations are
 * much shorter than the full state or territory labels used on larger screens.
 */
export const getTimelineXScale = (width: number, isPhoneSize: boolean) => d3.scaleLinear()
  .domain([1862, 1912])
  .range([isPhoneSize ? 70 : 140, width - 25]);

/**
 * Produces the display label for a row, including the territory suffix used before statehood.
 */
export const getTimelineLabel = (
  place: TimelinePlaceData,
  isPhoneSize: boolean,
  stateTerr: string | undefined,
  yearNum: number,
): string => {
  if (isPhoneSize && !stateTerr) {
    return us.lookup(place.name).abbr;
  }

  const addTerritorySuffix = !stateTerr
    && place.name !== 'North Dakota'
    && place.name !== 'South Dakota'
    && (!us.lookup(place.name) || !us.lookup(place.name).statehood_year || yearNum < us.lookup(place.name).statehood_year);

  return `${place.name}${addTerritorySuffix ? ' Terr.' : ''}`;
};

/**
 * Sorting by descending percentage depends on the currently selected year and active acreage types,
 * so we derive that comparator once and reuse it across the row build.
 */
export const sortTimelinePlaces = (
  placeData: TimelinePlaceData[],
  sortBy: TimelineSortOption,
  yearNum: number,
  types: ClaimsAndPatentsAcresType[],
): TimelinePlaceData[] => [...placeData].sort((a, b) => {
  if (sortBy === 'alphabetical') {
    return a.name.localeCompare(b.name);
  }

  if (sortBy === 'descending') {
    const officeAData = a.yearData.find(yd => yd.year === yearNum);
    const officeBData = b.yearData.find(yd => yd.year === yearNum);
    const officeAPercent = (officeAData && officeAData.area) ? acresValue(officeAData, types) / officeAData.area : 0;
    const officeBPercent = (officeBData && officeBData.area) ? acresValue(officeBData, types) / officeBData.area : 0;
    return officeBPercent - officeAPercent;
  }

  if (sortBy === 'chronological') {
    return a.medianYearClaimsAcres - b.medianYearClaimsAcres;
  }

  return 0;
});

/**
 * Multiple conflicts can collapse onto the same x position in a row. We keep just one marker
 * per x coordinate so the row remains legible while still signaling that conflict occurred there.
 */
export const buildTimelineConflictMarkers = (
  yearData: TimelineYearPlaceData[],
  xScale: d3.ScaleLinear<number, number>,
): TimelineConflict[] => {
  const conflicts: TimelineConflict[] = [];

  yearData.forEach((yearDatum) => {
    if (!yearDatum.conflicts) {
      return;
    }

    yearDatum.conflicts.forEach((conflict) => {
      const x = xScale(conflict.start_date.year + (conflict.start_date.month - 1) / 12 + conflict.start_date.day / 365);
      if (conflicts.some(existingConflict => existingConflict.x === x)) {
        return;
      }

      const xRadius = Math.max(2.83, Math.sqrt(conflict.native_casualties + conflict.us_casualties) * 0.4);
      conflicts.push({
        x,
        strokeWidth: xRadius / 2,
        xRadius,
      });
    });
  });

  return conflicts;
};

interface BuildTimelineRowsArgs {
  placeData: TimelinePlaceData[];
  sortBy: TimelineSortOption;
  yearNum: number;
  stateTerr: string | undefined;
  isPhoneSize: boolean;
  width: number;
  params: RouterParams;
  types: ClaimsAndPatentsAcresType[];
  countTypes: ClaimsAndPatentsCountType[];
  xScale: d3.ScaleLinear<number, number>;
}

/**
 * Converts raw timeline place data into the SVG-friendly row model consumed by the row renderer.
 * Keeping this transformation out of the component makes the render path much easier to scan.
 */
export const buildTimelineRows = ({
  placeData,
  sortBy,
  yearNum,
  stateTerr,
  isPhoneSize,
  width,
  params,
  types,
  countTypes,
  xScale,
}: BuildTimelineRowsArgs): TimelineRowStyled[] => {
  const cellWidth = xScale(1870) - xScale(1869);

  return sortTimelinePlaces(placeData, sortBy, yearNum, types).map((place, index) => {
    const dataForSelectedYear = place.yearData.find(yd => yd.year === yearNum);
    const acres = dataForSelectedYear ? types.reduce((acc, type) => dataForSelectedYear[type] + acc, 0) : 0;
    const active = !!dataForSelectedYear && acres > 0;

    return {
      label: getTimelineLabel(place, isPhoneSize, stateTerr, yearNum),
      cells: place.yearData.map((yearDatum: TimelineYearPlaceData) => {
        const yearAcres = types.reduce((acc, type) => yearDatum[type] + acc, 0);
        return {
          year: yearDatum.year,
          x: xScale(yearDatum.year) + 0.25,
          width: cellWidth - 0.5,
          height: (yearDatum.area !== 0 && yearAcres > 0) ? 8 + 10 * Math.min(1, yearAcres * 20 / yearDatum.area) : 0,
          fill: colorGradient(yearAcres / yearDatum.area),
          fillOpacity: 1,
        };
      }),
      acres,
      number: dataForSelectedYear ? countTypes.reduce((acc, type) => dataForSelectedYear[type] + acc, 0) : 0,
      conflicts: buildTimelineConflictMarkers(place.yearData, xScale),
      showClashes: true,
      active,
      fill: active ? colors.mutedTextColor : colors.disabledTextColor,
      width,
      y: index * TIMELINE_ROW_HEIGHT,
      height: 20,
      labelSize: 14,
      emphasize: false,
      linkTo: stateTerr
        ? makeParams(params, [{ type: 'set_office', payload: place.name.replace(/[^a-zA-Z0-9]/g, '') }])
        : makeParams(params, [{ type: 'set_state', payload: us.lookup(place.name) ? us.lookup(place.name).abbr : '' }]),
    };
  });
};
