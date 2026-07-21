import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DimensionsContextProvider from './DimensionsContextProvider';
import { DimensionsContext } from './DimensionsContext';
import AppChrome from './components/AppChrome';
import AppLayout from './components/Layout';
import Home from './components/Home/Index';
import Introduction from './components/Text/Introduction/Index';
import IndigenousDispossession from './components/Text/IndigenousDispossession/Index';
import About from './components/Text/About/Index';
import TimelineTable from './components/Table/Index';
import MapData from './components/MapData/Index';
import DocumentTitle from './components/DocumentTitle/Index';

import { useLinkBuilder, useURLParams } from './hooks';
import { Dimensions } from './index.d';
import { AppContainer, BaseStyles, SkipLink, SkipLinksContainer } from './styled';

const DefaultOfficeRedirect = ({ office }: { office: string }) => {
  const { year } = useURLParams();
  return <Navigate to={`/year/${year}/stateTerr/${office === 'Springfield' ? 'IL' : 'IN'}/office/${office}`} replace />;
};

const CanonicalRouteRedirect = () => {
  const buildLink = useLinkBuilder();
  return <Navigate to={buildLink()} replace />;
};

const SkipLinks = () => {
  const { pathname } = useLocation();
  const isHomePath = pathname === '/';
  const isMapPath = pathname.startsWith('/year') || pathname.startsWith('/stateTerr');
  const isTablePath = pathname.startsWith('/table');
  const isMapDataPath = pathname.startsWith('/map-data');

  if (isHomePath) return null;

  return (
    <SkipLinksContainer aria-label='Skip links'>
      <SkipLink href='#site-navigation'>Skip to site navigation</SkipLink>
      {isMapPath && (
        <>
          <SkipLink href='#timeline-data'>Skip to timeline and data</SkipLink>
          <SkipLink href='#main-content'>Skip to map</SkipLink>
        </>
      )}
      {isTablePath && (
        <SkipLink href='#timeline-data'>Skip to data table</SkipLink>
      )}
      {isMapDataPath && (
        <SkipLink href='#main-content'>Skip to map data</SkipLink>
      )}
      {!isMapPath && !isTablePath && !isMapDataPath && (
        <SkipLink href='#main-content'>Skip to main content</SkipLink>
      )}
    </SkipLinksContainer>
  );
};

const AppShell = () => {
  const { mapDimensions } = useContext(DimensionsContext) as Dimensions;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };
    const handlePointerInput = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handlePointerInput);
    window.addEventListener('pointerdown', handlePointerInput);
    window.addEventListener('touchstart', handlePointerInput);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handlePointerInput);
      window.removeEventListener('pointerdown', handlePointerInput);
      window.removeEventListener('touchstart', handlePointerInput);
    };
  }, []);

  const combine = (a: string[], min: number): string[] => {
    const fn = function (n: number, src: any, got: any, all: any) {
      if (n === 0) {
        if (got.length > 0) {
          all[all.length] = got;
        }
        return;
      }
      for (var j = 0; j < src.length; j++) {
        fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
      }
      return;
    };
    const all: any = [];
    for (var i = min; i < a.length; i++) {
      fn(i, a, [], all);
    }
    all.push(a);
    return all.map((d: any) => d.join('')).reverse();
  };

  const canonicalMapPaths = ['', ...combine(['/stateTerr/:stateTerr', '/office/:office', '/panel/:panel', '/view/:view', '/fullOpacity/:fullOpacity'], 1)]
    .map(path => `/year/:year${path}`);
  const canonicalTablePaths = ['', ...combine(['/year/:year', '/stateTerr/:stateTerr', '/view/:view'], 1)]
    .map(path => `/table${path}`);
  const legacyMapPaths = combine(['/map/year/:year', '/map/stateTerr/:stateTerr', '/map/office/:office', '/map/panel/:panel', '/map/view/:view', '/map/fullOpacity/:fullOpacity', '/map'], 1);
  const legacyTextPaths = legacyMapPaths.map(d => `/:text${d}`);

  return (
    <AppContainer $isMapFullscreen={mapDimensions.size === 'fullscreen'}>
      <BaseStyles />
      <Router basename={process.env.PUBLIC_URL}>
        <DocumentTitle />
        <SkipLinks />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route element={<AppChrome />}>
            <Route
              path='stateTerr/IL'
              element={<Navigate to='/year/1863/stateTerr/IL/office/Springfield' replace />}
            />
            <Route
              path='year/:year/stateTerr/IL'
              element={<DefaultOfficeRedirect office='Springfield' />}
            />
            <Route
              path='stateTerr/IN'
              element={<Navigate to='/year/1863/stateTerr/IN/office/Indianapolis' replace />}
            />
            <Route
              path='year/:year/stateTerr/IN'
              element={<DefaultOfficeRedirect office='Indianapolis' />}
            />
            <Route
              path='introduction'
              element={<Introduction />}
            />
            <Route
              path='dispossession'
              element={<IndigenousDispossession />}
            />
            <Route
              path='about'
              element={<About />}
            />
            {canonicalTablePaths.map(path => (
              <Route
                key={`timeline-table-${path}`}
                path={path.replace(/^\//, '')}
                element={<TimelineTable />}
              />
            ))}
            <Route
              path='map-data'
              element={<Navigate to='/map-data/year/1863' replace />}
            />
            <Route
              path='map-data/year/:year'
              element={<MapData />}
            />
            {canonicalMapPaths.map(path => (
              <Route
                key={`app-layout-map-${path}`}
                path={path.replace(/^\//, '')}
                element={<AppLayout />}
              />
            ))}
            {[...legacyTextPaths, ...legacyMapPaths].map(path => (
              <Route
                key={`app-layout-legacy-${path}`}
                path={path.replace(/^\//, '')}
                element={<CanonicalRouteRedirect />}
              />
            ))}
          </Route>
        </Routes>
      </Router>
    </AppContainer>
  );
};

const App = () => {
  return (
    <DimensionsContextProvider>
      <AppShell />
    </DimensionsContextProvider>
  );
};

export default App;
