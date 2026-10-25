import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pipe, compose, pipeAsync, makeTag } from '../examples.mjs';

test('tag normalization handles outer, repeated, and whitespace-only text', () => {
  assert.equal(makeTag('  JS Basics  '), 'js-basics');
  assert.equal(makeTag('A\t B\nC'), 'a-b-c');
  assert.equal(makeTag('   '), '');
  assert.equal(makeTag(''), '');
});

test('pipe and compose use opposite orders and empty pipelines preserve input', () => {
  const addOne = (n) => n + 1;
  const double = (n) => n * 2;
  assert.equal(pipe(addOne, double)(3), 8);
  assert.equal(compose(double, addOne)(3), 8);
  assert.equal(compose(addOne, double)(3), 7);
  const input = { name: 'Asha' };
  assert.equal(pipe()(input), input);
  assert.equal(compose()(input), input);
});

test('a curried function remembers a fixed argument', () => {
  const multiply = (factor) => (value) => factor * value;
  const triple = multiply(3);
  assert.deepEqual([0, -2, 4].map(triple), [0, -6, 12]);
});

test('an async pipeline waits, accepts plain steps, and preserves an empty input flow', async () => {
  const greet = pipeAsync(
    async (id) => ({ id, name: 'Asha' }),
    (user) => `Hello, ${user.name}`,
  );
  assert.equal(await greet(7), 'Hello, Asha');
  assert.equal(await pipeAsync()(12), 12);
  assert.equal(await pipeAsync((n) => n * 2)(Promise.resolve(3)), 6);
});

test('async rejection and thrown errors skip later steps', async () => {
  let calls = 0;
  for (const fail of [
    () => {
      throw new Error('Unavailable');
    },
    () => Promise.reject(new Error('Unavailable')),
  ]) {
    await assert.rejects(
      pipeAsync(fail, () => {
        calls++;
      })(7),
      /Unavailable/,
    );
  }
  assert.equal(calls, 0);
});
