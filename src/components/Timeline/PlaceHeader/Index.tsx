import * as React from 'react';
import { useLinkBuilder, useURLParams } from '../../../hooks';
// @ts-ignore
import us from 'us';
import * as Styled from './styled';

const TimelinePlaceHeader = () => {
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { stateTerr } = params;
  return (
      <Styled.Container>
        {`${us.lookup(stateTerr).name} `}
        <Styled.ClearLink to={buildLink({ clearState: true })}>
          [x]
        </Styled.ClearLink>
      </Styled.Container>
  );
}

export default TimelinePlaceHeader;
