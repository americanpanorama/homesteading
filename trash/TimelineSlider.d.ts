import { MakeLink } from '../src';

export interface Props {
  timeRange: [number, number];
  width: number;
  marginLeft: number;
  setTimeRange: (timeRange: [number, number]) => void;
  makeLink: MakeLink;
}
