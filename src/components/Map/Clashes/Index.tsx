import * as React from 'react';
import Tooltip from 'rc-tooltip';
import { useMapView, useURLParams, useYearData } from '../../../hooks';
import * as Styled from './styled';

const Clashes = () => {
  const { year } = useURLParams();
  const yearData = useYearData(year);
  const { scale } = useMapView();

  return (
    <>
      {yearData.conflicts.map(clash => {
        const xRadius = Math.max(2.83, Math.sqrt(clash.native_casualties + clash.us_casualties) * 0.4) / scale;
        const strokeWidth = xRadius / 2;

        return (
          <Tooltip
            placement='bottom'
            trigger={['hover', 'click']}
            overlay={(
              <Styled.PopupContainer>
                <h4>{clash.names}</h4>
                <Styled.PopupData>
                  <label>date</label>
                  <div>{`${clash.start_date.month}/${clash.start_date.day}/${clash.start_date.year}`}</div>
                  <label>{`nation${(clash.nations.length > 1) ? 's' : ''}`}</label>
                  <div>{clash.nations.join(', ')}</div>
                  {(clash.native_casualties > 0) && (
                    <React.Fragment>
                      <label>native casualties</label>
                      <div>{clash.native_casualties}</div>
                    </React.Fragment>
                  )}
                  {(clash.us_casualties > 0) && (
                    <React.Fragment>
                      <label>US casualties</label>
                      <div>{clash.us_casualties}</div>
                    </React.Fragment>
                  )}
                </Styled.PopupData>
              </Styled.PopupContainer>
            )}
            key={`conflictOnMap-${clash.x}-${clash.y}-${clash.start_date.month}-${clash.start_date.day}`}
          >
            <g
              transform={`rotate(${clash.rotation} ${clash.x}, ${clash.y})`}
            >
              <line
                x1={clash.x - xRadius}
                x2={clash.x + xRadius}
                y1={clash.y - xRadius}
                y2={clash.y + xRadius}
                strokeWidth={strokeWidth}
                stroke='red'
              />
              <line
                x1={clash.x - xRadius}
                x2={clash.x + xRadius}
                y1={clash.y + xRadius}
                y2={clash.y - xRadius}
                strokeWidth={strokeWidth}
                stroke='red'
              />
            </g>
          </Tooltip>
        );
      })}
    </>
  );
};

export default Clashes;
