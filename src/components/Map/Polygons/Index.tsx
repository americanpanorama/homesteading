import * as React from 'react';
import * as d3 from 'd3';
import District from './District';
import State from './State';
import Reservations from './Reservations';
import FullStateDistrict from './FullStateDistrict';
import { useClaimsAndPatentsTypes, useURLParams, useYearData } from '../../../hooks';
import { makeParams, colorGradient } from '../../../utilities';
import { ProjectedState } from '../../../index.d';
import { ProjectedTownship } from '../../Map.d';
import States from '../../../../data/states.json';
import PolygonsStyles, { OfficeLabel } from './styled';
import { useMapView } from '../../../hooks';
import { getCenter, getScaledStrokeWidth } from '../utilities';

const formatOfficeLabel = (office: string) => office.replace(/([a-z.])([A-Z])/g, '$1 $2');

interface LabelPlacement {
  office: ProjectedTownship;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  strokeWidth: number;
}

/**
 * Approximate label boxes in map coordinates so we can skip labels that would collide
 * once the current map transform is applied. Larger offices are placed first.
 */
const getOfficeLabelPlacements = (
  offices: ProjectedTownship[],
  scale: number,
): LabelPlacement[] => {
  const placedBoxes: { left: number; right: number; top: number; bottom: number }[] = [];

  return [...offices]
    .sort((a, b) => b.area - a.area)
    .reduce((placements: LabelPlacement[], projectedTownship) => {
      const label = formatOfficeLabel(projectedTownship.office);
      const [x, y] = getCenter(projectedTownship.bounds);
      const fontSize = Math.max(11 / scale, 4.5);
      const strokeWidth = 3 / scale;
      const labelWidth = (label.length * fontSize * 0.56) / scale;
      const labelHeight = (fontSize * 1.25) / scale;
      const candidateBox = {
        left: x - labelWidth / 2,
        right: x + labelWidth / 2,
        top: y - labelHeight / 2,
        bottom: y + labelHeight / 2,
      };

      const collides = placedBoxes.some(box => !(
        candidateBox.right < box.left
        || candidateBox.left > box.right
        || candidateBox.bottom < box.top
        || candidateBox.top > box.bottom
      ));

      if (collides) {
        return placements;
      }

      placedBoxes.push(candidateBox);
      placements.push({
        office: projectedTownship,
        label,
        x,
        y,
        fontSize,
        strokeWidth,
      });
      return placements;
    }, []);
};

const Polygons = () => {
  const { scale, rotation } = useMapView();
  const params = useURLParams();
  const { stateTerr, office } = params;

  const { acresTypes } = useClaimsAndPatentsTypes();
  const yearData = useYearData();
  const offices = yearData?.offices || [];

  // get the full states that need to be displayed
  const stateGLOs = offices
    .filter(d => ['IL', 'IN', 'OH', 'MS'].includes(d.state))
    .map(d => d.state);

  const selectedStateOffices = (!office && stateTerr)
    ? offices.filter(d => d.state === stateTerr)
    : [];
  const officeLabelPlacements = getOfficeLabelPlacements(selectedStateOffices, scale);

  return (
    <>
      <PolygonsStyles />
      <g>
      {offices
        .sort((a: ProjectedTownship, b: ProjectedTownship) => {
          if (a.state === stateTerr && b.state === stateTerr) {
            return acresTypes.reduce((acc, type) => acc + a[type], 0) / a.area - acresTypes.reduce((acc, type) => acc + b[type], 0) / b.area;
          }
          if (a.state === stateTerr) {
            return 1;
          }
          if (b.state === stateTerr) {
            return -1;
          }
          return 0;
        })
        .map((projectedTownship: ProjectedTownship) => (
          <District
            d={projectedTownship.d}
            link={makeParams(params, [{ type: 'set_office', payload: projectedTownship.office }])}
            strokeWidth={stateTerr === projectedTownship.state
              ? getScaledStrokeWidth(scale, 2.1, 0.35, 1.1)
              : getScaledStrokeWidth(scale, 0.95, 0.18, 0.65)}
            fill={colorGradient(acresTypes.reduce((acc, type) => acc + projectedTownship[type], 0) / projectedTownship.area)}
            stroke='#181612'
            key={`office-${projectedTownship.office}-${projectedTownship.state}-${projectedTownship.area}`}
          />
        ))
      }

      {stateGLOs.map(state => (
        <FullStateDistrict
          abbr={state as 'IL' | 'IN' | 'OH' | 'MS'}
          projectedTownship={offices.find(d => d.state === state)}
          fill={colorGradient(acresTypes.reduce((acc, type) => acc + offices.find(d => d.state === state)![type], 0) / offices.find(d => d.state === state)!.area)}
          scale={scale}
          key={`fullstate${state}`}
        />
      ))}

      {States
        .filter((_s) => {
          const s = _s as ProjectedState;
          return s.bounds && s.bounds[0] && s.d && s.abbr
            && (offices.some(pt => pt.state === s.abbr && pt.acres_claimed > 0))
        })
        .map((_s) => {
          const state = _s as ProjectedState;
          // aggregate the data for the state
          state.stats = offices
            .filter(d => d.state === state.abbr)
            .reduce((acc, curr) => ({
              // OK is an exception where the districts don't cover the entire state/territory--far from it
              area: (curr.state === 'OK') ? 44735360 : acc.area + curr.area,
              acres_visualized: acc.acres_visualized + acresTypes.reduce((acc, type) => acc + curr[type], 0)
            }), {
              area: 0,
              acres_visualized: 0
            });
          return state;
        })
        // sort so those that have the most claims and the brightest boundary are on top
          .sort((a, b) => {
            if (!a.stats || !b.stats) {
              return 0;
            }
            return b.stats.acres_visualized / b.stats.area - a.stats.acres_visualized / a.stats.area;
          })
        .map((state) => {
          return (
            <State
              {...state}
              fill={(['IL', 'IN', 'MS', 'OH'].includes(state.abbr)) ? colorGradient(state.stats!.acres_visualized / state.stats!.area) : 'transparent'}
              fillOpacity={0}
              //stroke={(!stateTerr) ? colorGradient(state.stats.acres_visualized / state.stats.area) : 'transparent'}
              stroke='#201D18'
              link={makeParams(params, [{ type: 'set_state', payload: state.abbr }])}
              linkActive={state.abbr !== stateTerr}
              selected={state.abbr === stateTerr}
              scale={scale}
              key={state.abbr}
            />
          );
        })
      }

      <Reservations />

      {officeLabelPlacements.map(({ office: projectedTownship, label, x, y, fontSize, strokeWidth }) => {
        return (
          <OfficeLabel
            x={x}
            y={y}
            fontSize={fontSize}
            strokeWidth={strokeWidth}
            transform={`rotate(${-rotation} ${x} ${y})`}
            key={`office-label-${projectedTownship.office}-${projectedTownship.state}`}
          >
            {label}
          </OfficeLabel>
        );
      })}
      </g>
    </>
  );
}

export default Polygons;
