import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Run the published implementation so a lesson regression cannot hide behind a copy.
function lessonBindings(path, names) {
  const markdown = readFileSync(new URL(`../../docs/javascript/${path}`, import.meta.url), 'utf8');
  const blocks = [...markdown.matchAll(/^```(?:javascript|js)(?: runnable)?\n([\s\S]*?)^```/gm)];
  const block = blocks.find((match) => names.every((name) =>
    new RegExp(`(?:function|const|let) ${name}\\b`).test(match[1])));
  assert.ok(block, `Missing lesson definitions: ${path}: ${names.join(', ')}`);
  return vm.runInNewContext(`${block[1]}\n;({ ${names.join(', ')} });`, {
    console: { log() {} },
  }, { timeout: 1000 });
}
const plain = (value) => JSON.parse(JSON.stringify(value));
const patterns = 'arrays/array-patterns.md';

test('array recipes preserve inputs and handle empty, uneven, and invalid windows', () => {
  const { zip, unzip } = lessonBindings(patterns, ['zip', 'unzip']);
  const { chunk } = lessonBindings(patterns, ['chunk']);
  const { windowed } = lessonBindings(patterns, ['windowed']);
  const { move, swap } = lessonBindings(patterns, ['move', 'swap']);
  const input = Object.freeze([1, 2, 3, 4, 5]);
  assert.deepEqual(plain(zip()), []);
  assert.deepEqual(plain(unzip([])), []);
  assert.deepEqual(plain(zip([1, 2], ['a'])), [[1, 'a']]);
  assert.deepEqual(plain(unzip(zip([1, 2], ['a', 'b']))), [[1, 2], ['a', 'b']]);
  assert.deepEqual(plain(chunk(input, 2)), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(plain(windowed(input, 3, 2)), [[1, 2, 3], [3, 4, 5]]);
  assert.deepEqual(plain(windowed(input, 6)), []);
  for (const invalid of [0, -1, 0.5, NaN, Infinity]) {
    assert.throws(() => chunk(input, invalid), /Invalid size/);
    assert.throws(() => windowed(input, invalid), /positive safe integers/);
    assert.throws(() => windowed(input, 2, invalid), /positive safe integers/);
  }
  assert.deepEqual(plain(move(input, 0, 4)), [2, 3, 4, 5, 1]);
  assert.deepEqual(plain(move(input, 4, 0)), [5, 1, 2, 3, 4]);
  assert.deepEqual(plain(swap(input, 0, 4)), [5, 2, 3, 4, 1]);
});

test('grouping and counting accept property names inherited by ordinary objects', () => {
  const { groupBy } = lessonBindings(patterns, ['groupBy']);
  const { countBy } = lessonBindings(patterns, ['countBy']);
  const input = [{ team: '__proto__' }, { team: 'constructor' }, { team: '__proto__' }];
  const groups = groupBy(input, 'team');
  assert.equal(Object.getPrototypeOf(groups), null);
  assert.deepEqual(plain(groups.__proto__), [input[0], input[2]]);
  assert.deepEqual(plain(groups.constructor), [input[1]]);
  const counts = countBy(input, (item) => item.team);
  assert.equal(counts.__proto__, 2);
  assert.equal(counts.constructor, 1);
});

test('memoizer distinguishes signed zero, caches undefined, and retries thrown work', () => {
  const { memoizeUnary } = lessonBindings('functions/function-memoization.md', ['memoizeUnary']);
  const reciprocal = memoizeUnary((value) => 1 / value);
  assert.equal(reciprocal(0), Infinity);
  assert.equal(reciprocal(-0), -Infinity);
  let calls = 0;
  const empty = memoizeUnary(() => { calls++; return undefined; });
  assert.equal(empty('key'), undefined);
  assert.equal(empty('key'), undefined);
  assert.equal(calls, 1);
  let attempts = 0;
  const retry = memoizeUnary(() => {
    attempts++;
    if (attempts === 1) throw new Error('temporary');
    return 7;
  });
  assert.throws(() => retry('key'), /temporary/);
  assert.equal(retry('key'), 7);
  assert.equal(retry('key'), 7);
  assert.equal(attempts, 2);
  const visited = [];
  const bounded = memoizeUnary((value) => { visited.push(value); return value; }, 2);
  for (const value of ['a', 'b', 'a', 'c', 'a']) bounded(value);
  assert.deepEqual(visited, ['a', 'b', 'c', 'a']);
});

test('binary encoder rejects holes instead of silently encoding them as zero', () => {
  const { encodeU16BE } = lessonBindings('binary-data-and-shared-memory.md', ['encodeU16BE']);
  assert.deepEqual([...encodeU16BE([0, 513, 65535])], [0, 0, 2, 1, 255, 255]);
  assert.throws(() => encodeU16BE(new Array(2)), /Invalid unsigned/);
});
