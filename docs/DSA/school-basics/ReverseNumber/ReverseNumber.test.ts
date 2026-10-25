import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseNumber } from './ReverseNumber.js';

test('reverses digits, drops trailing zeroes, and preserves sign', () => {
  assert.equal(reverseNumber(122), 221);
  assert.equal(reverseNumber(200), 2);
  assert.equal(reverseNumber(12345), 54321);
  assert.equal(reverseNumber(-120), -21);
  assert.equal(reverseNumber(0), 0);
  assert.throws(() => reverseNumber(Infinity), RangeError);
});
