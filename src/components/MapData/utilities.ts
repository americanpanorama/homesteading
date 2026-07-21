import { Conflict, TimelinePlaceData, TimelineYearPlaceData } from '../../index.d';
import { ActivityTotals, MetricConfig, PlaceActivitySummary } from './types';

export const FIRST_MAP_DATA_YEAR = 1863;
export const LAST_MAP_DATA_YEAR = 1912;

export const ACTIVITY_METRICS: MetricConfig[] = [
  {
    label: 'Claims on federal lands',
    countKey: 'claims',
    acresKey: 'acres_claimed',
  },
  {
    label: 'Claims on Indian lands',
    countKey: 'claims_indian_lands',
    acresKey: 'acres_claimed_indian_lands',
  },
  {
    label: 'Patents after residency on federal lands',
    countKey: 'patents',
    acresKey: 'acres_patented',
  },
  {
    label: 'Patents after residency on Indian lands',
    countKey: 'patents_indian_lands',
    acresKey: 'acres_patented_indian_lands',
  },
  {
    label: 'Commutations under section 2301',
    countKey: 'commutations_2301',
    acresKey: 'acres_commuted_2301',
  },
  {
    label: 'Commutations under the June 15, 1880 act',
    countKey: 'commutations_18800615',
    acresKey: 'acres_commuted_18800615',
  },
  {
    label: 'Commutations on Indian lands',
    countKey: 'commutations_indian_lands',
    acresKey: 'acres_commuted_indian_lands',
  },
];

export const emptyTotals = (): ActivityTotals => ({
  claims: 0,
  acres_claimed: 0,
  claims_indian_lands: 0,
  acres_claimed_indian_lands: 0,
  patents: 0,
  acres_patented: 0,
  patents_indian_lands: 0,
  acres_patented_indian_lands: 0,
  commutations_2301: 0,
  acres_commuted_2301: 0,
  commutations_18800615: 0,
  acres_commuted_18800615: 0,
  commutations_indian_lands: 0,
  acres_commuted_indian_lands: 0,
});

export const getYearDatum = (place: TimelinePlaceData, year: number): TimelineYearPlaceData | undefined => (
  place.yearData.find(datum => datum.year === year)
);

export const totalsFromDatum = (datum?: TimelineYearPlaceData): ActivityTotals => {
  const totals = emptyTotals();

  if (!datum) {
    return totals;
  }

  ACTIVITY_METRICS.forEach(({ countKey, acresKey }) => {
    totals[countKey as keyof ActivityTotals] = Number(datum[countKey] || 0);
    totals[acresKey as keyof ActivityTotals] = Number(datum[acresKey] || 0);
  });

  return totals;
};

export const addTotals = (a: ActivityTotals, b: ActivityTotals): ActivityTotals => {
  const totals = emptyTotals();
  (Object.keys(totals) as (keyof ActivityTotals)[]).forEach((key) => {
    totals[key] = a[key] + b[key];
  });
  return totals;
};

export const totalClaims = (totals: ActivityTotals): number => (
  totals.claims + totals.claims_indian_lands
);

export const totalPatents = (totals: ActivityTotals): number => (
  totals.patents
  + totals.patents_indian_lands
  + totals.commutations_2301
  + totals.commutations_18800615
  + totals.commutations_indian_lands
);

export const totalCommutations = (totals: ActivityTotals): number => (
  totals.commutations_2301
  + totals.commutations_18800615
  + totals.commutations_indian_lands
);

export const totalAcres = (totals: ActivityTotals): number => (
  totals.acres_claimed
  + totals.acres_claimed_indian_lands
  + totals.acres_patented
  + totals.acres_patented_indian_lands
  + totals.acres_commuted_2301
  + totals.acres_commuted_18800615
  + totals.acres_commuted_indian_lands
);

export const summarizePlacesForYear = (
  places: TimelinePlaceData[],
  year: number,
): PlaceActivitySummary[] => places.map(place => {
  const currentDatum = getYearDatum(place, year);
  return {
    place,
    current: totalsFromDatum(currentDatum),
    previous: year > FIRST_MAP_DATA_YEAR ? totalsFromDatum(getYearDatum(place, year - 1)) : null,
    conflicts: currentDatum?.conflicts || [],
  };
});

export const summarizeNationalActivity = (
  summaries: PlaceActivitySummary[],
): { current: ActivityTotals; previous: ActivityTotals | null; conflicts: Conflict[] } => (
  summaries.reduce((acc, summary) => ({
    current: addTotals(acc.current, summary.current),
    previous: acc.previous && summary.previous ? addTotals(acc.previous, summary.previous) : null,
    conflicts: acc.conflicts.concat(summary.conflicts),
  }), {
    current: emptyTotals(),
    previous: summaries.some(summary => summary.previous) ? emptyTotals() : null,
    conflicts: [] as Conflict[],
  })
);

export const percentChangeLabel = (current: number, previous?: number | null): string => {
  if (previous === null || typeof previous === 'undefined') {
    return 'No prior year';
  }

  if (previous === 0) {
    return current === 0 ? 'No change' : 'New activity';
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(change) * 10) / 10;

  if (rounded === 0) {
    return 'No change';
  }

  return `${rounded.toLocaleString()}% ${change > 0 ? 'increase' : 'decrease'}`;
};

export const formatNumber = (value: number): string => Math.round(value).toLocaleString();

export const formatAcres = (value: number): string => `${formatNumber(value)} acres`;

export const formatDate = (date: string): string => {
  if (!date) {
    return 'No date';
  }

  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    return date;
  }

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};
