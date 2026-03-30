import * as React from 'react';
import State from './State/Index';
import { useMapStates, useMapView } from '../../../hooks';

const States = () => {
  const { scale } = useMapView();
  const states = useMapStates();

  return (
    <g>
      {states.map((state) => (
        <State
          state={state}
          scale={scale}
          key={state.abbr}
        />
      ))}
    </g>
  );
};

export default States;
