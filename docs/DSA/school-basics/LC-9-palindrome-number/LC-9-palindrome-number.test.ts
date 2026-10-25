import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPalindromeNumber } from './LC-9-palindrome-number.js';

test('handles odd and even digit counts, zero, signs, and a trailing zero', () => {
  for (const value of [0, 1, 121, 1221]) assert.equal(isPalindromeNumber(value), true);
  for (const value of [-121, 10, 1231]) assert.equal(isPalindromeNumber(value), false);
});
