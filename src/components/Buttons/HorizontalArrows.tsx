import React from 'react';

const Previous = () => {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform={`translate(${20 / 2} ${20 / 2})`}
        className="button"
      >
        <circle
          cx={0}
          cy={0}
          r={20 / 2}
        />

        <path
          d={`
        M${20 / -4},0 H${20 / 4}
        M${20 / -4},0 l${20 / 7},${20 / -7}
        M${20 / -4},0 l${20 / 7},${20 / 7}
        M${20 / 4},0 l${20 / -7},${20 / -7}
        M${20 / 4},0 l${20 / -7},${20 / 7}
      `}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
};

export default Previous;