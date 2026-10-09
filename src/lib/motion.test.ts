import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  createVelocityTracker,
  project,
  rubberband,
  rubberbandClamp,
  shouldDismiss,
  spring,
} from './motion.ts';

const close = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≉ ${expected}`);

test('springs are critically damped except momentum', () => {
  assert.equal(spring.default.type, 'spring');
  assert.equal(spring.default.bounce, 0);
  assert.equal(spring.default.duration, 0.4);
  assert.equal(spring.snappy.bounce, 0);
  assert.equal(spring.snappy.duration, 0.3);
  assert.equal(spring.momentum.bounce, 0.2);
});

test('project uses Apple\'s exponential-decay projection', () => {
  assert.equal(project(0), 0);
  close(project(1000), 499);
  close(project(-500), -249.5);
  close(project(1000, 0.99), 99);
});

test('rubberband resists progressively and never exceeds the dimension', () => {
  assert.equal(rubberband(0, 300), 0);
  const small = rubberband(10, 300);
  const large = rubberband(1000, 300);
  assert.ok(small > 0 && small < 10);
  assert.ok(large > small && large < 300);
  assert.equal(rubberband(-10, 300), -small);
});

test('clamp and rubberbandClamp', () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(-1, 0, 3), 0);
  assert.equal(rubberbandClamp(40, 0, 100, 300), 40);
  const below = rubberbandClamp(-50, 0, 100, 300);
  assert.ok(below < 0 && below > -50);
  const above = rubberbandClamp(150, 0, 100, 300);
  assert.ok(above > 100 && above < 150);
});

test('shouldDismiss judges the projected position, not the release position', () => {
  assert.equal(shouldDismiss(100, 0, 300), false); // short, slow drag
  assert.equal(shouldDismiss(100, 1000, 300), true); // short drag, fast flick down
  assert.equal(shouldDismiss(350, 0, 300), true); // long, slow drag
  assert.equal(shouldDismiss(350, -1000, 300), false); // dragged far, flicked back up
});

test('velocity tracker reports px/s over the recent window only', () => {
  const tracker = createVelocityTracker(100);
  assert.equal(tracker.velocity(), 0);
  tracker.add(0, 0);
  tracker.add(50, 50);
  assert.equal(tracker.velocity(), 1000);
  tracker.add(300, 60); // finger paused before lifting: older samples fall out
  assert.equal(tracker.velocity(), 0);
  tracker.reset();
  assert.equal(tracker.velocity(), 0);
});
