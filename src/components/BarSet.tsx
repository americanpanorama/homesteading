import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, RouterParams } from '../index.d';
import { BarSet as BarSetI } from './Barchart.d';
import Bar from './Bar';
import { makeParams } from '../utilities';
import './BarSet.css';

const BarSet = ({ barSet, stacked }: { barSet: BarSetI, stacked: boolean }) => {
  const { year, x, bars } = barSet;
  const { useContext } = React;
  const params = useParams<RouterParams>();
  const { chartBodyHeight } = (useContext(DimensionsContext) as Dimensions).officeBarchartDimensions;

  if (bars.length === 0) {
    return null;
  }

  return (
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
      <Link
        to={makeParams(params, [{ type: 'set_year', payload: year}])}
      >
        <rect
          x={-1}
          y={0}
          width={bars[0].width}
          height={chartBodyHeight}
          fill='transparent'
          stroke={'transparent'}
        />
      </Link>
    </g>
  );
};

export default BarSet;
