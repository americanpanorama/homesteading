import * as React from 'react';
import ContinentalUS from '../../../../data/continentalUS.json';
import { DimensionsContext } from '../../../DimensionsContext';
import { Dimensions } from '../../../index.d';
import { useAnimatedHomeMapYear, useHomeMapData } from '../../../hooks';
import { colorGradient } from '../../../utilities';
import { calculateTransform } from '../../Map/utilities';
import * as Styled from './styled';

const HomeMap = () => {
  const { width: viewportWidth, isPhoneSize } = React.useContext(DimensionsContext) as Dimensions;
  const data = useHomeMapData();
  const yearIndex = useAnimatedHomeMapYear(data?.years.length || 0);

  const width = Math.min(viewportWidth, 980);
  const height = Math.max(isPhoneSize ? 250 : 340, Math.min(width * 0.62, 520));
  const { transform } = React.useMemo(
    () => calculateTransform({ width, height, yGutter: 0.88, dx: -100, focusY: 0.63 }),
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
      <Styled.YearBadge>{activeYear}</Styled.YearBadge>
      

      <Styled.Svg
        viewBox={`100 150 ${width} ${height}`}
        role='presentation'
      >
        <g transform={transform}>
          {ContinentalUS.map((pathD: string) => (
            <Styled.BasePath
              d={pathD}
              fill='#eee'
              fillOpacity={0.6}
              stroke='#e6ddd3'
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
    </Styled.Container>
  );
};

export default HomeMap;
