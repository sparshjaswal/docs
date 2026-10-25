import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Maybe, Result, parseAge, checkAge } from '../examples.mjs';

test('age validation accepts its boundaries and rejects partial or unsafe numbers', () => {
  for (const text of ['18', ' 18 ', '120']) {
    assert.deepEqual(parseAge(text).flatMap(checkAge), Result.of(Number(text)));
  }
  for (const text of ['', ' ', '18years', '18.5', '-18', '1e2', null, 18]) {
    assert.deepEqual(parseAge(text), Result.err('Enter whole digits'));
  }
  assert.deepEqual(
    parseAge('9007199254740992'),
    Result.err('Age is too large'),
  );
  for (const text of ['0', '17', '121']) {
    assert.deepEqual(
      parseAge(text).flatMap(checkAge),
      Result.err('Use an age from 18 to 120'),
    );
  }
});

test('flatMap removes the intended wrapper layer and preserves absence or errors', () => {
  const lookup = (id) => (id === 1 ? Maybe.of({ city: 'Pune' }) : Maybe.none());
  assert.deepEqual(Maybe.of(1).flatMap(lookup), Maybe.of({ city: 'Pune' }));
  assert.deepEqual(Maybe.of(2).flatMap(lookup), Maybe.none());
  const failIfCalled = () => {
    throw new Error('Must be skipped');
  };
  assert.deepEqual(Maybe.none().flatMap(failIfCalled), Maybe.none());
  assert.deepEqual(
    Result.err('Original').flatMap(failIfCalled),
    Result.err('Original'),
  );
  assert.throws(() => Maybe.of(1).flatMap((x) => x), /Return a Maybe/);
  assert.throws(() => Result.of(1).flatMap((x) => x), /Return a Result/);
  assert.deepEqual(
    [1].flatMap((value) => [[value]]),
    [[1]],
  );
});

test('Maybe and Result satisfy left identity, right identity, and associativity', () => {
  for (const M of [Maybe, Result]) {
    const missing = M === Maybe ? Maybe.none() : Result.err('Negative');
    const functions = [
      (value) => M.of(value),
      () => M.of(null),
      (value) => (value < 0 ? missing : M.of(value + 1)),
      () => missing,
    ];
    const inputs = [-1, 0, 3, null, undefined];
    for (const value of inputs) {
      for (const f of functions)
        assert.deepEqual(M.of(value).flatMap(f), f(value));
    }
    for (const wrapped of [missing, ...inputs.map(M.of)]) {
      assert.deepEqual(wrapped.flatMap(M.of), wrapped);
      for (const f of functions) {
        for (const g of functions) {
          assert.deepEqual(
            wrapped.flatMap(f).flatMap(g),
            wrapped.flatMap((x) => f(x).flatMap(g)),
          );
        }
      }
    }
  }
});

test('a result is consumed at the boundary using the matching handler', () => {
  assert.equal(
    Result.of(18).match(
      () => 'error',
      (age) => `Age: ${age}`,
    ),
    'Age: 18',
  );
  assert.equal(
    Result.err('Missing').match(
      (error) => error,
      () => 'success',
    ),
    'Missing',
  );
});

test('state is passed between steps without changing a shared counter', () => {
  const nextId = (counter) => [counter, counter + 1];
  const original = 10;
  const [first, state1] = nextId(original);
  const [second, state2] = nextId(state1);
  assert.deepEqual([first, second, state2, original], [10, 11, 12, 10]);
});
