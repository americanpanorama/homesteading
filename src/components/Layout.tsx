import React, { useContext, useEffect, useState } from 'react';
import { DimensionsContext } from '../DimensionsContext';
import * as Constants from '../Constants';
import { useLandOfficeData, useLinkBuilder, useURLParams } from '../hooks';
import { Dimensions } from '../index.d';
import Map from '../components/Map/Index';
import TimelineDateHeader from '../components/DateHeader';
import Timeline from '../components/Timeline/Index';
import Text from '../components/Text';
import Masthead from '../components/Masthead';
import SelectedPlacePanel from '../components/SelectedPlacePanel/Index';
import { Sidebar } from '../styled';
import * as Styled from './Layout.styled';
import {
  getSelectedPlaceSummarySnippet,
  getSelectedPlaceTitle,
  getStateTerritoryLabel,
} from './SelectedPlacePanel/utilities';

const AppLayout = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { text, office, stateTerr, year, yearNum, stateTerrData, selectedPlaceName } = params;
  const { mapDimensions, width, height } = useContext(DimensionsContext) as Dimensions;
  const { size: mapSize } = mapDimensions;
  const isCompactLayout = !Constants.isWideViewport(width, height);
  const landOfficeData = useLandOfficeData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isCompactLayout) {
      setIsDrawerOpen(false);
    }
  }, [isCompactLayout]);

  if (text) {
    return (
      <>
        <Masthead />
        <Text />
      </>
    );
  }

  if (isCompactLayout) {
    const placeTitle = (stateTerr && selectedPlaceName)
      ? getSelectedPlaceTitle({
          office,
          stateTerr,
          yearNum,
          selectedPlaceName,
          stateName: stateTerrData?.name,
        })
      : '';
    const backPath = stateTerr
      ? ((office && !['IL', 'IN', 'OH', 'MS'].includes(stateTerr))
          ? buildLink({ clearOffice: true })
          : buildLink({ clearState: true }))
      : '';
    const backLabel = stateTerr
      ? (office
          ? getStateTerritoryLabel(stateTerr, yearNum, stateTerrData?.name)
          : 'United States')
      : '';
    const summary = getSelectedPlaceSummarySnippet(landOfficeData, year, yearNum);

    return (
      <>
        <Masthead />
        <TimelineDateHeader />
        <Map />

        <Styled.MobileDrawer $open={isDrawerOpen} aria-hidden={!isDrawerOpen}>
          <Styled.MobileDrawerHeader>
            <Styled.MobileDrawerHandle />
          </Styled.MobileDrawerHeader>
          <Styled.MobileDrawerContent>
            {(stateTerr || office) ? <SelectedPlacePanel /> : <Timeline />}
          </Styled.MobileDrawerContent>
        </Styled.MobileDrawer>

        <Styled.MobileBottomBar data-phone-chrome='bottom-bar'>
          {!stateTerr && !office && (
            <Styled.MobileBottomRow>
              <Styled.MobilePrimaryButton
                type='button'
                aria-expanded={isDrawerOpen}
                onClick={() => setIsDrawerOpen(current => !current)}
              >
                {isDrawerOpen ? 'Close Timeline' : 'Open Timeline'}
              </Styled.MobilePrimaryButton>
            </Styled.MobileBottomRow>
          )}

          {stateTerr && (
            <Styled.MobileSelectionCard>
              <Styled.MobileSelectionActions>
                <Styled.MobileBackLink to={backPath}>
                  &larr; {backLabel}
                </Styled.MobileBackLink>
                <Styled.MobileActionButton
                  type='button'
                  aria-expanded={isDrawerOpen}
                  onClick={() => setIsDrawerOpen(current => !current)}
                >
                  {isDrawerOpen ? 'Close Data' : 'Open Data'}
                </Styled.MobileActionButton>
              </Styled.MobileSelectionActions>

              <Styled.MobileSelectionTitle>{placeTitle}</Styled.MobileSelectionTitle>

              {summary && (
                <Styled.MobileSelectionSummary>
                  {summary}
                </Styled.MobileSelectionSummary>
              )}
            </Styled.MobileSelectionCard>
          )}
        </Styled.MobileBottomBar>
      </>
    );
  }

  return (
    <>
      <Masthead />
      <Map />
      <TimelineDateHeader />
      <Sidebar data-layout-sidebar $isCollapsed={mapSize === 'fullscreen'} aria-hidden={mapSize === 'fullscreen'}>
        {mapSize !== 'fullscreen' && (
          <>
            {(stateTerr || office) && (
              <SelectedPlacePanel />
            )}
            {(!stateTerr && !office) && (
              <Timeline />
            )}
          </>
        )}
      </Sidebar>
    </>
  );
};

export default AppLayout;
