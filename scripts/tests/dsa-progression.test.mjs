import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

async function lessonFunctions(file, names) {
  const source = readFileSync(new URL(`../../docs/DSA/${file}`, import.meta.url), 'utf8');
  const block = [...source.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)]
    .find((match) => names.every((name) => match[1].includes(`function ${name}(`)));
  assert.ok(block, `Missing runnable block for ${names.join(', ')}`);
  return import(`data:text/javascript,${encodeURIComponent(
    `const console = { log() {} };\n${block[1]}\nexport { ${names.join(', ')} };`,
  )}`);
}

test('linked-list operations preserve node identities and handle empty, singleton, and cyclic lists', async () => {
  const { listFrom, reverseList, valuesOf } = await lessonFunctions('linked-list/README.md', ['listFrom', 'reverseList', 'valuesOf']);
  const { findMiddle, hasCycle } = await lessonFunctions('linked-list/README.md', ['findMiddle', 'hasCycle']);
  const { circularValues } = await lessonFunctions('linked-list/README.md', ['circularValues']);
  const { mergeTwoLists } = await lessonFunctions('linked-list/README.md', ['mergeTwoLists']);
  for (let size = 0; size <= 12; size++) {
    const values = Array.from({ length: size }, (_, i) => i % 3);
    const head = listFrom(values);
    const nodes = [];
    for (let node = head; node !== null; node = node.next) nodes.push(node);
    assert.equal(findMiddle(head), nodes[Math.floor(size / 2)] ?? null);
    assert.equal(hasCycle(head), false);
    const reversed = reverseList(head);
    assert.deepEqual(valuesOf(reversed), [...values].reverse());
    let node = reversed;
    for (const expected of [...nodes].reverse()) {
      assert.equal(node, expected);
      node = node.next;
    }
    assert.equal(reverseList(reversed), head);
    if (size) {
      nodes.at(-1).next = head;
      assert.equal(hasCycle(head), true);
      assert.deepEqual(circularValues(head), values);
      nodes.at(-1).next = nodes[Math.floor(size / 2)];
      assert.equal(hasCycle(head), true);
    }
  }
  assert.deepEqual(circularValues(null), []);
  const left = listFrom([-3, 0, 4]);
  const right = listFrom([-3, 2, 4]);
  assert.deepEqual(valuesOf(mergeTwoLists(left, right)), [-3, -3, 0, 2, 4, 4]);
  assert.equal(mergeTwoLists(null, null), null);
});

// Enumerate actual successive adjacent merges, independently of the interval recurrence.
function exhaustiveMerges(piles) {
  if (piles.length <= 1) return 0;
  let best = Infinity;
  for (let index = 0; index + 1 < piles.length; index++) {
    const merged = piles[index] + piles[index + 1];
    const next = [...piles.slice(0, index), merged, ...piles.slice(index + 2)];
    best = Math.min(best, merged + exhaustiveMerges(next));
  }
  return best;
}

test('interval DP agrees with exhaustive adjacent merge sequences', async () => {
  const { minimumMergeCost } = await lessonFunctions('dp/advanced.md', ['minimumMergeCost']);
  assert.equal(minimumMergeCost([]), 0);
  for (let size = 1; size <= 5; size++) {
    for (let encoded = 0; encoded < 3 ** size; encoded++) {
      const piles = Array.from({ length: size }, (_, i) => Math.floor(encoded / 3 ** i) % 3);
      const original = [...piles];
      assert.equal(minimumMergeCost(piles), exhaustiveMerges(piles));
      assert.deepEqual(piles, original);
    }
  }
});

function exhaustiveAssignment(cost, worker = 0, used = new Set()) {
  if (worker === cost.length) return 0;
  let best = Infinity;
  for (let job = 0; job < cost.length; job++) {
    if (used.has(job)) continue;
    used.add(job);
    best = Math.min(best, cost[worker][job] + exhaustiveAssignment(cost, worker + 1, used));
    used.delete(job);
  }
  return best;
}

test('subset DP matches permutation enumeration including negative costs and greedy counterexamples', async () => {
  const { minimumAssignmentCost } = await lessonFunctions('dp/advanced.md', ['minimumAssignmentCost']);
  assert.equal(minimumAssignmentCost([[1, 2], [1, 100]]), 3);
  assert.equal(minimumAssignmentCost([]), 0);
  for (let size = 1; size <= 6; size++) {
    for (let seed = 0; seed < 15; seed++) {
      const cost = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ((i + 3) * (j + 1) * (seed + 1) + j * j) % 13 - 4));
      assert.equal(minimumAssignmentCost(cost), exhaustiveAssignment(cost));
    }
  }
  assert.throws(() => minimumAssignmentCost([[1, 2]]), RangeError);
});

test('tree DP agrees with enumerating legal node subsets', async () => {
  const { bestTreeSelection } = await lessonFunctions('dp/advanced.md', ['bestTreeSelection']);
  assert.equal(bestTreeSelection(null), 0);
  for (let size = 1; size <= 10; size++) {
    const nodes = Array.from({ length: size }, (_, i) => ({ val: (i * 7 + size) % 11, left: null, right: null }));
    for (let i = 1; i < size; i++) {
      nodes[Math.floor((i - 1) / 2)][i % 2 ? 'left' : 'right'] = nodes[i];
    }
    let best = 0;
    for (let mask = 0; mask < 2 ** size; mask++) {
      let sum = 0;
      let valid = true;
      for (let i = 0; i < size; i++) {
        if (!(mask & (1 << i))) continue;
        if (i > 0 && (mask & (1 << Math.floor((i - 1) / 2)))) valid = false;
        sum += nodes[i].val;
      }
      if (valid) best = Math.max(best, sum);
    }
    assert.equal(bestTreeSelection(nodes[0]), best);
  }
  let chain = null;
  for (let i = 0; i < 20000; i++) chain = { val: 1, left: chain, right: null };
  assert.equal(bestTreeSelection(chain), 10000);
});

test('difference arrays match direct cell updates including negative additions and final boundaries', async () => {
  const { applyRangeAdditions } = await lessonFunctions('prefix-sum/README.md', ['applyRangeAdditions']);
  assert.deepEqual(applyRangeAdditions(0, []), []);
  for (let length = 1; length <= 12; length++) {
    const expected = Array(length).fill(0);
    const updates = [];
    for (let left = 0; left < length; left++) {
      for (let right = left; right < length; right++) {
        const amount = (left + right) % 7 - 3;
        updates.push([left, right, amount]);
        for (let index = left; index <= right; index++) expected[index] += amount;
      }
    }
    assert.deepEqual(applyRangeAdditions(length, updates), expected);
  }
});

test('roadmap snapshot coverage points to real lessons and preserves official learn/practice distinctions', () => {
  const snapshot = JSON.parse(readFileSync(new URL('../../data/codechef-dsa-roadmap.json', import.meta.url), 'utf8'));
  const checklist = readFileSync(new URL('../../docs/DSA/roadmap-coverage.md', import.meta.url), 'utf8');
  const urls = new Set();
  for (const section of snapshot.sections) {
    for (const entry of section.entries) {
      assert.equal(new URL(entry.url).hostname, 'www.codechef.com');
      assert.ok(!urls.has(entry.url), `Duplicate official path ${entry.url}`);
      urls.add(entry.url);
      assert.ok(checklist.includes(entry.url));
      assert.ok(entry.localLessons.length > 0);
      for (const file of entry.localLessons) {
        assert.ok(existsSync(new URL(`../../${file}`, import.meta.url)), file);
        assert.ok(checklist.includes(`./${file.replace('docs/DSA/', '')}`), file);
      }
    }
  }
  assert.deepEqual(snapshot.sections.map((section) => section.entries.length), [8, 10, 5, 9]);
});
