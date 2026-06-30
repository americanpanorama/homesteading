import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Map from './Map/Index';
import * as Styled from './styled';

const Home = () => {

    const { pathname } = useLocation();

    const isMapPath = pathname.startsWith('/map');

        // this keeps track of the most recent map viewed so if the users checks out the intro or the about page they can return to the map they were looking at most recently
        const [mapPath, setMapPath] = useState((isMapPath) ? pathname : '/map');
        useEffect(() => {
            if (isMapPath) {
                setMapPath(pathname);
            }
        }, [pathname]);
  
    return (
      <Styled.Home>
        <Styled.Title>
          <Styled.Acquisition>Land Acquisition</Styled.Acquisition>
          <Styled.And>&</Styled.And>
          <Styled.Dispossession>Dispossession</Styled.Dispossession>
        </Styled.Title>
        <Styled.Subtitle>Mapping the Homestead Act, 1863&#8288;-&#8288;1912</Styled.Subtitle>
        <Styled.Description>The Homestead Act of 1862 offered Americans the opportunity to claim parcels of "public land," occupy and improve it for five years, and then receive title to it. This map visualizes over time and space the more than 2.3 million claims and 900,000 "patents" granting ownership made and issued in the half-century after passage of the act. By 1912, homesteaders had transformed more than 125 million acres—more than 5% of the total acreage of the entire United States—from public lands to private property. During the same period, Americans and their government dispossessed Native Americans of large portions of the American West. While not doing it full justice, this map pays particular attention to the dispossession of those lands through violence and claims on Indian reservations that the federal government defined as "surplus."</Styled.Description>
        
        <Styled.Explore>
          <Map />
          <Styled.ExploreButton to={mapPath}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: "8px" }}
            >
              <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            Explore the Map
          </Styled.ExploreButton>
        </Styled.Explore>
      </Styled.Home>
  
    )
  }
  
  export default Home;
