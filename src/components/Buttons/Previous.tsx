import React from 'react';

const Previous = () => {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden='true'
      focusable='false'
    >
      <g
        transform={`translate(${20 / 2} ${20 / 2}) rotate(315)`}
        className='button'
      >
        <circle
          cx={0}
          cy={0}
          r={20 / 2}
        />
        <path
          d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
        />
      </g>
    </svg>
  )
};

export default Previous;