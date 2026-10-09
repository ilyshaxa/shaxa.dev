import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getScrollEdges } from './scroll-edges.ts';

test('at the start of a scrollable row', () => {
  assert.deepEqual(getScrollEdges(0, 1000, 400), { atStart: true, atEnd: false });
});

test('in the middle', () => {
  assert.deepEqual(getScrollEdges(300, 1000, 400), { atStart: false, atEnd: false });
});

test('at the end, tolerating sub-pixel scroll positions', () => {
  assert.deepEqual(getScrollEdges(599.5, 1000, 400), { atStart: false, atEnd: true });
});

test('everything fits: both edges reached, so both arrows disable', () => {
  assert.deepEqual(getScrollEdges(0, 400, 400), { atStart: true, atEnd: true });
});
