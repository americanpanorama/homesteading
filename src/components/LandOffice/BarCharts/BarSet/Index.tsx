import * as React from 'react';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import { DimensionsContext } from '../../../../DimensionsContext';
import { useLinkBuilder, useURLParams } from '../../../../hooks';
import { Dimensions, RouterParams } from '../../../../index.d';
import { BarSet as BarSetI } from '../types';
import Bar from './Bar';
import BarSetStyles, * as Styled from './styled';

const BarSet = ({ barSet, stacked }: { barSet: BarSetI, stacked: boolean }) => {
  const { year, x, bars, label } = barSet;
  const { useContext, useState, useEffect, useRef } = React;
  const params = useURLParams();
  const buildLink = useLinkBuilder();
  const { year: selectedYear } = params;
  const { chartBodyHeight } = (useContext(DimensionsContext) as Dimensions).officeBarchartDimensions;
  const [ visibleLabelForYear, setVisibleLabelForYear ] = useState(parseInt(selectedYear));
  const [ labelY, setLabelY ] = useState((stacked) ? chartBodyHeight - bars.reduce((acc, curr) => acc + curr.height, 0) - 7 : chartBodyHeight - Math.max(...bars.map(d => d.height)) - 7);
  const ref = useRef(null);

  useEffect(() => {
    setVisibleLabelForYear(parseInt(selectedYear));
  }, [selectedYear]);

  // set the positioning of the label, which moves as the bars move
  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(1000)
      .attr('y', (stacked) ? chartBodyHeight - bars.reduce((acc, curr) => acc + curr.height, 0) - 7 : chartBodyHeight - Math.max(...bars.map(d => d.height)) - 7)
      .on('end', () => {
        setLabelY((stacked) ? chartBodyHeight - bars.reduce((acc, curr) => acc + curr.height, 0) - 7 : chartBodyHeight - Math.max(...bars.map(d => d.height)) - 7);
      });
  }, [bars, stacked]);

  if (bars.length === 0) {
    return null;
  }

  return (
    <>
      <BarSetStyles />
      <g
        transform={`translate(${x})`}
        className='bar'
      >
      {bars.map((bar, i) => {
        return (
          <Bar
            x={(stacked) ? 0 : bar.width / bars.length * i}
            y={(stacked) ? chartBodyHeight - bars.slice(0, i).reduce((acc, curr) => acc + curr.height, 0) - bar.height : chartBodyHeight - bar.height}
            width={(stacked) ? bar.width : bar.width / bars.length}
            height={bar.height}
            className={bar.className}
            key={`barFor${bar.className}`}
          />
        );
      })}
        <Styled.LabelText
          x={bars[0].width / 2}
          y={labelY}
          $visible={year === visibleLabelForYear}
          ref={ref}
        >
          {label}
        </Styled.LabelText>
      <Link
        to={buildLink({ year })}
        aria-label={`Select year ${year}`}
      >
        <rect
          x={-1}
          y={0}
          width={bars[0].width}
          height={chartBodyHeight}
          fill='transparent'
          stroke={'transparent'}
          onMouseEnter={() => setVisibleLabelForYear(year)}
          onMouseLeave={() => setVisibleLabelForYear(parseInt(selectedYear))}
        />
      </Link>
      </g>
    </>
  );
};

export default BarSet;
