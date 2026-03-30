import * as React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import States from '../../data/states.json';
import { MapViewContext, MapViewState } from '../components/Map/ViewContext';
import { ANIMATIONDURATION, CANVASSIZE } from '../Config';
import { ProjectedState, TimelinePlaceData, TimelineYearPlaceData } from '../index.d';
import { Point, ProjectedTownship, YearData } from '../components/Map.d';
import {
  calculateCenterAndDxDy,
  calculateTransform,
  getCenter,
  getScaledFontSize,
  getScaledStrokeWidth,
} from '../components/Map/utilities';
import { useClaimsAndPatentsTypes } from './routing';
import { useTimelineData, useYearData } from './data';
import { useLinkBuilder, useURLParams } from './routing';
import { colorGradient } from '../utilities';

export interface IndianLandsPolygon {
  d: string;
  type: 'reservation' | 'unceded land' | 'open_res';
  opened?: {
    year: number;
    month: number;
    day: number;
  };
}

const indianLandsCache = new Map<number, IndianLandsPolygon[]>();
const indianLandsRequestCache = new Map<number, Promise<IndianLandsPolygon[]>>();

const FULL_STATE_OFFICES = ['IL', 'IN', 'OH', 'MS'] as const;

const formatOfficeLabel = (office: string) => office.replace(/([a-z.])([A-Z])/g, '$1 $2');
const normalizeOfficeName = (office: string) => office.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const normalizeOfficeAlias = (office: string) => normalizeOfficeName(office.replace(/\bCity\b/ig, ''));

const getVisualizedAcres = (
  projectedTownship: ProjectedTownship,
  acresTypes: ReturnType<typeof useClaimsAndPatentsTypes>['acresTypes'],
) => acresTypes.reduce((total, type) => total + projectedTownship[type], 0);

const getTimelineVisualizedAcres = (
  yearData: TimelineYearPlaceData,
  acresTypes: ReturnType<typeof useClaimsAndPatentsTypes>['acresTypes'],
) => acresTypes.reduce((total, type) => total + yearData[type], 0);

export const useMapView = (): MapViewState => {
  const mapView = React.useContext(MapViewContext);
  if (!mapView) {
    throw new Error('useMapView must be used within a MapViewContext.Provider');
  }
  return mapView;
};

interface UseMapViewportArgs {
  stateTerr?: string;
  office?: string;
  width: number;
  height: number;
  yearData: YearData;
}

interface MapViewportState {
  center: Point;
  scale: number;
  transform: string;
}

const DEFAULT_CENTER: Point = [CANVASSIZE * 0.42, CANVASSIZE / 2];

const getSelectedOfficeData = (
  offices: ProjectedTownship[],
  stateTerr?: string,
  office?: string,
): ProjectedTownship | null => {
  if (!stateTerr || !office) {
    return null;
  }

  return offices.find(projectedTownship => (
    projectedTownship.state === stateTerr
    && (
      normalizeOfficeName(projectedTownship.office) === normalizeOfficeName(office)
      || normalizeOfficeAlias(projectedTownship.office) === normalizeOfficeAlias(office)
    )
  )) || null;
};

const findTimelinePlaceForOffice = (
  officeName: string,
  officeTimelineData: TimelinePlaceData[],
) => {
  const normalizedOffice = normalizeOfficeName(officeName);
  const normalizedOfficeAlias = normalizeOfficeAlias(officeName);

  return officeTimelineData.find((timelinePlace) => {
    const normalizedTimelineName = normalizeOfficeName(timelinePlace.name);
    const normalizedTimelineAlias = normalizeOfficeAlias(timelinePlace.name);

    return (
      normalizedTimelineName === normalizedOffice
      || normalizedTimelineAlias === normalizedOfficeAlias
    );
  });
};

const getTimelineYearStats = (
  timelinePlace: TimelinePlaceData | undefined,
  yearNum: number,
) => timelinePlace?.yearData.find(yearData => yearData.year === yearNum);

const withSupplementedStats = (
  projectedTownship: ProjectedTownship,
  timelineYearStats?: TimelineYearPlaceData,
): ProjectedTownship => {
  if (!timelineYearStats) {
    return projectedTownship;
  }

  return {
    ...projectedTownship,
    ...timelineYearStats,
    // Keep the geometry-derived bounds/paths from yearData.
    area: timelineYearStats.area || projectedTownship.area,
  };
};

/**
 * Encodes the map framing rules for national, state, and office views in one place.
 * The different gutter/focus values reserve room for legend UI without hiding the map.
 */
const getTargetViewport = ({
  width,
  height,
  stateTerr,
  office,
  offices,
}: {
  width: number;
  height: number;
  stateTerr?: string;
  office?: string;
  offices: ProjectedTownship[];
}): MapViewportState => {
  if (!stateTerr) {
    const { scale, transform } = calculateTransform({ width, height, yGutter: 0.86, focusY: 0.62 });
    return {
      center: DEFAULT_CENTER,
      scale,
      transform,
    };
  }

  const selectedOfficeData = getSelectedOfficeData(offices, stateTerr, office);
  const selectedStateData = (States as ProjectedState[]).find(state => state.abbr === stateTerr);
  const placeData = office ? selectedOfficeData : selectedStateData;

  if (!placeData) {
    const { scale, transform } = calculateTransform({ width, height, yGutter: 0.86, focusY: 0.62 });
    return {
      center: DEFAULT_CENTER,
      scale,
      transform,
    };
  }

  const { scale, transform } = calculateTransform({
    ...calculateCenterAndDxDy(placeData.bounds),
    rotation: placeData.rotation,
    yGutter: office ? 0.56 : 0.72,
    xGutter: office ? 0.6 : 0.8,
    focusY: office ? 0.6 : 0.58,
    width,
    height,
  });

  return {
    center: getCenter(placeData.bounds),
    scale,
    transform,
  };
};

export const useMapViewport = ({
  stateTerr,
  office,
  width,
  height,
  yearData,
}: UseMapViewportArgs) => {
  const selectedOfficeData = React.useMemo(
    () => getSelectedOfficeData(yearData.offices, stateTerr, office),
    [office, stateTerr, yearData.offices],
  );

  const targetViewport = React.useMemo(() => getTargetViewport({
    width,
    height,
    stateTerr,
    office,
    offices: yearData.offices,
  }), [height, office, stateTerr, width, yearData.offices]);

  const [viewport, setViewport] = React.useState<MapViewportState>(targetViewport);
  const refTranslate = React.useRef<SVGGElement | null>(null);
  const hasAnimated = React.useRef(!stateTerr);
  const [isReady, setIsReady] = React.useState(!stateTerr);

  React.useEffect(() => {
    if (!isReady) {
      setViewport(targetViewport);
      setIsReady(true);
      hasAnimated.current = true;
    }
  }, [isReady, targetViewport]);

  React.useEffect(() => {
    if (!isReady || !refTranslate.current) {
      return;
    }

    if (viewport.transform === targetViewport.transform) {
      if (
        viewport.scale !== targetViewport.scale
        || viewport.center[0] !== targetViewport.center[0]
        || viewport.center[1] !== targetViewport.center[1]
      ) {
        setViewport(targetViewport);
      }
      return;
    }

    // Keep scale/center in sync with the next destination while the SVG transform animates.
    setViewport(currentViewport => ({
      ...currentViewport,
      center: targetViewport.center,
      scale: targetViewport.scale,
    }));

    const transition = d3.select(refTranslate.current)
      .interrupt()
      .transition()
      .duration(hasAnimated.current ? ANIMATIONDURATION : 0)
      .attr('transform', targetViewport.transform)
      .on('end', () => {
        setViewport(targetViewport);
      });

    return () => {
      d3.select(refTranslate.current).interrupt();
    };
  }, [isReady, targetViewport, viewport.center, viewport.scale, viewport.transform]);

  const rotation = React.useMemo(() => {
    if (selectedOfficeData) {
      return selectedOfficeData.rotation;
    }

    if (!stateTerr) {
      return -2;
    }

    return (States as ProjectedState[]).find(state => state.abbr === stateTerr)?.rotation || 0;
  }, [selectedOfficeData, stateTerr]);

  return {
    refTranslate,
    center: viewport.center,
    scale: viewport.scale,
    transform: viewport.transform,
    rotation,
    isReady,
  };
};

export interface MapStateLayerItem extends ProjectedState {
  fill: string;
  link: string;
  linkActive: boolean;
  selected: boolean;
}

export interface MapDistrictLayerItem {
  projectedTownship: ProjectedTownship;
  link: string;
  strokeWidth: number;
  fill: string;
}

export interface MapOfficeLabelPlacement {
  office: ProjectedTownship;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  strokeWidth: number;
  rotation: number;
}

interface MapDistrictLayerState {
  districts: MapDistrictLayerItem[];
  officeLabelPlacements: MapOfficeLabelPlacement[];
}

/**
 * Approximate label boxes in map coordinates so we can skip labels that would
 * collide once the current map transform is applied. Larger offices win.
 */
const getOfficeLabelPlacements = (
  offices: ProjectedTownship[],
  scale: number,
  rotation: number,
): MapOfficeLabelPlacement[] => {
  const placedBoxes: { left: number; right: number; top: number; bottom: number }[] = [];

  return [...offices]
    .sort((a, b) => b.area - a.area)
    .reduce((placements: MapOfficeLabelPlacement[], projectedTownship) => {
      const label = formatOfficeLabel(projectedTownship.office);
      const [x, y] = getCenter(projectedTownship.bounds);
      const fontSize = getScaledFontSize(scale, 11, 3, 12);
      const strokeWidth = getScaledStrokeWidth(scale, 3, 0.45, 1.35);
      const labelWidth = (label.length * fontSize * 0.56) / scale;
      const labelHeight = (fontSize * 1.25) / scale;
      const candidateBox = {
        left: x - labelWidth / 2,
        right: x + labelWidth / 2,
        top: y - labelHeight / 2,
        bottom: y + labelHeight / 2,
      };

      const collides = placedBoxes.some(box => !(
        candidateBox.right < box.left
        || candidateBox.left > box.right
        || candidateBox.bottom < box.top
        || candidateBox.top > box.bottom
      ));

      if (collides) {
        return placements;
      }

      placedBoxes.push(candidateBox);
      placements.push({
        office: projectedTownship,
        label,
        x,
        y,
        fontSize,
        strokeWidth,
        rotation,
      });
      return placements;
    }, []);
};

/**
 * Builds the list of state and territory boundaries for the map layer, including
 * aggregated fill stats and drill-down link state. Keeping this in a hook lets
 * the visual `States` layer focus on rendering instead of data shaping.
 */
export const useMapStates = (): MapStateLayerItem[] => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { stateTerr, yearNum } = params;
  const { acresTypes } = useClaimsAndPatentsTypes();
  const yearData = useYearData();
  const nationalTimelineData = useTimelineData('national');

  return React.useMemo(() => {
    const stateTimelineByAbbr = new Map(
      nationalTimelineData
        .filter(place => place.type === 'stateOrTerritory' && place.abbr)
        .map(place => [place.abbr!, place]),
    );

    return (States as ProjectedState[])
      // Only keep places that either have geometry for the year, have timeline activity, or are selected.
      .filter((projectedState) => {
        const hasOfficeGeometry = yearData.offices.some(projectedTownship => projectedTownship.state === projectedState.abbr);
        const timelinePlace = stateTimelineByAbbr.get(projectedState.abbr);
        const timelineYearStats = getTimelineYearStats(timelinePlace, yearNum);
        return hasOfficeGeometry || !!timelineYearStats || projectedState.abbr === stateTerr;
      })
      .map((projectedState) => {
        const timelinePlace = stateTimelineByAbbr.get(projectedState.abbr);
        const timelineYearStats = getTimelineYearStats(timelinePlace, yearNum);
        const stats = timelineYearStats ? {
          area: timelineYearStats.area,
          acres_visualized: getTimelineVisualizedAcres(timelineYearStats, acresTypes),
        } : yearData.offices
            .filter(projectedTownship => projectedTownship.state === projectedState.abbr)
            .reduce((acc, projectedTownship) => ({
              // Oklahoma districts do not span the full state, so use the real statewide area.
              area: projectedTownship.state === 'OK' ? 44735360 : acc.area + projectedTownship.area,
              acres_visualized: acc.acres_visualized + getVisualizedAcres(projectedTownship, acresTypes),
            }), {
              area: 0,
              acres_visualized: 0,
            });

        return {
          ...projectedState,
          stats,
          fill: ['IL', 'IN', 'MS', 'OH'].includes(projectedState.abbr)
            ? colorGradient(stats.acres_visualized / stats.area)
            : 'transparent',
          link: buildLink({ stateTerr: projectedState.abbr }),
          linkActive: projectedState.abbr !== stateTerr,
          selected: projectedState.abbr === stateTerr,
        };
      })
      .filter(projectedState => projectedState.stats?.acres_visualized > 0 || projectedState.selected)
      .sort((a, b) => {
        if (!a.stats || !b.stats) {
          return 0;
        }

        return (b.stats.acres_visualized / b.stats.area) - (a.stats.acres_visualized / a.stats.area);
      });
  }, [acresTypes, buildLink, nationalTimelineData, stateTerr, yearData.offices, yearNum]);
};

/**
 * Loads reservation and unceded-land polygons for the active map year.
 * Results are cached by year so toggling views or rerendering the map does not
 * trigger another network request for the same file.
 */
export const useMapReservations = (): IndianLandsPolygon[] => {
  const { yearNum } = useURLParams();
  const [polygons, setPolygons] = React.useState<IndianLandsPolygon[]>(() => (
    indianLandsCache.get(yearNum) || []
  ));

  React.useEffect(() => {
    let isCancelled = false;

    const cachedPolygons = indianLandsCache.get(yearNum);
    if (cachedPolygons) {
      setPolygons(cachedPolygons);
      return;
    }

    const inFlightRequest = indianLandsRequestCache.get(yearNum) || axios(
      `${process.env.PUBLIC_URL}/data/indianLandsYearData/${yearNum}.json`,
    )
      .then((response) => response.data as IndianLandsPolygon[])
      .then((responsePolygons) => {
        indianLandsCache.set(yearNum, responsePolygons);
        indianLandsRequestCache.delete(yearNum);
        return responsePolygons;
      })
      .catch((error) => {
        indianLandsRequestCache.delete(yearNum);
        throw error;
      });

    indianLandsRequestCache.set(yearNum, inFlightRequest);

    inFlightRequest
      .then((responsePolygons) => {
        if (!isCancelled) {
          setPolygons(responsePolygons);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setPolygons([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [yearNum]);

  return polygons;
};

/**
 * Builds the complete district-layer view model: sorted district polygons,
 * full-state overlays, and collision-filtered office labels for selected views.
 */
export const useMapDistricts = (): MapDistrictLayerState => {
  const { scale, rotation } = useMapView();
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { stateTerr, office, yearNum } = params;
  const { acresTypes } = useClaimsAndPatentsTypes();
  const yearData = useYearData();
  const nationalTimelineData = useTimelineData('national');
  const stateTimelineData = useTimelineData(stateTerr || '');
  const offices = React.useMemo(() => {
    const officesForYear = yearData.offices;

    return officesForYear.map((projectedTownship) => {
      if (stateTerr && projectedTownship.state === stateTerr) {
        const timelinePlace = findTimelinePlaceForOffice(projectedTownship.office, stateTimelineData);
        const timelineYearStats = getTimelineYearStats(timelinePlace, yearNum);
        return withSupplementedStats(projectedTownship, timelineYearStats);
      }

      // On the national map, single-office states can be supplemented from the state-level
      // timeline data without fetching every office file up front. This fixes places like
      // Idaho where the geometry exists in yearData but the per-office activity was flattened to 0.
      const officesInState = officesForYear.filter(officeInState => officeInState.state === projectedTownship.state);
      if (officesInState.length === 1) {
        const timelinePlace = nationalTimelineData.find(place => (
          place.type === 'stateOrTerritory'
          && place.abbr === projectedTownship.state
        ));
        const timelineYearStats = getTimelineYearStats(timelinePlace, yearNum);
        return withSupplementedStats(projectedTownship, timelineYearStats);
      }

      return projectedTownship;
    });
  }, [nationalTimelineData, stateTerr, stateTimelineData, yearData.offices, yearNum]);

  return React.useMemo(() => {
    const districts = [...offices]
      .filter((projectedTownship) => (
        getVisualizedAcres(projectedTownship, acresTypes) > 0
        || projectedTownship.state === stateTerr
      ))
      .sort((a, b) => {
        if (a.state === stateTerr && b.state === stateTerr) {
          return (
            (getVisualizedAcres(a, acresTypes) / a.area)
            - (getVisualizedAcres(b, acresTypes) / b.area)
          );
        }

        if (a.state === stateTerr) {
          return 1;
        }

        if (b.state === stateTerr) {
          return -1;
        }

        return 0;
      })
      .map((projectedTownship) => ({
        projectedTownship,
        link: buildLink({ office: projectedTownship.office }),
        strokeWidth: stateTerr === projectedTownship.state
          ? getScaledStrokeWidth(scale, 2.1, 0.35, 1.1)
          : getScaledStrokeWidth(scale, 0.95, 0.18, 0.65),
        fill: colorGradient(getVisualizedAcres(projectedTownship, acresTypes) / projectedTownship.area),
      }));

    const labeledOffices = office
      ? offices.filter(projectedTownship => (
        projectedTownship.state === stateTerr
        && projectedTownship.office.replace(/[^a-zA-Z]/g, '') === office
      ))
      : stateTerr
        ? offices.filter(projectedTownship => projectedTownship.state === stateTerr)
        : [];

    return {
      districts,
      officeLabelPlacements: getOfficeLabelPlacements(labeledOffices, scale, rotation),
    };
  }, [acresTypes, buildLink, office, offices, rotation, scale, stateTerr]);
};
