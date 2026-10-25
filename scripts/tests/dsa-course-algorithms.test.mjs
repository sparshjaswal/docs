import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Exercise the code readers actually copy, rather than a separate test-only implementation.
function lessonFunctions(lesson, names, blockIndex = 0) {
  const file = new URL(`../../docs/DSA/${lesson}/README.md`, import.meta.url);
  const markdown = readFileSync(file, 'utf8');
  const blocks = [...markdown.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)];
  assert.ok(blocks[blockIndex], `Missing runnable block: ${fileURLToPath(file)}`);
  return vm.runInNewContext(`${blocks[blockIndex][1]}\n;({ ${names.join(', ')} });`, {
    console: { log() {} },
  }, { timeout: 5000 });
}

const plain = (value) => JSON.parse(JSON.stringify(value));

function trialPrime(number) {
  if (number < 2) return false;
  for (let candidate = 2; candidate < number; candidate++) {
    if (number % candidate === 0) return false;
  }
  return true;
}

test('documented divisors, factorization, GCD, and LCM agree with small exhaustive oracles', () => {
  const { divisorsOf, primeFactorsOf } = lessonFunctions('math/prime-factors', [
    'divisorsOf', 'primeFactorsOf',
  ]);
  const { gcd } = lessonFunctions('math/euclidean-algorithm', ['gcd']);
  const { lcm } = lessonFunctions('math/least-common-multiple', ['lcm']);
  for (let number = 1; number <= 250; number++) {
    const expected = [];
    for (let divisor = 1; divisor <= number; divisor++) {
      if (number % divisor === 0) expected.push(divisor);
    }
    assert.deepEqual(plain(divisorsOf(number)), expected);
    const factors = primeFactorsOf(number);
    assert.ok(factors.every(trialPrime));
    assert.equal(factors.reduce((product, factor) => product * factor, 1), number);
  }
  for (let a = -20; a <= 20; a++) {
    for (let b = -20; b <= 20; b++) {
      let expectedGcd = 0;
      for (let divisor = 1; divisor <= Math.max(Math.abs(a), Math.abs(b)); divisor++) {
        if (a % divisor === 0 && b % divisor === 0) expectedGcd = divisor;
      }
      assert.equal(gcd(a, b), expectedGcd);
      let expectedLcm = 0;
      if (a !== 0 && b !== 0) {
        expectedLcm = 1;
        while (expectedLcm % a !== 0 || expectedLcm % b !== 0) expectedLcm++;
      }
      assert.equal(lcm(BigInt(a), BigInt(b)), BigInt(expectedLcm));
    }
  }
  assert.throws(() => primeFactorsOf(0), /positive safe integer/);
  assert.throws(() => gcd(Number.MAX_SAFE_INTEGER + 1, 2), /safe integers/);
});

test('documented sieve and SPF handle small bounds and repeated factors', () => {
  const { primeTable } = lessonFunctions('math/sieve-of-eratosthenes', ['primeTable']);
  const { smallestPrimeFactors, factorWithTable } = lessonFunctions(
    'math/sieve-of-eratosthenes', ['smallestPrimeFactors', 'factorWithTable'], 1,
  );
  for (const limit of [0, 1, 2, 10, 100, 250]) {
    const table = primeTable(limit);
    const spf = smallestPrimeFactors(limit);
    assert.equal(table.length, limit + 1);
    for (let number = 0; number <= limit; number++) {
      assert.equal(table[number], trialPrime(number));
      if (number < 1) continue;
      const factors = factorWithTable(number, spf);
      assert.equal(factors.reduce((product, factor) => product * factor, 1), number);
      assert.ok(factors.every(trialPrime));
    }
  }
  assert.throws(() => factorWithTable(11, smallestPrimeFactors(10)), /table limit/);
});

test('documented powers and modular inverses agree with exact powers and residue search', () => {
  const { power } = lessonFunctions('math/fast-powering', ['power']);
  const { modPow } = lessonFunctions('math/modular-arithmetic', ['modPow']);
  const { modularInverse } = lessonFunctions('math/modular-arithmetic', ['modularInverse'], 1);
  for (let base = -5n; base <= 5n; base++) {
    for (let exponent = 0n; exponent <= 16n; exponent++) {
      const exact = base ** exponent;
      assert.equal(power(base, exponent), exact);
      for (let modulus = 1n; modulus <= 13n; modulus++) {
        assert.equal(modPow(base, exponent, modulus), ((exact % modulus) + modulus) % modulus);
      }
    }
  }
  for (let modulus = 2n; modulus <= 25n; modulus++) {
    for (let value = -25n; value <= 25n; value++) {
      let expected = null;
      for (let candidate = 0n; candidate < modulus; candidate++) {
        if (((value * candidate % modulus) + modulus) % modulus === 1n) {
          expected = candidate;
          break;
        }
      }
      assert.equal(modularInverse(value, modulus), expected);
    }
  }
  assert.throws(() => modPow(1n, -1n, 7n), /nonnegative exponent/);
  assert.throws(() => modPow(1n, 2n, 0n), /positive modulus/);
});

test('documented binomial formulas match independent Pascal recurrence', () => {
  const { choose } = lessonFunctions('math/combinatorics', ['choose']);
  const { binomialTable } = lessonFunctions('math/combinatorics', ['binomialTable'], 1);
  const modular = binomialTable(30, 101n);
  let row = [1n];
  for (let n = 0; n <= 30; n++) {
    for (let r = 0; r <= n; r++) {
      assert.equal(choose(n, r), row[r]);
      assert.equal(modular(n, r), row[r] % 101n);
    }
    row = [1n, ...row.slice(1).map((value, index) => value + row[index]), 1n];
  }
  assert.equal(choose(60, 30), 118264581564861424n);
  assert.equal(choose(3, -1), 0n);
  assert.equal(modular(3, 4), 0n);
  assert.throws(() => binomialTable(7, 7n), /known prime modulus/);
});

test('documented Pascal triangle counts subsets and uses independent row arrays', () => {
  const { pascalTriangle } = lessonFunctions('math/pascal-triangle', ['pascalTriangle']);
  assert.deepEqual(plain(pascalTriangle(0)), []);
  const rows = pascalTriangle(12);
  for (let n = 0; n < rows.length; n++) {
    assert.equal(rows[n].length, n + 1);
    assert.equal(rows[n].reduce((sum, value) => sum + value, 0n), 2n ** BigInt(n));
    assert.equal(rows[n][0], 1n);
    assert.equal(rows[n][n], 1n);
    assert.deepEqual(Array.from(rows[n]), Array.from(rows[n]).reverse());
  }
  rows[2][0] = 99n;
  assert.equal(rows[1][0], 1n);
  assert.equal(rows[3][0], 1n);
});

function smallArrays(alphabet, maximumLength) {
  const arrays = [[]];
  let layer = [[]];
  for (let length = 1; length <= maximumLength; length++) {
    layer = layer.flatMap((prefix) => alphabet.map((value) => [...prefix, value]));
    arrays.push(...layer);
  }
  return arrays;
}

test('documented comparison and digit sorts handle duplicates, mutation, and stability', () => {
  const { mergeSort } = lessonFunctions('sorting/merge-sort', ['mergeSort']);
  const { quickSort } = lessonFunctions('sorting/quick-sort', ['quickSort']);
  const { countingSortByKey } = lessonFunctions('sorting/counting-sort', ['countingSortByKey']);
  const { radixSort } = lessonFunctions('sorting/radix-sort', ['radixSort']);
  for (const values of smallArrays([-1, 0, 1], 5)) {
    const expected = [...values].sort((a, b) => a - b);
    const copy = [...values];
    assert.deepEqual(plain(mergeSort(values)), expected);
    assert.deepEqual(values, copy, 'merge sort must leave input unchanged');
    assert.notEqual(mergeSort(values), values);
    const mutable = [...values];
    assert.equal(quickSort(mutable), mutable);
    assert.deepEqual(mutable, expected);
    const records = values.map((key, index) => ({ key, index }));
    assert.deepEqual(
      plain(countingSortByKey(records, (record) => record.key, -1, 1)),
      [...records].sort((a, b) => a.key - b.key),
    );
    const nonnegative = values.map((value) => (value + 1) * 13);
    assert.deepEqual(plain(radixSort(nonnegative)), [...nonnegative].sort((a, b) => a - b));
  }
  const boundary = [1_000_000_000, 0, 99, 10, 9, 100, 1_000_000_000];
  assert.deepEqual(plain(radixSort(boundary)), [...boundary].sort((a, b) => a - b));
  assert.throws(() => radixSort([-1]), /Expected integers/);
  assert.throws(() => countingSortByKey([2], (value) => value, 0, 1), /outside/);
});

test('documented trie operations match a Set through shared-prefix deletion and empty words', () => {
  const { Trie } = lessonFunctions('trie', ['Trie']);
  const trie = new Trie();
  const oracle = new Set();
  const candidates = ['', 'a', 'ab', 'abc', 'ac', 'b', 'ba', 'car', 'cart', 'cat', '😀'];
  function check() {
    for (const prefix of candidates) {
      assert.equal(trie.has(prefix), oracle.has(prefix));
      const expected = [...oracle].filter((word) => word.startsWith(prefix)).sort();
      assert.equal(trie.startsWith(prefix), prefix === '' || expected.length > 0);
      for (const limit of [0, 1, 3, 100]) {
        assert.deepEqual(plain(trie.suggestions(prefix, limit)), expected.slice(0, limit));
      }
    }
  }
  for (const word of [...candidates, 'car', 'ab']) {
    trie.insert(word);
    oracle.add(word);
    check();
  }
  for (const word of ['car', 'ca', 'abc', 'a', 'cart', '', ...candidates]) {
    assert.equal(trie.remove(word), oracle.delete(word));
    check();
  }
});

test('documented union-find agrees with graph traversal after repeated and self unions', () => {
  const { UnionFind } = lessonFunctions('disjoint-set', ['UnionFind']);
  const count = 7;
  const groups = new UnionFind(count);
  const neighbors = Array.from({ length: count }, () => new Set());
  function reachable(start) {
    const seen = new Set([start]);
    const pending = [start];
    while (pending.length > 0) {
      for (const next of neighbors[pending.pop()]) {
        if (seen.has(next)) continue;
        seen.add(next);
        pending.push(next);
      }
    }
    return seen;
  }
  for (const [a, b] of [[0, 1], [2, 3], [1, 3], [0, 2], [4, 4], [4, 5], [3, 5]]) {
    const alreadyConnected = reachable(a).has(b);
    assert.equal(groups.union(a, b), !alreadyConnected);
    neighbors[a].add(b);
    neighbors[b].add(a);
    const allSeen = new Set();
    let expectedComponents = 0;
    for (let start = 0; start < count; start++) {
      const members = reachable(start);
      if (!allSeen.has(start)) expectedComponents++;
      for (const item of members) allSeen.add(item);
      for (let end = 0; end < count; end++) {
        assert.equal(groups.find(start) === groups.find(end), members.has(end));
      }
      assert.equal(groups.size[groups.find(start)], members.size);
    }
    assert.equal(groups.components, expectedComponents);
  }
  assert.equal(new UnionFind(0).components, 0);
  assert.throws(() => new UnionFind(0).find(0), /Invalid item/);
  assert.throws(() => groups.union(-1, 0), /Invalid item/);
  assert.throws(() => new UnionFind(1.5), /Invalid size/);
});

test('documented Fenwick and segment trees match naive sums through changing ranges', () => {
  const { Fenwick } = lessonFunctions('trees/fenwick-tree', ['Fenwick']);
  const { SegmentSum } = lessonFunctions('trees/segment-tree', ['SegmentSum']);
  for (let length = 0; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index % 5 - 2);
    const original = [...values];
    const fenwick = new Fenwick(length);
    values.forEach((value, index) => fenwick.add(index, value));
    const segments = new SegmentSum(values);
    function checkRanges() {
      for (let left = 0; left <= length; left++) {
        for (let right = left; right <= length; right++) {
          const expected = values.slice(left, right).reduce((sum, value) => sum + value, 0);
          assert.equal(fenwick.range(left, right), expected);
          assert.equal(segments.sum(left, right), expected);
        }
      }
    }
    checkRanges();
    assert.deepEqual(values, original, 'building must not mutate the input');
    for (const delta of [-4, 0, 7]) {
      for (let index = 0; index < length; index++) {
        values[index] += delta;
        fenwick.add(index, delta);
        segments.set(index, values[index]);
        checkRanges();
      }
    }
    assert.throws(() => fenwick.add(length, 1), /Invalid index/);
    assert.throws(() => segments.set(length, 1), /Invalid index/);
    assert.throws(() => fenwick.range(0, length + 1), /Invalid endpoint/);
    assert.throws(() => segments.sum(0, length + 1), /Invalid range/);
  }
  assert.throws(() => new Fenwick(2 ** 30), /Invalid size/);
  assert.throws(() => new Fenwick(1).add(0, NaN), /safe integer delta/);
  assert.throws(() => new SegmentSum([Infinity]), /safe integer values/);
  assert.throws(() => new SegmentSum([1]).set(0, 0.5), /safe integer value/);
});
