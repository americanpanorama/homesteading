import * as React from 'react';
import { Point } from '../Map.d';

export interface MapViewState {
  center: Point;
  rotation: number;
  scale: number;
}

export const MapViewContext = React.createContext<MapViewState | null>(null);
