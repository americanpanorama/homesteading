import { useCallback } from 'react';
import { ClaimsAndPatentsAcresType } from '../../index.d';
import { useURLParams } from '../../hooks';

const DEFAULT_YEAR = 1863;

interface TableLinkOverrides {
  year?: string | number | null;
  stateTerr?: string | null;
  view?: string | ClaimsAndPatentsAcresType[] | null;
  clearState?: boolean;
}

const sanitizeSegment = (value?: string | null): string | undefined => (
  value ? value.replace(/[^a-zA-Z0-9]/g, '') : undefined
);

const normalizeView = (view?: string | ClaimsAndPatentsAcresType[] | null): string | undefined => {
  if (!view) {
    return undefined;
  }

  return Array.isArray(view) ? view.join('-') : view;
};

export const buildTablePath = ({
  year,
  stateTerr,
  view,
}: {
  year?: string | number;
  stateTerr?: string;
  view?: string;
}) => {
  const segments = ['table'];
  const normalizedYear = typeof year === 'undefined' ? undefined : parseInt(year.toString(), 10);

  if (normalizedYear && normalizedYear !== DEFAULT_YEAR) {
    segments.push('year', normalizedYear.toString());
  }

  if (stateTerr) {
    segments.push('stateTerr', stateTerr);
  }

  if (view) {
    segments.push('view', view);
  }

  return `/${segments.join('/')}`;
};

export const useTableLinkBuilder = () => {
  const params = useURLParams();

  return useCallback((overrides: TableLinkOverrides = {}) => {
    const year = typeof overrides.year !== 'undefined'
      ? overrides.year || undefined
      : params.year;
    const stateTerr = overrides.clearState
      ? undefined
      : (typeof overrides.stateTerr !== 'undefined'
        ? sanitizeSegment(overrides.stateTerr)
        : params.stateTerr);
    const view = typeof overrides.view !== 'undefined'
      ? normalizeView(overrides.view)
      : params.view;

    return buildTablePath({
      year,
      stateTerr,
      view,
    });
  }, [params.stateTerr, params.view, params.year]);
};
