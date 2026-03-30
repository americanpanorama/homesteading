import * as React from 'react';
import * as d3 from 'd3';
import { ANIMATIONDURATION } from '../../../../Config';
import * as Styled from './styled';

interface Props {
  d: string;
  link: string;
  strokeWidth: number;
  fill: string;
}

const District = ({ d, link, strokeWidth: nextStrokeWidth, fill: nextFill }: Props) => {
  const strokeWidth = React.useRef(nextStrokeWidth);
  const fill = React.useRef(nextFill);
  const ref = React.useRef<SVGPathElement | null>(null);

  React.useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .style('stroke-width', nextStrokeWidth)
      .on('end', () => {
        strokeWidth.current = nextStrokeWidth;
      });
  }, [nextStrokeWidth]);

  React.useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(ANIMATIONDURATION)
      .style('fill', nextFill)
      .on('end', () => {
        fill.current = nextFill;
      });
  }, [nextFill]);

  return (
    <Styled.Container
      to={link}
      aria-label='View land office district details'
    >
      <Styled.Boundary
        d={d}
        ref={ref}
        $strokeWidth={strokeWidth.current}
        $fill={fill.current}
      />
    </Styled.Container>
  );
};

export default District;
