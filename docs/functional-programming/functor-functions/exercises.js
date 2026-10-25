import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Maybe, Result } from '../examples.mjs';

test('nullable conversion preserves falsy values and distinguishes Some(null)', () => {
  for (const value of [0, false, '']) {
    assert.equal(Maybe.fromNullable(value).present, true);
    assert.equal(Maybe.fromNullable(value).getOrElse('fallback'), value);
  }
  for (const value of [null, undefined]) {
    assert.equal(Maybe.fromNullable(value).getOrElse('fallback'), 'fallback');
    assert.equal(Maybe.of(value).present, true);
    assert.equal(Maybe.of(value).getOrElse('fallback'), value);
  }
});

test('mapping None or Err skips the callback and keeps the context', () => {
  const failIfCalled = () => {
    throw new Error('Must be skipped');
  };
  assert.deepEqual(Maybe.none().map(failIfCalled), Maybe.none());
  assert.deepEqual(
    Result.err('Missing').map(failIfCalled),
    Result.err('Missing'),
  );
});

test('Maybe and Result obey mapping identity and composition for representative callbacks', () => {
  const values = [0, 2, false, '', null, undefined];
  const functions = [
    (value) => value,
    () => null,
    () => undefined,
    (value) => value === null,
    (value) => String(value),
  ];
  const wrappers = [Maybe.none(), Result.err('Missing')];
  for (const value of values) wrappers.push(Maybe.of(value), Result.of(value));
  for (const wrapped of wrappers) {
    assert.deepEqual(
      wrapped.map((value) => value),
      wrapped,
    );
    for (const f of functions) {
      for (const g of functions) {
        assert.deepEqual(
          wrapped.map(f).map(g),
          wrapped.map((value) => g(f(value))),
        );
      }
    }
  }
});

test('mapping keeps nested groups and leaves the original values unchanged', () => {
  const groups = Object.freeze([
    Object.freeze([1, 2]),
    Object.freeze([]),
    Object.freeze([3]),
  ]);
  assert.deepEqual(
    groups.map((group) => group.map((n) => n * 2)),
    [[2, 4], [], [6]],
  );
  assert.deepEqual(groups, [[1, 2], [], [3]]);
});
