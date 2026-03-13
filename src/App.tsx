import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DimensionsContextProvider from './DimensionsContextProvider';
import { DimensionsContext } from './DimensionsContext';
import AppLayout from './components/Layout';
import Home from './components/Home/Index';

import AppNav from './components/AppNav/Index';
import { useURLParams } from './hooks';
import { Dimensions } from './index.d';
import { AppContainer, BaseStyles, SkipLink } from './styled';

const DefaultOfficeRedirect = ({ office }: { office: string }) => {
  const { year } = useURLParams();
  return <Navigate to={`/year/${year}/stateTerr/${office === 'Springfield' ? 'IL' : 'IN'}/office/${office}`} replace />;
};

const AppShell = () => {
  const { mapDimensions } = useContext(DimensionsContext) as Dimensions;

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

  const possibleMapPaths = combine(['/map/year/:year', '/map/stateTerr/:stateTerr', '/map/office/:office', '/map/view/:view', '/map/fullOpacity/:fullOpacity', '/map'], 1);
  const possibleTextPaths = ['/text/:text', ...possibleMapPaths.map(d => `/text/:text${d}`)];
  const possiblePaths = combine(['/text/:text', '/map/year/:year', '/map/stateTerr/:stateTerr', '/map/office/:office', '/map/view/:view', '/map/fullOpacity/:fullOpacity', '/map'], 1);

  return (
    <AppContainer $isMapFullscreen={mapDimensions.size === 'fullscreen'}>
      <BaseStyles />
      <SkipLink href='#main-content'>Skip to main content</SkipLink>
      <>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            {possiblePaths.map(path => (
              <Route
                key={`app-nav-${path}`}
                path={path}
                element={<AppNav />}
              />
            ))}
            <Route path='/' element={<Home />} />
          </Routes>
          <Routes>
            <Route
              path='/stateTerr/IL'
              element={<Navigate to='/year/1863/stateTerr/IL/office/Springfield' replace />}
            />
            <Route
              path='/year/:year/stateTerr/IL'
              element={<DefaultOfficeRedirect office='Springfield' />}
            />
            <Route
              path='/stateTerr/IN'
              element={<Navigate to='/year/1863/stateTerr/IN/office/Indianapolis' replace />}
            />
            <Route
              path='/year/:year/stateTerr/IN'
              element={<DefaultOfficeRedirect office='Indianapolis' />}
            />
            {[...possibleTextPaths, ...possibleMapPaths].map(path => (
              <Route
                key={`app-layout-${path}`}
                path={path}
                element={<AppLayout />}
              />
            ))}
            {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
          </Routes>
        </Router>
      </>
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
