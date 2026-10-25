import assert from 'node:assert/strict';
import { test } from 'node:test';
import { memoizeInteger } from '../examples.mjs';

test('a pure numeric calculation can be replaced by its result', () => {
  const square = (number) => number * number;
  assert.equal(square(4) + square(4), 32);
  assert.equal(16 + 16, 32);
  // Equal contents do not imply equal object identity.
  const makePoint = () => ({ x: 1, y: 2 });
  assert.deepEqual(makePoint(), makePoint());
  assert.notEqual(makePoint(), makePoint());
});

test('memoization caches zero and undefined and keeps different integer keys separate', () => {
  // Instrumentation counts evaluations for the test; it is intentionally observable.
  let calls = 0;
  const calculate = memoizeInteger((number) => {
    calls++;
    return number === 0 ? undefined : number * 2;
  });
  assert.equal(calculate(0), undefined);
  assert.equal(calculate(0), undefined);
  assert.equal(calculate(2), 4);
  assert.equal(calculate(2), 4);
  assert.equal(calculate(-2), -4);
  assert.equal(calls, 3);
});

test('unsupported keys are rejected before evaluating the callback', () => {
  const calculate = memoizeInteger(() => assert.fail('Must not evaluate'));
  for (const input of [
    -0,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    '1',
    {},
    null,
  ]) {
    assert.throws(() => calculate(input), TypeError);
  }
});

test('failed calculations are not cached', () => {
  let calls = 0;
  const calculate = memoizeInteger(() => {
    calls++;
    throw new Error('Failed');
  });
  assert.throws(() => calculate(1), /Failed/);
  assert.throws(() => calculate(1), /Failed/);
  assert.equal(calls, 2);
});

test('map composition preserves values under pure unary callbacks', () => {
  const double = (number) => number * 2;
  const addOne = (number) => number + 1;
  for (const values of [[], [0], [-2, 3, 10]]) {
    assert.deepEqual(
      values.map(double).map(addOne),
      values.map((x) => addOne(double(x))),
    );
  }
  // Floating-point addition itself is not associative.
  assert.notEqual(1e16 + -1e16 + 1, 1e16 + (-1e16 + 1));
});
