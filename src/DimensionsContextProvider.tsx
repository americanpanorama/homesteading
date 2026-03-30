import React, { useEffect, useMemo, useState } from 'react';
import { DimensionsContext } from './DimensionsContext';
import * as Constants from './Constants';
import { Dimensions, MapSize } from './index.d';

type PhoneChromeHeights = {
  masthead: number;
  dateHeader: number;
  bottomBar: number;
};

const DEFAULT_PHONE_CHROME_HEIGHTS: PhoneChromeHeights = {
  masthead: 56,
  dateHeader: 92,
  bottomBar: 156,
};

const getPhoneChromeHeights = (): PhoneChromeHeights => {
  if (typeof document === 'undefined') {
    return DEFAULT_PHONE_CHROME_HEIGHTS;
  }

  const getHeight = (selector: string, fallback: number) => {
    const element = document.querySelector(selector);
    return element instanceof HTMLElement ? Math.round(element.getBoundingClientRect().height) : fallback;
  };

  return {
    masthead: getHeight('[data-phone-chrome="masthead"]', DEFAULT_PHONE_CHROME_HEIGHTS.masthead),
    dateHeader: getHeight('[data-phone-chrome="date-header"]', DEFAULT_PHONE_CHROME_HEIGHTS.dateHeader),
    bottomBar: getHeight('[data-phone-chrome="bottom-bar"]', DEFAULT_PHONE_CHROME_HEIGHTS.bottomBar),
  };
};

const DimensionsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapSize, setMapSize] = useState<MapSize>('default');
  const [phoneChromeHeights, setPhoneChromeHeights] = useState<PhoneChromeHeights>(DEFAULT_PHONE_CHROME_HEIGHTS);
  const [wideSidebarMeasuredWidth, setWideSidebarMeasuredWidth] = useState<number | null>(null);
  const [timelineHostMeasuredWidth, setTimelineHostMeasuredWidth] = useState<number | null>(null);

  const calculateDimensions = (): Dimensions => {
    const { innerWidth, innerHeight, visualViewport } = window;
    const { clientWidth, clientHeight } = document.documentElement || { clientWidth: null, clientHeight: null };
    const width = clientWidth || innerWidth || 1280;
    const height = Math.round(visualViewport?.height || clientHeight || innerHeight || 720);
    const isDesktop = width >= Constants.sizes.desktop;
    const isWideLayout = Constants.isWideViewport(width, height);
    const isCompactLayout = !isWideLayout;
    const sidebarWidth = isDesktop ? Math.max(width * 0.4, 600) : Math.max(width * 0.4, 360);
    const isExpandedMap = isWideLayout && mapSize === 'fullscreen';

    const mapHeights = {
      default: height - 75 - 150 - 25,
      nolegend: height - 75 - 150 - 25,
      fullscreen: isDesktop
        ? height - 75 - 150 - 25
        : isWideLayout
          ? height - 75 - 150 - 25
          : Math.max(width * 0.72, height * 0.58),
    };

    const isMobile = !isWideLayout;
    const isPhoneSize = width <= 500;
    const compactMapHeight = Math.max(
      260,
      height - phoneChromeHeights.masthead - phoneChromeHeights.dateHeader - phoneChromeHeights.bottomBar,
    );
    const mapDimensions = {
      // Expanded map mode reclaims the sidebar width while staying inside the app shell.
      width: !isWideLayout
        ? width
        : isExpandedMap
          ? width - 50
          : Math.max(320, width - sidebarWidth - 50),
      height: isWideLayout ? mapHeights[mapSize] : isCompactLayout ? compactMapHeight : width * 0.6,
      size: mapSize,
      setMapSize,
    };

    const timelineSidebarWidth = isWideLayout ? (wideSidebarMeasuredWidth || sidebarWidth) : width * 0.95;
    const timelineHostWidth = timelineHostMeasuredWidth || timelineSidebarWidth;
    const timelineHorizontalPadding = isWideLayout ? 8 : 20;
    const timelineDimensions = {
      // The sidebar now includes internal cards/padding around the timeline and
      // selected-place panel. Prefer the actual rendered timeline host width
      // when available so national and selected-place timelines both size to
      // the element they really live in.
      width: Math.max(320, timelineHostWidth - timelineHorizontalPadding),
      height: height - 46 - 46,
    };

    const officeBarchartDimensions = {
      xAxisHeight: 30,
      yAxisWidth: 70,
      padding: 40,
      paddingTop: 40,
      chartBodyHeight: 160,
      chartBodyWidth: timelineDimensions.width - 70 - 40,
      height: 160 + 40 + 30,
    };

    return {
      width,
      height,
      isMobile,
      isPhoneSize,
      mapDimensions,
      timelineDimensions,
      officeBarchartDimensions,
    };
  };

  const [dimensions, setDimensions] = useState<Dimensions>(() => calculateDimensions());

  useEffect(() => {
    const onResize = () => setDimensions(calculateDimensions());
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    setDimensions(calculateDimensions());

    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof ResizeObserver === 'undefined') {
      return;
    }

    const selectors = [
      '[data-phone-chrome="masthead"]',
      '[data-phone-chrome="date-header"]',
      '[data-phone-chrome="bottom-bar"]',
    ];
    const elements = selectors
      .map(selector => document.querySelector(selector))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (elements.length === 0) {
      return;
    }

    const updatePhoneChromeHeights = () => {
      const nextHeights = getPhoneChromeHeights();
      setPhoneChromeHeights(current => (
        current.masthead === nextHeights.masthead &&
        current.dateHeader === nextHeights.dateHeader &&
        current.bottomBar === nextHeights.bottomBar
      ) ? current : nextHeights);
    };

    const observer = new ResizeObserver(() => {
      updatePhoneChromeHeights();
    });

    elements.forEach(element => observer.observe(element));
    updatePhoneChromeHeights();

    return () => {
      observer.disconnect();
    };
  });

  useEffect(() => {
    if (typeof document === 'undefined' || typeof ResizeObserver === 'undefined') {
      return;
    }

    const timelineHost = document.querySelector('[data-timeline-host]');
    if (!(timelineHost instanceof HTMLElement)) {
      setTimelineHostMeasuredWidth(null);
      return;
    }

    const updateTimelineHostWidth = () => {
      const nextWidth = Math.round(timelineHost.getBoundingClientRect().width);
      setTimelineHostMeasuredWidth(current => (current === nextWidth ? current : nextWidth));
    };

    const observer = new ResizeObserver(() => {
      updateTimelineHostWidth();
    });

    observer.observe(timelineHost);
    updateTimelineHostWidth();

    return () => {
      observer.disconnect();
    };
  });

  useEffect(() => {
    setDimensions(calculateDimensions());
  }, [mapSize, phoneChromeHeights, timelineHostMeasuredWidth, wideSidebarMeasuredWidth]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof ResizeObserver === 'undefined') {
      return;
    }

    const sidebar = document.querySelector('[data-layout-sidebar]');
    if (!(sidebar instanceof HTMLElement)) {
      return;
    }

    const updateSidebarWidth = () => {
      const nextWidth = Math.round(sidebar.getBoundingClientRect().width);
      setWideSidebarMeasuredWidth(current => (current === nextWidth ? current : nextWidth));
    };

    const observer = new ResizeObserver(() => {
      updateSidebarWidth();
    });

    observer.observe(sidebar);
    updateSidebarWidth();

    return () => {
      observer.disconnect();
    };
  });

  const value = useMemo(() => dimensions, [dimensions]);

  return (
    <DimensionsContext.Provider value={value}>
      {children}
    </DimensionsContext.Provider>
  );
};

export default DimensionsContextProvider;
