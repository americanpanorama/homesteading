import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { DimensionsContext } from './DimensionsContext';
import { Dimensions, ClaimsOrPatentsTypesSelected, PatentsAcresType } from './index.d';
import ViewNav from './components/ViewNav';
import Map from './components/Map';
import MapLegend from './components/MapLegend';
import TimelineDateHeader from './components/TimelineDateHeader';
import Timeline from './components/Timeline';
import LandOffice from './components/LandOffice';
import AppNav from './components/AppNav';
import Text from './components/Text';
import './App.css';

const App = () => {
  const { useState, useEffect } = React;

  const [dimensions, setDimensions] = useState<Dimensions>(null);

  const calculateDimensions = () => {
    const { innerWidth, innerHeight } = window;
    const { clientWidth, clientHeight } = (document.documentElement) ? document.documentElement : { clientWidth: null, clientHeight: null };
    const width = clientWidth || innerWidth;
    const height = clientHeight || innerHeight;

    const mapDimensions = {
      width: Math.min(width * 3 / 5, width - 600),
      height: height - 50 - 100 - 160,
    };
    const timelineDimensions = {
      width: Math.max(width * 0.4, 600) - 20,
      height: height - 46 - 46,
      leftAxisWidth: 100,
      labelsWidth: 100,
    };
    const officeBarchartDimensions = {
      xAxisHeight: 30,
      yAxisWidth: 70,
      padding: 40,
      paddingTop: 40,
      chartBodyHeight: 160,
      chartBodyWidth: 0,
      height: 0,
    };
    officeBarchartDimensions.chartBodyWidth = timelineDimensions.width - officeBarchartDimensions.yAxisWidth - officeBarchartDimensions.padding;
    officeBarchartDimensions.height = officeBarchartDimensions.chartBodyHeight + officeBarchartDimensions.paddingTop + officeBarchartDimensions.xAxisHeight;

    const isMobile = width <= 768;

    const dimensions: Dimensions = {
      width,
      height,
      isMobile,
      mapDimensions,
      timelineDimensions,
      officeBarchartDimensions,
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

  const possibleMapPaths = combine(['/year/:year', '/stateTerr/:stateTerr', '/office/:office', '/view/:view', '/fullOpacity/:fullOpacity', '/'], 1);
  const possibleTimelinePaths = combine(['/year/:year', '/stateTerr/:stateTerr', '/view/:view', '/fullOpacity/:fullOpacity', '/'], 1);
  const possibleBarGraphPaths = combine(['/year/:year/stateTerr/:stateTerr', '/stateTerr/:stateTerr', '/office/:office'], 1)
  const possibleTextPaths = possibleMapPaths.map(d => `/text/\:text${d}`);
  const possiblePaths = combine(['/text/:text', '/year/:year', '/stateTerr/:stateTerr', '/office/:office', '/view/:view', '/fullOpacity/:fullOpacity', '/'], 1);
  return (
    <DimensionsContext.Provider value={dimensions}>
      <div className='App'>
        <header>
          <h1>Homesteading, 1863-1912</h1>
        </header>
        <Router basename={process.env.PUBLIC_URL}>
          <Route path={possiblePaths}>
            <AppNav />
          </Route>
          <Switch>
            <Route path={possibleTextPaths}>
              <Text />
            </Route>
            <Route path={possibleMapPaths}>
              <Map />
              <ViewNav />
              <MapLegend />
            {/* For general land offices where there was only one office for the state/territory for the duration of the period, redirect to that office when the state/territory is selected */}
            <div id='sidebar'>
              <Route path={possibleMapPaths}>
                <TimelineDateHeader />
              </Route>
              <Switch>
                <Redirect
                  from='/stateTerr/IL'
                  to='/year/1863/stateTerr/IL/office/Springfield'
                  exact
                />
                <Redirect
                  from='/year/:year/stateTerr/IL'
                  to='/year/:year/stateTerr/IL/office/Springfield'
                  exact
                />
                <Redirect
                  from='/stateTerr/IN'
                  to='/year/1863/stateTerr/IN/office/Indianapolis'
                  exact
                />
                <Redirect
                  from='/year/:year/stateTerr/IN'
                  to='/year/:year/stateTerr/IN/office/Indianapolis'
                  exact
                />
              </Switch>
              <Route path={possibleBarGraphPaths}>
                <LandOffice />
              </Route>
              <Route path={possibleTimelinePaths} exact>
                <Timeline />
              </Route>

            </div>
            </Route>
          </Switch>
        </Router>
      </div>
    </DimensionsContext.Provider>
  );
};

export default App;
