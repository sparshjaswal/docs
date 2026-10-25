import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PrimeNumber } from './CheckPrimeNumber.js';

test('classifies primes, squares, and excluded small values', () => {
  for (const value of [2, 3, 17, 29]) assert.equal(PrimeNumber(value), `${value} is prime`);
  for (const value of [-1, 0, 1, 9, 25, 1.5])
    assert.equal(PrimeNumber(value), `${value} is NOT prime`);
});
