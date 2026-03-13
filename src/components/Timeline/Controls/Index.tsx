import React from 'react';
import * as Styled from './styled';
import SortControl from './Sort/Index';
import Legend from './Legend/Index';
import ClashesToggle from './ClashesToggle/Index';
import { TimelineSortOption } from '../types';

const TimelineControls = ({
  sortBy,
  onSortChange,
  showClashes,
  onToggleClashes,
}: {
  sortBy: TimelineSortOption;
  onSortChange: (value: TimelineSortOption) => void;
  showClashes: boolean;
  onToggleClashes: (value: boolean) => void;
}) => (
  <Styled.Container>
    <SortControl sortBy={sortBy} onSortChange={onSortChange} />
    <Legend />
    <ClashesToggle showClashes={showClashes} onToggle={onToggleClashes} />
  </Styled.Container>
);

export default TimelineControls;
