import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
async function implementation(directory) {
  const files = fg.sync(`docs/DSA/**/${directory}/*.js`, { cwd: root });
  assert.equal(files.length, 1, `Expected one implementation for ${directory}`);
  return import(pathToFileURL(path.join(root, files[0])).href);
}

test('calendar, factorial, and summation handle their mathematical boundaries', async () => {
  const { isLeapYear } = await implementation('CheckLeapYear');
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2023), false);
  assert.equal(isLeapYear(NaN), false);
  const { FactorialOfNumber } = await implementation('FactorialOfNumber');
  assert.equal(FactorialOfNumber(0), 1n);
  assert.equal(FactorialOfNumber(1), 1n);
  assert.equal(FactorialOfNumber(20), 2432902008176640000n);
  assert.throws(() => FactorialOfNumber(-1), RangeError);
  assert.throws(() => FactorialOfNumber(1.5), RangeError);
  const { sumOfFirstNNaturalNumbers: sum } = await implementation('SumFirstNNatural');
  let expected = 0;
  for (let n = 0; n <= 100; n++) {
    expected += n;
    assert.equal(sum(n), expected);
  }
  for (const input of [-1, null, undefined, '10', [], {}, Infinity, NaN, 1.5]) {
    assert.equal(sum(input), 0);
  }
  assert.throws(() => sum(Number.MAX_SAFE_INTEGER), RangeError);
});

test('email normalization preserves domains and applies plus/dot rules only locally', async () => {
  const { numUniqueEmails } = await implementation('LC-929-unique-email-addresses');
  assert.equal(numUniqueEmails(['a.b+c@one.test', 'ab@one.test', 'ab@two.test']), 2);
  assert.equal(numUniqueEmails(['ab@one.test', 'ab@onetest']), 2);
  assert.equal(
    numUniqueEmails([
      'test.email+alex@leetcode.com',
      'test.e.mail+bob.cathy@leetcode.com',
      'testemail+david@lee.tcode.com',
    ]),
    2,
  );
});

test('anagram keys distinguish multi-digit letter frequencies', async () => {
  const { groupAnagrams } = await implementation('LC-49-group-anagrams');
  const first = 'a' + 'b'.repeat(11);
  const second = 'a'.repeat(11) + 'b';
  const groups = groupAnagrams([first, second, first.split('').reverse().join(''), '', '']);
  const normalized = groups
    .map((group) => [...group].sort())
    .sort((a, b) => a[0].localeCompare(b[0]));
  const expected = [[first, first.split('').reverse().join('')], [second], ['', '']]
    .map((group) => group.sort())
    .sort((a, b) => a[0].localeCompare(b[0]));
  assert.deepEqual(normalized, expected);
});

test('kth-largest heap agrees with a sorting oracle for every rank', async () => {
  const { findKthLargest } = await implementation('LC-215-kth-largest-element-in-an-array');
  const samples = [[-5], [3, 2, 3, 1, 2, 4, 5, 5, 6], [0, -1, -1, 10]];
  for (let n = 1; n <= 30; n++)
    samples.push(Array.from({ length: n }, (_, i) => ((i * 17 + n * 3) % 23) - 11));
  for (const values of samples) {
    const original = [...values];
    const sorted = [...values].sort((a, b) => b - a);
    for (let k = 1; k <= values.length; k++) assert.equal(findKthLargest(values, k), sorted[k - 1]);
    assert.deepEqual(values, original, 'ranking must not mutate the input');
  }
  assert.throws(() => findKthLargest([], 1), RangeError);
  assert.throws(() => findKthLargest([1], 0), RangeError);
});

test('maximum subarray agrees with exhaustive contiguous sums', async () => {
  const { maxSubarraySum } = await implementation('LC-53-maximum-subarray');
  for (const values of [
    [5],
    [-2, -4],
    [5, 4, 1, 7, 8],
    [2, 3, -8, 7, -1, 2, 3],
    [0, 0],
    [-1, 2, -1, 2],
  ]) {
    let expected = -Infinity;
    for (let start = 0; start < values.length; start++) {
      for (let end = start + 1; end <= values.length; end++) {
        expected = Math.max(
          expected,
          values.slice(start, end).reduce((sum, value) => sum + value, 0),
        );
      }
    }
    const result = maxSubarraySum(values);
    assert.equal(result.sum, expected);
    assert.equal(
      result.subarray.reduce((sum, value) => sum + value, 0),
      expected,
    );
    assert.ok(
      values.some((_, start) =>
        result.subarray.every((value, offset) => values[start + offset] === value),
      ),
    );
  }
  assert.throws(() => maxSubarraySum([]), RangeError);
});

test('sorted two-sum returns distinct one-based positions without mutation', async () => {
  const { twoSum } = await implementation('LC-167-two-sum-ii-input-array-is-sorted');
  for (const [values, target] of [
    [[2, 7, 11, 15], 9],
    [[-1, 0], -1],
    [[3, 3], 6],
    [[2, 3, 4], 6],
  ]) {
    const original = [...values];
    const [left, right] = twoSum(values, target);
    assert.ok(left >= 1 && left < right && right <= values.length);
    assert.equal(values[left - 1] + values[right - 1], target);
    assert.deepEqual(values, original);
  }
  assert.deepEqual(twoSum([1, 2], 9), []);
});

test('consecutive runs ignore repeated starts and Pascal zero rows stay empty', async () => {
  const { longestConsecutive } = await implementation('LC-128-longest-consecutive-sequence');
  assert.equal(longestConsecutive([]), 0);
  assert.equal(longestConsecutive([-2, -1, -1, 0, 5]), 3);
  const repeatedStarts = [...Array(3000).fill(0), ...Array.from({ length: 3000 }, (_, i) => i)];
  assert.equal(longestConsecutive(repeatedStarts), 3000);
  const { generate } = await implementation('LC-118-pascals-triangle');
  assert.deepEqual(generate(0), []);
  generate(10).forEach((row, index) => {
    assert.equal(row.length, index + 1);
    assert.equal(
      row.reduce((sum, value) => sum + value, 0),
      2 ** index,
    );
    assert.deepEqual(row, [...row].reverse());
  });
});

test('swapping does not lose large values and reversing preserves the sign', async () => {
  const { swapTwoVariable } = await implementation('SwapNumbers');
  assert.deepEqual(swapTwoVariable(Number.MAX_VALUE, Number.MAX_VALUE), [
    Number.MAX_VALUE,
    Number.MAX_VALUE,
  ]);
  assert.deepEqual(swapTwoVariable('left', 'right'), ['right', 'left']);
  const { reverseNumber } = await implementation('ReverseNumber');
  assert.equal(reverseNumber(-120), -21);
  assert.equal(reverseNumber(0), 0);
  assert.throws(() => reverseNumber(Infinity), RangeError);
  assert.throws(() => reverseNumber(1.5), RangeError);
});

test('integer digit examples avoid floating-point false positives', async () => {
  const { perfectSquare } = await implementation('NumberIsPerfectSquare');
  const square = 94906265 ** 2;
  assert.equal(perfectSquare(square), true);
  assert.equal(perfectSquare(square - 1), false);
  assert.equal(perfectSquare(square + 1), false);
  assert.equal(perfectSquare(Number.MAX_SAFE_INTEGER + 1), false);
  const { isArmstrongNumbers } = await implementation('ArmstrongNumbers');
  for (const value of [0, 153, 9474, 548834]) assert.equal(isArmstrongNumbers(value), true);
  for (const value of [-1, 123, 9475, NaN]) assert.equal(isArmstrongNumbers(value), false);
});
