import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from './validation.ts';

test('accepts ordinary addresses', () => {
  assert.equal(isValidEmail('a@b.co'), true);
  assert.equal(isValidEmail('first.last+tag@example.co.uk'), true);
});

test('ignores surrounding whitespace', () => {
  assert.equal(isValidEmail('  a@b.co  '), true);
});

test('rejects incomplete or spaced addresses', () => {
  for (const value of ['', 'a', 'a@b', '@b.co', 'a@.co', 'a b@c.com', 'a@b .co']) {
    assert.equal(isValidEmail(value), false, `expected "${value}" to be rejected`);
  }
});
