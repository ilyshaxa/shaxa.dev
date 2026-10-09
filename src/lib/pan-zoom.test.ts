import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPanBounds, MAX_ZOOM, MIN_ZOOM, zoomAt } from './pan-zoom.ts';

test('no panning at 1x; half the overflow per side when zoomed', () => {
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 1), { x: 0, y: 0 });
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 2), { x: 200, y: 150 });
  assert.deepEqual(getPanBounds({ width: 400, height: 300 }, 0.5), { x: 0, y: 0 });
});

test('zoomAt keeps the point under the cursor fixed', () => {
  assert.deepEqual(zoomAt({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 2), { x: 0, y: 0 });
  assert.deepEqual(zoomAt({ x: 0, y: 0 }, { x: 100, y: 50 }, 1, 2), { x: -100, y: -50 });
  assert.deepEqual(zoomAt({ x: -100, y: -50 }, { x: 100, y: 50 }, 2, 1), { x: 0, y: 0 });
});

test('zoom range is 1x to 3x', () => {
  assert.equal(MIN_ZOOM, 1);
  assert.equal(MAX_ZOOM, 3);
});
