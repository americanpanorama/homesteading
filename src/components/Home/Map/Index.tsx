import * as React from 'react';
import ContinentalUS from '../../../../data/continentalUS.json';
import { DimensionsContext } from '../../../DimensionsContext';
import { Dimensions } from '../../../index.d';
import { useAnimatedHomeMapYear, useHomeMapData } from '../../../hooks';
import { colorGradient } from '../../../utilities';
import { calculateCenterAndDxDy, calculateTransform } from '../../Map/utilities';
import type { Bounds } from '../../Map.d';
import * as Styled from './styled';

// Bounds of data/continentalUS.json in the same projected CANVASSIZE space used
// by the rest of the map. Home wants the continental silhouette centered, not
// the default national homesteading activity framing from calculateTransform.
const CONTINENTAL_US_BOUNDS: Bounds = [
  [90.79997279301239 - 10, 232.41602466320683 - 10],
  [915.2583557534542 + 10, 744.715202989936 + 10],
];

const HomeMap = () => {
  const { width: viewportWidth, isPhoneSize } = React.useContext(DimensionsContext) as Dimensions;
  const data = useHomeMapData();
  const yearIndex = useAnimatedHomeMapYear(data?.years.length || 0, 750);

  const width = Math.min(viewportWidth, 980);
  const height = Math.max(isPhoneSize ? 250 : 340, width * 0.62);
  const { transform } = React.useMemo(
    () => calculateTransform({
      ...calculateCenterAndDxDy(CONTINENTAL_US_BOUNDS),
      width,
      height,
      xGutter: 0.88,
      yGutter: 0.88,
      focusY: 0.5,
    }),
    [height, width],
  );

  const activeYear = data?.years[yearIndex] || 1863;
  const offices = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data.offices]
      .filter(office => office.state !== 'AK')
      .sort((a, b) => a.values[yearIndex] - b.values[yearIndex]);
  }, [data, yearIndex]);

  return (
    <Styled.Container aria-hidden='true'>

      
      <Styled.Svg
        viewBox={`0 0 ${width} ${height}`}
        role='presentation'
      >
        <g 
          transform={transform}
          filter="url(#mapShadow)"
        >
          <defs>
            <filter 
              id="mapShadow" 
              x="-50%" 
              y="-50%" 
              width="200%" 
              height="200%"
            >
              <feDropShadow 
                dx="0"
                dy="8"
                stdDeviation="8"
                floodColor="black"
                floodOpacity="0.6"
              />
            </filter>
          </defs>

          {ContinentalUS.map((pathD: string) => (
            <Styled.BasePath
              d={pathD}
              fill="#eee"
              fillOpacity={0.8}
              stroke="#e6ddd3"
              strokeWidth={1}
              key={pathD.substring(0, 48)}
            />
          ))}

          {/* {(States as ProjectedState[]).map(state => (
            <path
              d={state.d}
              fill='transparent'
              stroke='#d7c5b4'
              strokeWidth={1}
              key={`home-state-${state.abbr}`}
            />
          ))} */}

          {offices.map(office => (
            <Styled.OfficePath
              d={office.d}
              $fill={colorGradient(office.values[yearIndex])}
              $fillOpacity={office.values[yearIndex] > 0 ? 1 : 0.16}
              stroke='rgba(212, 198, 183, 0.28)'
              strokeWidth={1}
              key={`home-office-${office.state}-${office.office}`}
            />
          ))}
        </g>
      </Styled.Svg>

      <Styled.YearBadge>{activeYear}</Styled.YearBadge>
    </Styled.Container>
  );
};

export default HomeMap;
