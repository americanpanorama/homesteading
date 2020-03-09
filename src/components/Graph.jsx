import React from 'react';
import PropTypes from 'prop-types';
import './Graph.css'

const Graph = ({ claimsPath, selectedYearX, selectedYearY, patentsPath, selectedYear, decadeXs, selectableRects, selectYear }) => {

  const { innerHeight, innerWidth } = window;
  const height = innerHeight / 5;
  const width = innerWidth * 0.9;

  return (
    <svg
      width={width}
      height={height}
      style={{
        left: innerHeight * 0.05,
        bottom: innerHeight * 0.01,
      }}
      className='timeline'
    >
      <g transform={`scale(${width}, ${height})`}>


        <path
          d={claimsPath}
          fill='#8A3021'
          fillOpacity={0.7}
          stroke='#752623'
          strokeWidth={1 / width}
        />

        <path
          d={patentsPath}
          fill='olive'
          transform={`translate(0, 0.5)`}
        />

      </g>

        <line
          x1={width * 0.05}
          x2={width * 0.95}
          y1={height * 0.6}
          y2={height * 0.6}
          strokeWidth={1}
          stroke='white'
        />

        {decadeXs.map(decadeD => (
          <React.Fragment
            key={`ticksAndLabelsFor${decadeD.label}`}
          >
            <line
              x1={decadeD.x * width}
              x2={decadeD.x * width}
              y1={height * 0.6}
              y2={height * 0.625}
              strokeWidth={1}
              stroke='white'
            />
            <text
              x={decadeD.x * width}
              y={height * 0.7}
              textAnchor='middle'
              fill='white'
              fontSize={14}
            >
              {decadeD.label}
            </text>
          </React.Fragment>
        ))}
        <line
          x1={selectedYearX * width}
          x2={selectedYearX * width}
          y1={selectedYearY * height}
          y2={height * 0.6}
          stroke='yellow'
        />
        <circle
          cx={selectedYearX * width}
          cy={selectedYearY * height}
          r={4}
          fill='yellow'
        />
        <text
          x={selectedYearX * width}
          y={height * 0.725}
          textAnchor='middle'
          fill='#F0B67F'
          style={{
            fontWeight: 'bold',
            fontSize: '2em',
            textShadow: "-6px 0 6px #090909, 0 6px 6px #090909, 6px 0 6px #090909, 0 -6px 6px #090909",
          }}
        >
          {selectedYear}
        </text>

        <g transform={`scale(${width}, ${height})`}>
          {selectableRects.map(sr => (
            <rect
              x={sr.x}
              y={0}
              width={sr.width}
              height={1}
              fill='transparent'
              strokeWidth={0}
              onClick={selectYear}
              id={sr.year}
              key={`clickFor${sr.year}`}
            />
          ))} 
        </g>
    </svg>
  );
};

export default Graph;

Graph.propTypes = {
  claimsPath: PropTypes.string,
};

Graph.defaultProps = {
  
};
