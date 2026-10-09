import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils.ts';

test('type-scale classes survive next to text colors', () => {
  assert.equal(cn('text-body', 'text-muted-foreground'), 'text-body text-muted-foreground');
  assert.equal(cn('text-caption text-primary'), 'text-caption text-primary');
});

test('a later type-scale class replaces an earlier one', () => {
  assert.equal(cn('text-body', 'text-caption'), 'text-caption');
});

test('custom radii conflict with built-in radii', () => {
  assert.equal(cn('rounded-tile', 'rounded-full'), 'rounded-full');
  assert.equal(cn('rounded-full', 'rounded-chip'), 'rounded-chip');
});
