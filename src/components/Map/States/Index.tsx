import * as React from 'react';
import State from './State/Index';
import { useMapStates, useMapView} from '../../../hooks';

const States = ({scale, year, justBoundaries, disableLink} : {scale?: number, year?: number, justBoundaries?: boolean, disableLink?: boolean  }) => {
  const mapView = useMapView();
  const states = (year) ? useMapStates(year) : useMapStates();

  const scaleToUse = scale || (mapView ? mapView.scale : 1);

  if (justBoundaries) {
    states.forEach(state => state.fill = 'transparent');
  }

  if (disableLink) {
    states.forEach(state => state.linkActive = false);
  }

  return (
    <g>
      {states.map((state) => (
        <State
          state={state}
          scale={scaleToUse}
          year={year}
          key={state.abbr}
        />
      ))}
    </g>
  );
};

export default States;
