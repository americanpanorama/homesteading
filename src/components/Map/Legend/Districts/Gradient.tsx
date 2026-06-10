import React from 'react';
import { heatmapGradientColors, colors } from '../../../../Constants';

const Gradient = () => {
  return (
     <svg
                width={200}
                height={45}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="legend-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    {heatmapGradientColors.map((color, i) => (
                      <stop
                        key={color}
                        offset={`${(i / (heatmapGradientColors.length - 1)) * 97}%`}
                        stopColor={color}
                      />
                    ))}
                    <stop
                      offset="100%"
                      stopColor={heatmapGradientColors[heatmapGradientColors.length - 1]}
                    />
                  </linearGradient>
                </defs>
                <g transform="translate(10, 0)">
                  <rect
                    x={0}
                    y={0}
                    width={174}
                    height={20}
                    fill="url(#legend-gradient)"
                  />
                  {[0, 0.01, 0.02, 0.03, 0.04, 0.05].map((value, i) => (
                    <text
                      key={value}
                      x={i * 35}
                      y={35}
                      fontSize="0.85em"
                      fontWeight="700"
                      fill={colors.lightColor}
                      textAnchor="middle"
                    >
                      {(value * 100).toFixed(0)}%{value === 0.05 && "+"}
                    </text>
                  ))}
                </g>
    </svg>
  );
}

export default Gradient;