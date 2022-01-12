import * as  React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import TimelineCell from './TimelineCell';
import { DimensionsContext } from '../DimensionsContext';
import './TimelineRow.css';
import { Dimensions, TimelineRowStyled, RouterParams } from '../index.d';

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
  } = props;

  const [translateY, setTranslateY] = useState(y);
  const isAnimating = useRef(false);
  isAnimating.current = (translateY !== y);

  const ref = useRef();

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
    <g>
      <g
        transform={`translate(0, ${translateY})`}
        ref={ref}
        className='timelineRow'
      >
        <text
          x={(isPhoneSize) ? 65 : 125}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          style={{
            fill: (active) ? '#F4DFB8' : '#888',
          }}
          className={(!active) ? 'inactive' : ''}
        >
          {label}
        </text>

        {(!isPhoneSize) && (
          <React.Fragment>
            <text
              x={190}
              y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
              fontSize={(emphasize) ? labelSize * 1.5 : labelSize * 0.9}
              textAnchor='end'
              className='stat'
              style={{
                fill: fill,
              }}
              //className={(active) ? 'active' : ''}
            >
              {(number) ? Math.round(number).toLocaleString() : '—'}
            </text>
    
            <text
              x={255}
              y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
              fontSize={(emphasize) ? labelSize * 1.5 : labelSize * 0.9}
              textAnchor='end'
              className='stat'
              style={{
                fill: fill,
              }}
              //className={(active) ? 'active' : ''}
            >
              {(acres && acres >= 100000) ? `${Math.round(acres / 1000).toLocaleString()}K` : ''}
              {(acres && acres < 100000 && acres >= 1000) ? `${(Math.round(acres / 100) / 10).toLocaleString()}K` : ''}
              {(acres && acres < 1000) ? Math.round(acres).toLocaleString() : ''}
              {(!acres) ? '—' : ''}
            </text>
          </React.Fragment>
        )}
        {cells.map(cell => (
          <TimelineCell
            {...cell}
            key={`cellFor${cell.x}-${y}-${cell.fill}`}
          />
        ))} 

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

        {/* a transparent selectable rect for selecting the place */}
        {(active) && (
          <Link
            to={linkTo}
          >
            <rect
              x={0}
              y={0 - 1.5}
              width={100}
              height={height + 3}
              fill={'transparent'}
              id={label}
            />
          </Link>
        )}
      </g>
    </g>
  );
};

export default Row;
