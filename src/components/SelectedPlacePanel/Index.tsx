import * as React from 'react';
import { useLandOfficeData, useLinkBuilder, useURLParams } from '../../hooks';
import LandOffice from '../LandOffice';
import Timeline from '../Timeline/Index';
import * as Styled from './styled';
import Summary from './Summary/Index';
import { getSelectedPlaceTitle, getStateTerritoryLabel } from './utilities';

const SelectedPlacePanel = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { office, panel, stateTerr, yearNum, stateTerrData } = params;
  const data = useLandOfficeData();

  if (!data || !stateTerr) {
    return null;
  }

  const { chartData, selectedYearData } = data;
  const title = getSelectedPlaceTitle({
    office,
    stateTerr,
    yearNum,
    selectedPlaceName: chartData.name,
    stateName: stateTerrData?.name,
  });
  const backLabel = office
    ? getStateTerritoryLabel(stateTerr, yearNum, stateTerrData?.name)
    : 'United States';
  const backTo = office
    ? buildLink({ clearOffice: true })
    : buildLink({ clearState: true });

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.BackLink to={backTo}>
          &larr; {backLabel}
        </Styled.BackLink>
        <Styled.Title>{title}</Styled.Title>
      </Styled.Header>

      {selectedYearData && (
        <Styled.Summary>
          <Summary data={data} />
        </Styled.Summary>
      )}

      {!office && (
        <Styled.ToggleGroup aria-label='Selected state or territory view'>
          <Styled.ToggleLink
            to={buildLink({ panel: 'timeline' })}
            $active={panel === 'timeline'}
            aria-current={panel === 'timeline' ? 'page' : undefined}
          >
            Timeline
          </Styled.ToggleLink>
          <Styled.ToggleLink
            to={buildLink({ panel: 'charts' })}
            $active={panel === 'charts'}
            aria-current={panel === 'charts' ? 'page' : undefined}
          >
            Claims &amp; Patents
          </Styled.ToggleLink>
        </Styled.ToggleGroup>
      )}

      <Styled.Content>
        {office || panel === 'charts' ? (
          <LandOffice data={data} />
        ) : (
          <Timeline />
        )}
      </Styled.Content>
    </Styled.Container>
  );
};

export default SelectedPlacePanel;
