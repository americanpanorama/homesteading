import * as  React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import './TimelineRow.css';
import { TimelineRowStyled } from '../index.d';

const Row = (props: TimelineRowStyled) => {
  const { useState, useEffect, useRef } = React;
  const {
    label,
    cells,
    active,
    y,
    width,
    height,
    labelSize,
    onHover,
    onUnhover,
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
          x={100}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          className={(active) ? "active" : ""}
          strokeWidth={3}
          stroke='white'
          strokeOpacity={0.75}
        >
          {label}
        </text>

        <text
          x={100}
          y={labelSize} //{(emphasize) ? height * 1.2 : height * 0.9}
          fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
          textAnchor='end'
          style={{

            fill: fill,
          }}
          //className={(active) ? 'active' : ''}
        >
          {label}
        </text>

        {cells.map(c => (
          <rect
            x={c.x}
            y={(18 - c.height) / 2}
            width={c.width}
            height={c.height}
            fillOpacity={c.fillOpacity}
            fill={c.fill}
            strokeWidth={0}
            //className={`cell`} 
            key={`cellFor${c.x}`}
          />
        ))}
      </g>

      {/* a transparent hoverable and selectable rect that covers the whole element */}
      {(active) && (
        <Link
          to={linkTo}
        >
          <rect
            x={100 - width * 12}
            y={0 - 1.5}
            width={width * 150}
            height={height + 3}
            fill={'transparent'}
            id={label}
            // onMouseEnter={() => { if (!isAnimating.current) { onHover(photographerKey) }}}
            // onMouseLeave={() => { if (!isAnimating.current) { onUnhover() }}}
          />
        </Link>
      )}
    </g>
  );
};

export default Row;
