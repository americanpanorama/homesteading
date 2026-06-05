import React from 'react';
import * as Styled from './styled';

const Backlink = ({ to, label }: { to: string; label: string }) => {
  return (
    <Styled.BackLink to={to}>
      &larr; {label}
    </Styled.BackLink>
  );
};

export default Backlink;