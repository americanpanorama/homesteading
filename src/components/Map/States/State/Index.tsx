import * as React from 'react';
// @ts-ignore
import us from '../../../../us.js';
import { useURLParams } from '../../../../hooks';
import { MapStateLayerItem } from '../../../../hooks/map';
import { getScaledStrokeWidth } from '../../utilities';
import * as Styled from './styled';

interface Props {
  state: MapStateLayerItem;
  scale: number;
  year?: number;
}

const State = ({ state, scale, year }: Props) => {
  const { yearNum: _yearNum } = useURLParams();
  const yearNum = year || _yearNum;
  const label = `${us.lookup(state.abbr).ap_abbr}${(!us.lookup(state.abbr).statehood_year || us.lookup(state.abbr).statehood_year > yearNum) ? ' Terr.' : ''}`;

  let strokeWidth = state.selected
    ? getScaledStrokeWidth(scale, 3.2, 0.45, 1.35)
    : getScaledStrokeWidth(scale, 1.35, 0.22, 0.8);
  
  // for Alaska, we want a thinner stroke width to avoid overwhelming the small size of the state, but we also want to make sure it doesn't disappear entirely when zoomed out. So we set a minimum stroke width of 0.5px.
  if (state.abbr === 'AK') {
    strokeWidth = strokeWidth / 3;
  }
  return (
    <Styled.Container
      to={state.link}
      $selected={state.selected}
      aria-label={label}
      aria-disabled={!state.linkActive}
      tabIndex={state.linkActive ? 0 : -1}
      onClick={state.linkActive ? undefined : (event) => event.preventDefault()}
    >
      <Styled.Boundary
        d={state.d}
        $strokeWidth={strokeWidth}
        $fill={state.fill || 'transparent'}
      />
    </Styled.Container>
  );
};

export default State;
