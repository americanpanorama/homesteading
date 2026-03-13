import React from 'react';
import { useContext } from 'react';
import { DimensionsContext } from '../DimensionsContext';
import { useURLParams } from '../hooks';
import { Dimensions } from '../index.d';
import Map from '../components/Map/Index';
import TimelineDateHeader from '../components/DateHeader';
import Timeline from '../components/Timeline/Index';
import LandOffice from '../components/LandOffice';
import Text from '../components/Text';
import Masthead from '../components/Masthead';
import { Sidebar } from '../styled';

const AppLayout = () => {
  const { text, office, stateTerr } = useURLParams();
  const { mapDimensions } = useContext(DimensionsContext) as Dimensions;
  const { size: mapSize } = mapDimensions;

  if (text) {
    return <Text />;
  }

  return (
    <>
      <Masthead />
      <Map />
      <TimelineDateHeader />
      <Sidebar $isCollapsed={mapSize === 'fullscreen'} aria-hidden={mapSize === 'fullscreen'}>
        {mapSize !== 'fullscreen' && (
          <>
            {(stateTerr || office) && (
              <LandOffice />
            )}
            {(!office) && (
              <Timeline />
            )}
          </>
        )}
      </Sidebar>
    </>
  );
};

export default AppLayout;
