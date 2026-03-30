import * as React from 'react';
import axios from 'axios';
import { ProjectedTownship, ProjectedTownshipAllOffices, YearData, YearDataRaw } from '../components/Map.d';
import { TimelinePlaceData } from '../index.d';
import { useURLParams } from './routing';

const DEFAULT_YEAR_DATA: YearData = { offices: [], conflicts: [] };
const DEFAULT_YEAR = 1863;

const yearDataCache = new Map<string, YearData>();
const yearDataRequestCache = new Map<string, Promise<YearData>>();
const timelineDataCache = new Map<string, TimelinePlaceData[]>();
const timelineDataRequestCache = new Map<string, Promise<TimelinePlaceData[]>>();

const FULL_STATE_OFFICE_STATES = ['IL', 'IN', 'MS', 'OH'];

const isFlattenedOffice = (office: ProjectedTownship | ProjectedTownshipAllOffices): office is ProjectedTownship =>
  'tile_id' in office;

const transformFlattenedOffice = (year: string, office: ProjectedTownship): ProjectedTownship | null => {
  if ((office.tile_id && office.tile_id.slice(-8) >= `${year}0630`) || FULL_STATE_OFFICE_STATES.includes(office.state)) {
    return office;
  }

  return null;
};

const transformNestedOffice = (year: string, office: ProjectedTownshipAllOffices): ProjectedTownship | null => {
  const officeBoundaries = Array.isArray(office.office_boundaries) ? office.office_boundaries : [];
  const officeData = Array.isArray(office.data) ? office.data : [];
  const activeBoundary = FULL_STATE_OFFICE_STATES.includes(office.state)
    ? officeBoundaries[0]
    : officeBoundaries.find(boundary => boundary.tile_id && boundary.tile_id.slice(-8) >= `${year}0630`);

  if (!activeBoundary) {
    return null;
  }

  // Prefer the map-adjusted stats when they are present, while still supporting
  // older generated years that only include a single raw row.
  const officeDatum = officeData.find(datum => datum.adjustedForMap) || officeData.find(datum => !datum.adjustedForMap);
  if (!officeDatum) {
    return null;
  }

  const { adjustedForMap, ...officeStats } = officeDatum;
  void adjustedForMap;

  return {
    office: office.office,
    state: office.state,
    ...activeBoundary,
    ...officeStats,
  };
};

const transformYearData = (year: string, yearDataRaw: YearDataRaw): YearData => {
  const offices: ProjectedTownship[] = (Array.isArray(yearDataRaw.offices) ? yearDataRaw.offices : [])
    .reduce((acc: ProjectedTownship[], office) => {
      // Some checked-in years are already flattened for the app, while others
      // still use the generator's nested office/data shape. Normalize both here
      // so the map can render consistently regardless of how a year was produced.
      const normalizedOffice = isFlattenedOffice(office)
        ? transformFlattenedOffice(year, office)
        : transformNestedOffice(year, office);

      if (normalizedOffice) {
        acc.push(normalizedOffice);
      }

      return acc;
    }, []);

  return {
    offices,
    conflicts: Array.isArray(yearDataRaw.conflicts) ? yearDataRaw.conflicts : [],
  };
};

const fetchYearData = (year: string): Promise<YearData> => {
  const cached = yearDataCache.get(year);
  if (cached) {
    return Promise.resolve(cached);
  }

  const inFlight = yearDataRequestCache.get(year);
  if (inFlight) {
    return inFlight;
  }

  const request = axios(`${process.env.PUBLIC_URL}/data/yearData/${year}.json`)
    .then(response => transformYearData(year, response.data as YearDataRaw))
    .then(data => {
      yearDataCache.set(year, data);
      yearDataRequestCache.delete(year);
      return data;
    })
    .catch(error => {
      yearDataRequestCache.delete(year);
      throw error;
    });

  yearDataRequestCache.set(year, request);
  return request;
};

export const useYearData = (yearParam?: string | number): YearData => {
  const { year: yearFromParams } = useURLParams();
  const year = (typeof yearParam !== 'undefined' ? yearParam.toString() : yearFromParams) || DEFAULT_YEAR.toString();
  const [yearData, setYearData] = React.useState<YearData>(yearDataCache.get(year) || DEFAULT_YEAR_DATA);

  React.useEffect(() => {
    let isMounted = true;
    fetchYearData(year)
      .then(data => {
        if (isMounted) {
          setYearData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setYearData(DEFAULT_YEAR_DATA);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [year]);

  return yearData;
};

const fetchTimelineData = (place: string): Promise<TimelinePlaceData[]> => {
  const cached = timelineDataCache.get(place);
  if (cached) {
    return Promise.resolve(cached);
  }

  const inFlight = timelineDataRequestCache.get(place);
  if (inFlight) {
    return inFlight;
  }

  const request = axios(`${process.env.PUBLIC_URL}/data/timelineData/${place}.json`)
    .then(response => (Array.isArray(response.data) ? response.data as TimelinePlaceData[] : []))
    .then(data => {
      timelineDataCache.set(place, data);
      timelineDataRequestCache.delete(place);
      return data;
    })
    .catch(error => {
      timelineDataRequestCache.delete(place);
      throw error;
    });

  timelineDataRequestCache.set(place, request);
  return request;
};

export const useTimelineData = (place: string): TimelinePlaceData[] => {
  const [timelineData, setTimelineData] = React.useState<TimelinePlaceData[]>(timelineDataCache.get(place) || []);

  React.useEffect(() => {
    if (!place) {
      setTimelineData([]);
      return undefined;
    }

    let isMounted = true;
    fetchTimelineData(place)
      .then(data => {
        if (isMounted) {
          setTimelineData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTimelineData([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [place]);

  return timelineData;
};
