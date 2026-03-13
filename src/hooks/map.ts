import * as React from 'react';
import * as d3 from 'd3';
import States from '../../data/states.json';
import { MapViewContext, MapViewState } from '../components/Map/ViewContext';
import { ANIMATIONDURATION, CANVASSIZE } from '../Config';
import { ProjectedState } from '../index.d';
import { Point, ProjectedTownship, YearData } from '../components/Map.d';
import { calculateCenterAndDxDy, calculateTransform, getCenter } from '../components/Map/utilities';

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
    && projectedTownship.office.replace(/[^a-zA-Z]/g, '') === office
  )) || null;
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
