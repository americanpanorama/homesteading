import * as React from 'react';
import * as d3 from 'd3';
import { ANIMATIONDURATION } from '../../../../Config';
import * as Styled from './styled';

interface Props {
  d: string;
  link: string;
  linkActive: boolean;
  label: string;
  strokeWidth: number;
  fill: string;
}

const District = ({ d, link, linkActive, label, strokeWidth: nextStrokeWidth, fill: nextFill }: Props) => {
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

  const boundary = (
    <Styled.Boundary
      d={d}
      ref={ref}
      $strokeWidth={strokeWidth.current}
      $fill={fill.current}
    />
  );

  if (!linkActive) {
    return (
      <Styled.StaticContainer aria-hidden='true' focusable='false'>
        {boundary}
      </Styled.StaticContainer>
    );
  }

  return (
    <Styled.Container
      to={link}
      aria-label={label}
    >
      {boundary}
    </Styled.Container>
  );
};

export default District;
