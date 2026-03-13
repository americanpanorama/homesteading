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
        <text
          x={(isPhoneSize) ? 65 : 125}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          style={{
            fill: active ? colors.lightColor : colors.mutedTextColor,
          }}
        >
          {label}
        </text>

        {(!isPhoneSize && false) && (
          <React.Fragment>
            <Styled.StatText
              x={190}
              y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
              fontSize={(emphasize) ? labelSize * 1.5 : labelSize * 0.9}
              textAnchor='end'
              style={{
                fill: fill,
              }}
            >
              {(number) ? Math.round(number).toLocaleString() : '—'}
            </Styled.StatText>
    
            <Styled.StatText
              x={255}
              y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
              fontSize={(emphasize) ? labelSize * 1.5 : labelSize * 0.9}
              textAnchor='end'
              style={{
                fill: fill,
              }}
            >
              {(acres && acres >= 100000) ? `${Math.round(acres / 1000).toLocaleString()}K` : ''}
              {(acres && acres < 100000 && acres >= 1000) ? `${(Math.round(acres / 100) / 10).toLocaleString()}K` : ''}
              {(acres && acres < 1000) ? Math.round(acres).toLocaleString() : ''}
              {(!acres) ? '—' : ''}
            </Styled.StatText>
          </React.Fragment>
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
              aria-label={`View ${label}`}
            >
              <Styled.HitArea
                x={0}
                y={100}
                width={100}
                height={height + 3}
              />
            </Link>
          )}
      </Styled.RowGroup>
  );
};

export default Row;
