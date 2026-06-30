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
 * Keeps text readable as the map zoom changes without letting labels dominate
 * close-up views or disappear in the national view.
 */
export const getScaledFontSize = (
  scale: number,
  baseSize: number,
  minSize = 2,
  maxSize = 13,
): number => Math.min(maxSize, Math.max(minSize, baseSize / scale));

/**
 * Calculates the SVG transform needed to fit a projected region into the map viewport.
 *
 * The map data already lives in a fixed projected canvas (`CANVASSIZE` square).
 * `center` is the point in that canvas that should land at the viewport focus
 * point. `dx` and `dy` are the projected width/height of the region being fit,
 * usually from `calculateCenterAndDxDy(bounds)`.
 *
 * The scale is selected from the limiting dimension: if the viewport is wider
 * than the fitted region, height limits the scale; otherwise width limits it.
 * The relevant `xGutter` or `yGutter` multiplier can then leave breathing room
 * around the fitted region.
 *
 * `focusY` moves the target point vertically within the viewport. For example,
 * 0.5 centers it, while 0.62 places it a little lower to reserve room for UI.
 *
 * Defaults match the historical national framing used when no specific bounds
 * exist. The default center is deliberately west/north of the canvas midpoint:
 * the projected canvas includes areas east of the homesteading activity, so the
 * old hand-tuned 0.37/0.47 values keep the active map area in view.
 */
export const calculateTransform: CalculateTransform = viewOptions => {
  const {
    width,
    height,
    dx = CANVASSIZE,
    dy = 500 / 960 * CANVASSIZE,
    center = [CANVASSIZE * 0.37, CANVASSIZE * 0.47],
    xGutter = 1,
    yGutter = 1,
    focusY = 0.5,
    rotation = -2,
  } = viewOptions;

  const xScale = xGutter * width / dx;
  const yScale = yGutter * height / dy;
  const scale = (width / height > dx / dy) ? yScale : xScale;
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
