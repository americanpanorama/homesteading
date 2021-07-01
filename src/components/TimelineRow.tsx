import * as  React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import './TimelineRow.css';
import { TimelineRowStyled, RouterParams } from '../index.d';

const Row = (props: TimelineRowStyled) => {
  const { useState, useEffect, useRef } = React;
  const {
    label,
    acres_claimed,
    claims,
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
          x={125}
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

        <text
          x={190}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          className='stat'
          style={{
            fill: fill,
          }}
          //className={(active) ? 'active' : ''}
        >
          {(claims) ? Math.round(claims).toLocaleString() : '—'}
        </text>

        <text
          x={255}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          className='stat'
          style={{
            fill: fill,
          }}
          //className={(active) ? 'active' : ''}
        >
          {(acres_claimed && acres_claimed >= 100000) ? `${Math.round(acres_claimed / 1000).toLocaleString()}K` : ''}
          {(acres_claimed && acres_claimed < 100000 && acres_claimed >= 1000) ? `${(Math.round(acres_claimed / 100) / 10).toLocaleString()}K` : ''}
          {(acres_claimed && acres_claimed < 1000) ? Math.round(acres_claimed).toLocaleString() : ''}
          {(!acres_claimed) ? '—' : ''}
        </text>
        
        {cells.map(c => (
          <rect
            x={c.x}
            y={(18 - c.height) / 2}
            width={c.width}
            height={c.height}
            fillOpacity={c.fillOpacity}
            fill={c.fill}
            stroke='#15262F'
            strokeWidth={1}
            //className={`cell`} 
            key={`cellFor${c.x}`}
          />
        ))} 

        {/* 

        {cells.map(c => (
          <circle
            cx={c.x + c.width / 2}
            cy={(18 - Math.min(c.width, c.height) / 2) / 2}
            r={Math.min(c.width, c.height) / 2}
            fillOpacity={c.fillOpacity}
            fill={c.fill}
            stroke='#15262F'
            strokeWidth={1}
            //className={`cell`} 
            key={`cellFor${c.x}`}
          />
        ))} */}

        {conflicts.map(d => (
          <g key={`conflict-${d.x}`}>
            <line
              x1={d.x - 3}
              x2={d.x + 3}
              y1={0 - 3}
              y2={0 + 3}
              stroke='red'
            />
            <line
              x1={d.x - 3}
              x2={d.x + 3}
              y1={0 + 3}
              y2={0 - 3}
              stroke='red'
            />
          </g>
          


        ))}
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

                {/* <line
              x1={d.x}
              x2={d.x}
              y1={0}
              y2={18}
              stroke='red'
          /> */}

      {/* a transparent hoverable and selectable rect that covers the label */}
    </g>
  );
};

export default Row;
