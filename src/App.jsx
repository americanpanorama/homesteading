import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import DimensionsContext from './DimensionsContext';
import VectorMap from './components/VectorMap';
import MapLegend from './components/MapLegend.tsx';
import Timeline from './components/Timeline';
import LandOffice from './components/LandOffice';
import './App.css';

const App = () =>  {
  const { useState, useEffect } = React;

  const [dimensions, setDimensions] = useState();

  const calculateDimensions = () => {
    const { innerWidth, innerHeight } = window;
    const { clientWidth, clientHeight } = (document.documentElement) ? document.documentElement : { clientWidth: null, clientHeight: null };
    const width = clientWidth || innerWidth;
    const height = clientHeight || innerHeight;

    const mapDimensions = {
      width: width * 3 / 5,
      height: height - 50,
    };
    const timelineDimensions = {
      width: width * 2 / 5,
      height: height - 160 - 50 - 50 - 4 * 4,
      leftAxisWidth: 100,
      labelsWidth: 100,
    };

    const isMobile = width <= 768;

    const dimensions = {
      width,
      height,
      isMobile,
      mapDimensions,
      timelineDimensions,
    };

    return dimensions;
  };

  useEffect(() => {
    window.addEventListener('resize', () => setDimensions(calculateDimensions()));
    setDimensions(calculateDimensions());
  }, []);

  if (!dimensions) {
    return null;
  }

  const combine = (a, min) => {
    const fn = function(n, src, got, all) {
      if (n == 0) {
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
    const all = [];
    for (var i = min; i < a.length; i++) {
      fn(i, a, [], all);
    }
    all.push(a);
    return all.map(d => d.join('')).reverse();
  };

  const possibleMapPaths = combine(['/year/:year', '/stateTerr/:stateTerr', '/office/:office', '/fullOpacity/:fullOpacity', '/'], 1);
  const possibleTimelinePaths = combine(['/year/:year', '/stateTerr/:stateTerr', '/fullOpacity/:fullOpacity', '/'], 1);
  return (
    <DimensionsContext.Provider value={dimensions}>
      <div className='App'>
        <header>
          <h1>Homesteading, 1863-1912</h1>
        </header>
        <Router basename={process.env.PUBLIC_URL}>
          <Route path={possibleMapPaths}>
            <VectorMap />
            <MapLegend />
          </Route>
          <Route path={possibleTimelinePaths} exact>
            <Timeline />
          </Route>
          <Route path={'/year/:year/stateTerr/:stateTerr/office/:office'}>
            <LandOffice />
          </Route>
        </Router>
      </div>
    </DimensionsContext.Provider>
  );
};

export default App;
