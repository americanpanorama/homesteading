import React from "react";

const ArrowG = () => {
  return (
      <g transform="translate(10 10)">
        <line x1={-6.5} x2={6} y1={0} y2={0} strokeWidth={1.5} />
        <g transform="rotate(45 6.25 0)">
          <line x1={1} x2={7} y1={0} y2={0} strokeWidth={1.5} /> 
          <line x1={6.25} x2={6.25} y1={-0.75} y2={5.25} strokeWidth={1.5} />
        </g>
      </g>
  );
};

export default ArrowG;
