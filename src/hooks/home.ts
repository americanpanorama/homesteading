import * as React from 'react';

export interface HomeMapOffice {
  office: string;
  state: string;
  d: string;
  values: number[];
}

export interface HomeMapData {
  years: number[];
  offices: HomeMapOffice[];
}

let homeMapDataCache: HomeMapData | null = null;
let homeMapDataRequest: Promise<HomeMapData> | null = null;

const fetchHomeMapData = async (): Promise<HomeMapData> => {
  if (homeMapDataCache) {
    return homeMapDataCache;
  }

  if (!homeMapDataRequest) {
    homeMapDataRequest = fetch(`${process.env.PUBLIC_URL}/static/homeMapClaims.json`)
      .then(response => response.json())
      .then((data: HomeMapData) => {
        homeMapDataCache = data;
        return data;
      });
  }

  return homeMapDataRequest;
};

export const useHomeMapData = () => {
  const [data, setData] = React.useState<HomeMapData | null>(homeMapDataCache);

  React.useEffect(() => {
    let isMounted = true;

    fetchHomeMapData().then(response => {
      if (isMounted) {
        setData(response);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};

/**
 * Advances the landing-page map once per second, but pauses in background tabs
 * and respects reduced-motion preferences.
 */
export const useAnimatedHomeMapYear = (yearCount: number, delay = 500) => {
  const [yearIndex, setYearIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(
    typeof document === 'undefined' || document.visibilityState === 'visible',
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion);
    };
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleVisibilityChange = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    setYearIndex(0);
  }, [yearCount]);

  React.useEffect(() => {
    if (yearCount <= 1 || prefersReducedMotion || !isVisible) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setYearIndex(currentYearIndex => (currentYearIndex + 1) % yearCount);
    }, delay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [delay, isVisible, prefersReducedMotion, yearCount]);

  return yearIndex;
};
