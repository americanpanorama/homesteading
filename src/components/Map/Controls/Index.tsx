import * as React from 'react';
import { makeParams } from '../../../utilities';
import { useURLParams } from '../../../hooks';
import us from '../../../us';
import * as Styled from './styled';

interface Props {
  stateTerr: string | null;
  office: string | null;
  year: string;
}

const Controls = ({ stateTerr, office, year }: Props) => {
  const params = useURLParams();
  return (
    <Styled.ControlsContainer>
      {(stateTerr) && (
        <Styled.ZoomOutLink
          to={(office && !['IL', 'IN', 'OH', 'MS'].includes(stateTerr)) ? makeParams(params, [{ type: 'clear_office' }]) : makeParams(params, [{ type: 'clear_state' }])}
        >
          {`zoom out to ${(office && !['IL', 'IN', 'OH', 'MS'].includes(stateTerr))
            ? `${us.lookup(stateTerr).ap_abbr}${(!us.lookup(stateTerr).statehood_year || us.lookup(stateTerr).statehood_year > parseInt(year)) ? ' Terr.' : ''}`
            : 'US'}`}
          </Styled.ZoomOutLink>
        )}
    </Styled.ControlsContainer>
  );
};

export default Controls;
