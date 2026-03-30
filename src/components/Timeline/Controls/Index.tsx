import React from 'react';
import * as Styled from './styled';
import SortControl from './Sort/Index';
import Legend from './Legend/Index';
import ShowOptions from './ShowOptions/Index';
import { TimelineSortOption } from '../types';

const TimelineControls = ({
  sortBy,
  onSortChange,
  showClashes,
  onToggleClashes,
  showInactiveAreasForSelectedYear,
  onToggleInactiveAreasForSelectedYear,
}: {
  sortBy: TimelineSortOption;
  onSortChange: (value: TimelineSortOption) => void;
  showClashes: boolean;
  onToggleClashes: (value: boolean) => void;
  showInactiveAreasForSelectedYear: boolean;
  onToggleInactiveAreasForSelectedYear: (value: boolean) => void;
}) => (
  <Styled.Container>
    <SortControl sortBy={sortBy} onSortChange={onSortChange} />
    <ShowOptions
      showClashes={showClashes}
      onToggleClashes={onToggleClashes}
      showInactiveAreasForSelectedYear={showInactiveAreasForSelectedYear}
      onToggleInactiveAreasForSelectedYear={onToggleInactiveAreasForSelectedYear}
    />

  </Styled.Container>
);

export default TimelineControls;
