export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

/** Content scaled about its center overflows by size·(scale−1)/2 on each side; that is the pan range. */
export function getPanBounds(container: Size, scale: number): Point {
  return {
    x: Math.max(0, (container.width * (scale - 1)) / 2),
    y: Math.max(0, (container.height * (scale - 1)) / 2),
  };
}

/** New offset that keeps the content point under `focus` (relative to the center) in place while zooming. */
export function zoomAt(offset: Point, focus: Point, fromScale: number, toScale: number): Point {
  const ratio = toScale / fromScale;
  return {
    x: focus.x - (focus.x - offset.x) * ratio,
    y: focus.y - (focus.y - offset.y) * ratio,
  };
}
