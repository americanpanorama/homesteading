import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import DimensionsContext from './DimensionsContext';
import VectorMap from './components/VectorMap';
import Timeline from './components/Timeline';
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
      width: width / 2,
      height: height -50,
    };
    const timelineDimensions = {
      width: width / 2,
      height: height - 50,
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

  return (
    <DimensionsContext.Provider value={dimensions}>
      <div className='App'>
        <header>
          <h1>Homesteading and the Dispossession of Native Americans 1863-1912</h1>
        </header>
        <Router basename={process.env.PUBLIC_URL}>
          <Route path={['/:year', '/:year/office/:officeId']}>
            <VectorMap />
          </Route>
          <Timeline 
            fetchPath={'/data/timelineData/OR.json'}
            selectedState={null}
            timeRange={[1862, 1912]}
          />
        </Router>
      </div>
    </DimensionsContext.Provider>
  );
};

export default App;
