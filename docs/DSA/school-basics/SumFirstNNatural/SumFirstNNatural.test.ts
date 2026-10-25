import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumOfFirstNNaturalNumbers as sum } from './SumFirstNNatural.js';

test('sums valid inputs and follows the documented invalid-input contract', () => {
  assert.equal(sum(0), 0);
  assert.equal(sum(1), 1);
  assert.equal(sum(10), 55);
  for (const input of [-5, null, undefined, '10', [10], { n: 10 }, Infinity, NaN]) {
    assert.equal(sum(input), 0);
  }
  assert.throws(() => sum(Number.MAX_SAFE_INTEGER), RangeError);
});
