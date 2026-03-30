import * as React from 'react';
import axios from 'axios';
import { useURLParams } from '../../../hooks';
import { ProjectedState } from '../../../index.d';
import { District, YMD } from '../../Map.d';
import States from '../../../../data/states.json';
import { getDateValue } from '../../../utilities';
import { calculateCenterAndDxDy, calculateTransform, getScaledStrokeWidth } from '../utilities';
import * as Styled from './styled';

const Map = () => {
  const { useEffect, useState } = React;

  const params = useURLParams();
  const { stateTerr, office, year, yearNum, stateTerrData } = params;

  const width = 100;
  const height = 100;
  const [officeBoundaries, setOfficeBoundaries] = useState<District>(null);

  const placeData = stateTerrData || (States as ProjectedState[]).find(d => d.abbr === stateTerr);
  const { scale, transform } = calculateTransform({
    ...calculateCenterAndDxDy(placeData.bounds),
    rotation: placeData.rotation,
    yGutter: 0.8,
    xGutter: 0.8,
    width,
    height
  });

  // load the data for the map
  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/districtsData/${office}-${stateTerr}.json`)
      .then(response => {
        setOfficeBoundaries(response.data as District);
      });
  }, [year, stateTerr, office]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const overlapsWithFiscalYear = (start: YMD, end: YMD): boolean => {
    const startValue = getDateValue(start.year, start.month, start.day);
    const endValue = getDateValue(end.year, end.month, end.day);
    const fiscalYearStart = getDateValue(yearNum - 1, 7, 1);
    const fiscalYearEnd = getDateValue(yearNum, 6, 30);
    return (startValue < fiscalYearStart && endValue > fiscalYearStart) ||
      (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
      (startValue > fiscalYearStart && endValue < fiscalYearEnd);
  }
  

  if (officeBoundaries && officeBoundaries.boundaries.length > 0) {
    return (
        <Styled.List>
        {officeBoundaries.boundaries
          .map(officeBoundary => (
            <Styled.Card
              $selected={overlapsWithFiscalYear(officeBoundary.start_date, officeBoundary.end_date)}
              key={`minimap-${officeBoundary.d.substr(0, 20)}`}
            >
              <Styled.Svg
                width={width}
                height={height}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  transform={transform}
                >
                  <Styled.StateTerritoryPath
                    d={placeData.d}
                    $selected={overlapsWithFiscalYear(officeBoundary.start_date, officeBoundary.end_date)}
                    $strokeWidth={getScaledStrokeWidth(scale, 1.5, 0.22, 0.9)}
                  />
                  <Styled.DistrictPath
                    d={officeBoundary.d}
                    $selected={overlapsWithFiscalYear(officeBoundary.start_date, officeBoundary.end_date)}
                  />
                </g>
              </Styled.Svg>
              <Styled.Dates>
                {`${months[officeBoundary.start_date.month - 1]} ${officeBoundary.start_date.day}, ${officeBoundary.start_date.year} -`}
                <br />
                {`${months[officeBoundary.end_date.month - 1]} ${officeBoundary.end_date.day}, ${officeBoundary.end_date.year}`}
              </Styled.Dates>
            </Styled.Card>
          ))}
        </Styled.List>
    );
  }

  return null;

};

export default Map;
