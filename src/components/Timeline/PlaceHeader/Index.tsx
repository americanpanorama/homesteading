import * as React from 'react';
import { useURLParams } from '../../../hooks';
import { makeParams } from '../../../utilities';
// @ts-ignore
import us from 'us';
import * as Styled from './styled';

const TimelinePlaceHeader = () => {
  const params = useURLParams();
  const { stateTerr } = params;
  return (
      <Styled.Container>
        {`${us.lookup(stateTerr).name} `}
        <Styled.ClearLink to={makeParams(params, [{ type: 'clear_state' }])}>
          [x]
        </Styled.ClearLink>
      </Styled.Container>
  );
}

export default TimelinePlaceHeader;
