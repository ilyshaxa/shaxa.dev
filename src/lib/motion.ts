// Motion vocabulary for the whole site, after Apple's "Designing Fluid Interfaces" (WWDC18).
// Critically damped springs by default; bounce only when a gesture carried momentum.

export const spring = {
  default: { type: 'spring', bounce: 0, duration: 0.4 },
  snappy: { type: 'spring', bounce: 0, duration: 0.3 },
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 },
} as const;

/** Distance a gesture released at `velocity` (px/s) would coast, using Apple's deceleration curve. */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary: the further past, the less the element follows. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Passes `value` through inside [min, max]; rubber-bands it outside. */
export function rubberbandClamp(value: number, min: number, max: number, dimension: number): number {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

/** Decide a sheet dismissal from where the gesture is going, not where it was released. */
export function shouldDismiss(offset: number, velocity: number, threshold: number): boolean {
  return offset + project(velocity) > threshold;
}

/** Tracks recent pointer samples; velocity() is px/s across the last `windowMs`. */
export function createVelocityTracker(windowMs = 100) {
  let samples: Array<{ time: number; position: number }> = [];
  return {
    add(time: number, position: number) {
      samples.push({ time, position });
      samples = samples.filter((sample) => time - sample.time <= windowMs);
    },
    velocity(): number {
      if (samples.length < 2) return 0;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const elapsed = last.time - first.time;
      return elapsed > 0 ? ((last.position - first.position) / elapsed) * 1000 : 0;
    },
    reset() {
      samples = [];
    },
  };
}
