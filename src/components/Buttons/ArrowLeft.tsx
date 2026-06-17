import React from "react";
import ArrowG from "./ArrowG";

const ArrowLeft = () => {
  return (
    <svg viewBox="0 0 20 20">
      <g transform="rotate(180 10 10)">
        <ArrowG />
      </g>
    </svg>
  );
};

export default ArrowLeft;
