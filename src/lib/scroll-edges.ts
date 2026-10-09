export interface ScrollEdges {
  atStart: boolean;
  atEnd: boolean;
}

/** Whether a horizontal scroller is at either end; `tolerance` absorbs sub-pixel scroll positions. */
export function getScrollEdges(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  tolerance = 1
): ScrollEdges {
  return {
    atStart: scrollLeft <= tolerance,
    atEnd: scrollLeft + clientWidth >= scrollWidth - tolerance,
  };
}
