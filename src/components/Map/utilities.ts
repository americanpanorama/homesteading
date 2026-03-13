import { CANVASSIZE, TILESIZE } from '../../Config';
import { Bounds, CalculateCenterAndDXDY, CalculateTransform, CalculateZ, Point } from '../Map.d';

/**
 * Converts a bounding box into the center point and span needed for viewport fitting.
 */
export const calculateCenterAndDxDy: CalculateCenterAndDXDY = bounds => ({
  center: [(bounds[1][0] + bounds[0][0]) / 2, (bounds[1][1] + bounds[0][1]) / 2],
  dx: bounds[1][0] - bounds[0][0],
  dy: bounds[1][1] - bounds[0][1],
});

/**
 * Returns the geometric center of a projected bounds tuple.
 */
export const getCenter = (bounds: Bounds): Point => ([
  (bounds[1][0] + bounds[0][0]) / 2,
  (bounds[1][1] + bounds[0][1]) / 2,
]);

/**
 * Keeps polygon outlines legible across zoom levels without letting them become
 * overwhelmingly thick in close-up views or too faint in the national view.
 */
export const getScaledStrokeWidth = (
  scale: number,
  baseWidth: number,
  minWidth = 0.2,
  maxWidth = 1.6,
): number => Math.min(maxWidth, Math.max(minWidth, baseWidth / scale));

/**
 * Calculates the SVG transform needed to fit a projected region into the map viewport.
 * Defaults match the historical full-US framing used by the map when no specific bounds exist.
 */
export const calculateTransform: CalculateTransform = viewOptions => {
  let { dx, dy, center, yGutter, xGutter, focusY, width, height, rotation } = viewOptions;
  xGutter = xGutter || 1;
  yGutter = yGutter || 1;
  focusY = focusY || 0.5;
  dx = dx || CANVASSIZE;
  dy = dy || 500 / 960 * CANVASSIZE;
  center = center || [CANVASSIZE * 0.37, CANVASSIZE * 0.47];
  rotation = rotation || -2;

  const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;
  const translateX = width / 2 - center[0] * scale;
  const translateY = height * focusY - center[1] * scale;

  return {
    scale,
    transform: `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale}) scale(${scale}) `,
    translate: `translate(${translateX} ${translateY})`,
  };
};

/**
 * Chooses the slippy-map zoom level whose tile plane is large enough to cover the projected canvas.
 */
export const calculateZ: CalculateZ = scale => {
  const fullSizeOfCanvas = scale * CANVASSIZE;
  const fullSizeOfZ = (z: number): number => TILESIZE * Math.pow(2, z);

  for (let z = 0; z < 18; z += 1) {
    if (fullSizeOfZ(z) >= fullSizeOfCanvas) {
      return z;
    }
  }

  return 1;
};
