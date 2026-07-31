import * as  React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import TimelineCell from './Cell/Index';
import { DimensionsContext } from '../../../../DimensionsContext';
import { Dimensions, TimelineRowStyled } from '../../../../index.d';
import * as Styled from './styled';
import { colors } from '../../../../Constants';

const Row = (props: TimelineRowStyled) => {
  const { useState, useEffect, useRef, useContext } = React;
  const { isPhoneSize } = useContext(DimensionsContext) as Dimensions;

  const {
    label,
    acres,
    number,
    cells,
    conflicts,
    active,
    y,
    width,
    height,
    labelSize,
    emphasize,
    fill,
    linkTo,
    showClashes
  } = props;

  const [translateY, setTranslateY] = useState(y);
  const isAnimating = useRef(false);
  isAnimating.current = (translateY !== y);

  const ref = useRef<SVGGElement>(null);

  useEffect(
    () => {
      d3.select(ref.current)
        .transition()
        .duration(1000)
        .attr('transform', `translate(0, ${y})`)
        .on('end', () => {
          setTranslateY(y);
        });
    }, [y]
  );

  return (
      <Styled.RowGroup
        transform={`translate(0, ${translateY})`}
        ref={ref}
      >
        {active ? (
          <Link
            to={linkTo}
            aria-label={`View ${label}`}
          >
            <Styled.LabelText
              x={isPhoneSize ? 65 : 125}
              y={labelSize}
              fontSize={emphasize ? labelSize * 1.5 : labelSize}
              textAnchor='end'
              $fill={colors.lightColor}
            >
              {label}
            </Styled.LabelText>
          </Link>
        ) : (
          <Styled.LabelText
            x={isPhoneSize ? 65 : 125}
            y={labelSize}
            fontSize={emphasize ? labelSize * 1.5 : labelSize}
            textAnchor='end'
            $fill={colors.mutedTextColor}
          >
            {label}
          </Styled.LabelText>
        )}

        {cells.map(cell => (
          <TimelineCell
            {...cell}
            key={`cellFor${cell.year}-${y}-${cell.fill}`}
          />
        ))} 

      {(showClashes) && (
        <g transform='translate(0, 12.5)'>
          {conflicts.map(d => (
            <g key={`conflict-${d.x}`}>
              <line
                x1={d.x - d.xRadius}
                x2={d.x + d.xRadius}
                y1={0 - d.xRadius}
                y2={0 + d.xRadius}
                stroke='red'
                strokeWidth={d.strokeWidth}
              />
              <line
                x1={d.x - d.xRadius}
                x2={d.x + d.xRadius}
                y1={0 + d.xRadius}
                y2={0 - d.xRadius}
                stroke='red'
                strokeWidth={d.strokeWidth}
              />
            </g>
          ))}
        </g>
      )}

        {/* a transparent selectable rect for selecting the place */}
          {(active) && (
            <Link
              to={linkTo}
              aria-hidden='true'
              tabIndex={-1}
            >
              <Styled.HitArea
                x={0}
                y={0}
                width={width}
                height={height + 3}
              />
            </Link>
          )}
      </Styled.RowGroup>
  );
};

export default Row;
