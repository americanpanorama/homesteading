import React from 'react';
import * as Styled from './styled';
import { useURLParams } from '../../../../hooks/index';

const ShowOptions = ({
  showClashes,
  onToggleClashes,
  showInactiveAreasForSelectedYear,
  onToggleInactiveAreasForSelectedYear,
}: {
  showClashes: boolean;
  onToggleClashes: (value: boolean) => void;
  showInactiveAreasForSelectedYear: boolean;
  onToggleInactiveAreasForSelectedYear: (value: boolean) => void;
}) => {
  const { year } = useURLParams();
  
  return (
    <Styled.ToggleBlock role='group' aria-labelledby='timeline-show-options-label'>
      <Styled.GroupLabel id='timeline-show-options-label'>Show</Styled.GroupLabel>
      <Styled.ToggleList>
        <Styled.ToggleRow htmlFor='timeline-clashes'>
          <Styled.ToggleInput
            id='timeline-clashes'
            type='checkbox'
            checked={showClashes}
            onChange={event => onToggleClashes(event.target.checked)}
          />
          <Styled.ToggleText>Clashes</Styled.ToggleText>
        </Styled.ToggleRow>
        <Styled.ToggleRow htmlFor='timeline-inactive-areas'>
          <Styled.ToggleInput
            id='timeline-inactive-areas'
            type='checkbox'
            checked={showInactiveAreasForSelectedYear}
            onChange={event => onToggleInactiveAreasForSelectedYear(event.target.checked)}
          />
          <Styled.ToggleText>Areas Inactive<br />in {year}</Styled.ToggleText>
        </Styled.ToggleRow>
      </Styled.ToggleList>
    </Styled.ToggleBlock>
  );
};

export default ShowOptions;
