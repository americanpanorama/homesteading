import React from 'react';
import Tooltip from 'rc-tooltip';
import axios from 'axios';
import NorthAmerica from '../../../../data/northAmerica.json';
import States from '../../../../data/states.json';
import { ConflictData, ProjectedTownship, YearDataRaw } from '../../Map.d';
import { useYearData } from '../../../hooks';
import { colorGradient } from '../../../utilities';
import { calculateCenterAndDxDy, calculateTransform, getScaledStrokeWidth } from '../../Map/utilities';
import * as Styled from './styled';
import Gradient from '../../Map/Legend/Districts/Gradient';

const DEFAULT_STATES = ['KS', 'NE'];
const DEFAULT_START_YEAR = 1863;
const DEFAULT_END_YEAR = 1879;
const VIEW_WIDTH = 980;
const VIEW_HEIGHT = 560;

export interface RegionalClaimsClashesMapProps {
  states?: string[];
  startYear?: number;
  endYear?: number;
  caption?: React.ReactNode;
}

const dateLabel = (conflict: ConflictData) => `${conflict.start_date.month}/${conflict.start_date.day}/${conflict.start_date.year}`;

const conflictKey = (conflict: ConflictData) => [
  conflict.names,
  conflict.state,
  conflict.start_date.year,
  conflict.start_date.month,
  conflict.start_date.day,
  conflict.x.toFixed(3),
  conflict.y.toFixed(3),
].join('-');

const getYearRange = (startYear: number, endYear: number) => (
  Array.from({ length: endYear - startYear + 1 }, (_value, index) => startYear + index)
);

const listNames = (names: string[]): string => {
  if (names.length <= 2) {
    return names.join(' and ');
  }

  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

const getStatesBounds = (states: typeof States): [[number, number], [number, number]] => states.reduce<[[number, number], [number, number]]>((bounds, state) => ([
  [Math.min(bounds[0][0], state.bounds[0][0]), Math.min(bounds[0][1], state.bounds[0][1])],
  [Math.max(bounds[1][0], state.bounds[1][0]), Math.max(bounds[1][1], state.bounds[1][1])],
]), [[Infinity, Infinity], [-Infinity, -Infinity]]);

const useRegionalConflicts = (
  targetStates: string[],
  startYear: number,
  endYear: number,
  years: number[],
) => {
  const [conflicts, setConflicts] = React.useState<ConflictData[]>([]);
  const statesKey = targetStates.join('|');

  React.useEffect(() => {
    let isMounted = true;

    // The figure animates one year at a time, but clash markers should stay
    // visible once they have happened. Fetching the full range once lets the
    // point layer accumulate independently of the currently loaded office data.
    Promise.all(years.map(year => axios(`${process.env.PUBLIC_URL}/data/yearData/${year}.json`)))
      .then(responses => {
        if (!isMounted) {
          return;
        }

        const nextConflicts = responses
          .reduce<ConflictData[]>((acc, response) => acc.concat((response.data as YearDataRaw).conflicts || []), [])
          .filter(conflict => (
            targetStates.includes(conflict.state)
            && conflict.start_date.year >= startYear
            && conflict.start_date.year <= endYear
          ))
          .sort((a, b) => (
            a.start_date.year - b.start_date.year
            || a.start_date.month - b.start_date.month
            || a.start_date.day - b.start_date.day
          ));

        setConflicts(nextConflicts);
      })
      .catch(() => {
        if (isMounted) {
          setConflicts([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [endYear, startYear, statesKey, years]);

  return conflicts;
};

const RegionalClaimsClashesMap = ({
  states = DEFAULT_STATES,
  startYear = DEFAULT_START_YEAR,
  endYear = DEFAULT_END_YEAR,
  caption,
}: RegionalClaimsClashesMapProps) => {
  const rangeStartYear = Math.min(startYear, endYear);
  const rangeEndYear = Math.max(startYear, endYear);
  const statesKey = states.map(state => state.toUpperCase()).join('|');
  const targetStates = React.useMemo(() => statesKey.split('|').filter(Boolean), [statesKey]);
  const targetStateSet = React.useMemo(() => new Set(targetStates), [targetStates]);
  const years = React.useMemo(() => getYearRange(rangeStartYear, rangeEndYear), [rangeEndYear, rangeStartYear]);
  const focusedStates = React.useMemo(() => States.filter(state => targetStateSet.has(state.abbr)), [targetStateSet]);
  const statesForBounds = focusedStates.length > 0 ? focusedStates : States;
  const stateNames = React.useMemo(() => listNames(focusedStates.map(state => state.name)), [focusedStates]);
  const displayStateNames = stateNames || targetStates.join(', ');
  const [year, setYear] = React.useState(rangeStartYear);
  const [playing, setPlaying] = React.useState(false);
  const yearData = useYearData(year);
  const allConflicts = useRegionalConflicts(targetStates, rangeStartYear, rangeEndYear, years);
  // The projection data is already in the same canvas space as the main map.
  // Combining the requested state bounds gives us a stable regional viewport
  // without introducing a separate projection or hand-tuned path transform.
  const bounds = React.useMemo(() => getStatesBounds(statesForBounds), [statesForBounds]);
  const { center, dx, dy } = React.useMemo(() => calculateCenterAndDxDy(bounds), [bounds]);
  const viewport = React.useMemo(() => calculateTransform({
    center,
    dx,
    dy,
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    xGutter: 0.82,
    yGutter: 0.82,
    focusY: 0.48,
    rotation: -2,
  }), [center, dx, dy]);
  const selectedYearLeft = (rangeEndYear === rangeStartYear)
    ? 50
    : (year - rangeStartYear) / (rangeEndYear - rangeStartYear) * 100;
  const visibleConflicts = allConflicts.filter(conflict => conflict.start_date.year <= year);
  const districts = React.useMemo(() => (
    yearData.offices.filter(office => targetStateSet.has(office.state))
  ), [targetStateSet, yearData.offices]);

  React.useEffect(() => {
    setYear(rangeStartYear);
    setPlaying(false);
  }, [rangeEndYear, rangeStartYear, statesKey]);

  React.useEffect(() => {
    if (!playing) {
      return undefined;
    }

    // Keep the interval deliberately slow and linear: one second per year,
    // stopping at the configured end year so the reader can inspect the final accumulation.
    const animationTimer = window.setInterval(() => {
      setYear(currentYear => {
        if (currentYear >= rangeEndYear) {
          setPlaying(false);
          return currentYear;
        }

        return currentYear + 1;
      });
    }, 1000);

    return () => window.clearInterval(animationTimer);
  }, [rangeEndYear, playing]);

  const toggleAnimation = () => {
    if (year >= rangeEndYear) {
      setYear(rangeStartYear);
    }

    setPlaying(current => !current);
  };

  const getDistrictFill = (district: ProjectedTownship) => {
    // Match the main map's default claims view by including both ordinary
    // claims and claims recorded as occurring on Indian lands.
    const claimedPercent = (district.acres_claimed + district.acres_claimed_indian_lands) / district.area;

    return colorGradient(claimedPercent);
  };

  return (
    <Styled.Figure>
      <Styled.Shell>
        <Styled.MapSvg
          aria-label={`${displayStateNames} homestead claims and frontier clashes through ${year}`}
          role='img'
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        >
          <Styled.MapLayer transform={viewport.transform}>
            {NorthAmerica.map((d: string) => (
              <Styled.NorthAmericaPath
                d={d}
                key={d.substring(0, 50)}
              />
            ))}
            {States.map(state => (
              <Styled.StateBoundaryPath
                d={state.d}
                data-state-boundary={state.abbr}
                key={`state-boundary-${state.abbr}`}
              />
            ))}
            {districts.map(district => (
              <Styled.DistrictPath
                d={district.d}
                $fill={getDistrictFill(district)}
                $strokeWidth={getScaledStrokeWidth(viewport.scale, 1.35, 0.22, 0.85)}
                key={`${district.state}-${district.office}-${district.tile_id}`}
              />
            ))}
            {focusedStates.map(state => (
              <Styled.StatePath
                d={state.d}
                data-focused-state={state.abbr}
                key={state.abbr}
              />
            ))}
            {visibleConflicts.map(conflict => {
              const currentYear = conflict.start_date.year === year;
              const casualties = conflict.native_casualties + conflict.us_casualties;
              const xRadius = Math.max(2.8, Math.sqrt(casualties) * 0.4) / viewport.scale;
              const strokeWidth = currentYear
                ? xRadius * 0.55
                : xRadius * 0.38;

              return (
                <Tooltip
                  placement='bottom'
                  overlay={(
                    <Styled.PopupContainer>
                      <h4>{conflict.names}</h4>
                      <Styled.PopupData>
                        <label>date</label>
                        <div>{dateLabel(conflict)}</div>
                        <label>state</label>
                        <div>{conflict.state}</div>
                        <label>{`nation${(conflict.nations.length > 1) ? 's' : ''}`}</label>
                        <div>{conflict.nations.join(', ')}</div>
                        {(conflict.native_casualties > 0) && (
                          <React.Fragment>
                            <label>native casualties</label>
                            <div>{conflict.native_casualties}</div>
                          </React.Fragment>
                        )}
                        {(conflict.us_casualties > 0) && (
                          <React.Fragment>
                            <label>US casualties</label>
                            <div>{conflict.us_casualties}</div>
                          </React.Fragment>
                        )}
                      </Styled.PopupData>
                    </Styled.PopupContainer>
                  )}
                  key={conflictKey(conflict)}
                >
                  <Styled.ConflictMarker
                    transform={`rotate(${conflict.rotation} ${conflict.x}, ${conflict.y})`}
                    $currentYear={currentYear}
                    data-clash-year={conflict.start_date.year}
                    data-clash-state={conflict.state}
                  >
                    <line
                      x1={conflict.x - xRadius}
                      x2={conflict.x + xRadius}
                      y1={conflict.y - xRadius}
                      y2={conflict.y + xRadius}
                      strokeWidth={strokeWidth}
                    />
                    <line
                      x1={conflict.x - xRadius}
                      x2={conflict.x + xRadius}
                      y1={conflict.y + xRadius}
                      y2={conflict.y - xRadius}
                      strokeWidth={strokeWidth}
                    />
                  </Styled.ConflictMarker>
                </Tooltip>
              );
            })}
          </Styled.MapLayer>
        </Styled.MapSvg>

        <Styled.Controls>
          <Styled.PlayButton
            type='button'
            onClick={toggleAnimation}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? (
              <Styled.PauseIcon aria-hidden='true'>
                <rect x='7' y='5' width='4' height='14' rx='1' />
                <rect x='15' y='5' width='4' height='14' rx='1' />
              </Styled.PauseIcon>
            ) : (
              <Styled.PlayIcon aria-hidden='true'>
                <path d='M8 5L19 12L8 19Z' />
              </Styled.PlayIcon>
            )}
          </Styled.PlayButton>
          <Styled.TimelineRail>
            <Styled.SelectedYearLabel $left={selectedYearLeft}>{year}</Styled.SelectedYearLabel>
            <Styled.Ticks>
              {years.map(tickYear => {
                const left = (rangeEndYear === rangeStartYear)
                  ? 50
                  : (tickYear - rangeStartYear) / (rangeEndYear - rangeStartYear) * 100;
                const labeledTick = tickYear === rangeStartYear || tickYear === rangeEndYear || tickYear % 5 === 0;

                return (
                  <Styled.Tick
                    $left={left}
                    $labeled={labeledTick}
                    key={tickYear}
                  >
                    {labeledTick && <Styled.TickLabel>{tickYear}</Styled.TickLabel>}
                  </Styled.Tick>
                );
              })}
            </Styled.Ticks>
            <Styled.SelectedYearMarker $left={selectedYearLeft} />
          </Styled.TimelineRail>
        </Styled.Controls>
      </Styled.Shell>
      <Styled.Legend>
        <Gradient />
        <h4>Percentage of area claimed in selected year</h4>
        <Styled.ClashItem>
          <Styled.ClashCross $size={16} />
        </Styled.ClashItem>
        <h4>Clashes</h4>
        <Styled.ClashItem>
          <Styled.ClashCross $size={16} $opacity={0.58} />
        </Styled.ClashItem>
        <h4>previous years</h4>
      </Styled.Legend>

      <Styled.Figcaption>
        {caption || (
          <>
            Homestead land office districts in {displayStateNames}, colored by claimed acreage, with recorded clashes through the selected year. Newly appearing clashes are darker.
          </>
        )}
      </Styled.Figcaption>
    </Styled.Figure>
  );
};

export { RegionalClaimsClashesMap };
export default RegionalClaimsClashesMap;
