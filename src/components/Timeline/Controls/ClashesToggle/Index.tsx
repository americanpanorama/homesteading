import React from 'react';
import * as Styled from './styled';

const ClashesToggle = ({
  showClashes,
  onToggle,
}: {
  showClashes: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <Styled.ToggleBlock>
    <Styled.Label htmlFor='timeline-clashes'>Clashes</Styled.Label>
    <Styled.ToggleRow htmlFor='timeline-clashes'>
      <Styled.ToggleInput
        id='timeline-clashes'
        type='checkbox'
        checked={showClashes}
        onChange={event => onToggle(event.target.checked)}
      />
      <Styled.ToggleText>Show</Styled.ToggleText>
    </Styled.ToggleRow>
  </Styled.ToggleBlock>
);

export default ClashesToggle;
