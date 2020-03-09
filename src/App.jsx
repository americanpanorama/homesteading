import React, { useEffect } from 'react';
import './App.css';
import Map from './components/VectorMap.js';
import Timeline from './components/Graph.js';

const App = ({ calculateDimensions }) =>  {
  useEffect(() => {
    calculateDimensions();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Homesteading and the Displacement of Native Americans 1863-1912</h1>
      </header>
      <div className='mapCanvas'>
        <Map />
      </div>
      <Timeline />
    </div>
  );
}

export default App;
