import React from 'react';
import { TimelineSortOption } from '../../types';
import * as Styled from './styled';

const SORT_LABELS: Record<TimelineSortOption, string> = {
  alphabetical: 'Alphabetical',
  chronological: 'Chronological',
  descending: 'Descending %',
};

const SortControl = ({
  sortBy,
  onSortChange,
}: {
  sortBy: TimelineSortOption;
  onSortChange: (value: TimelineSortOption) => void;
}) => (
  <Styled.Block>
    <Styled.Label htmlFor='timeline-sort'>Sort By</Styled.Label>
    <Styled.Select
      id='timeline-sort'
      value={sortBy}
      onChange={event => onSortChange(event.target.value as TimelineSortOption)}
      aria-label='Sort timeline rows'
    >
      {Object.entries(SORT_LABELS).map(([value, label]) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </Styled.Select>
  </Styled.Block>
);

export default SortControl;
