import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Exercise the functions readers see, without copying their implementations into tests.
async function lessonFunction(relativePath, name) {
  const source = readFileSync(
    new URL(`../../docs/DSA/${relativePath}/README.md`, import.meta.url),
    'utf8',
  );
  const block = [...source.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)].find(
    (match) =>
      match[1].includes(`function ${name}(`) ||
      match[1].includes(`function* ${name}(`) ||
      match[1].includes(`class ${name} {`),
  );
  assert.ok(block, `Missing runnable ${name}`);
  const code = block[1].replace(/^console\.log\([^\n]*\);?$/gm, '');
  const module = await import(
    `data:text/javascript,${encodeURIComponent(`${code}\nexport { ${name} };`)}`
  );
  return module[name];
}

const binaryStrings = [
  '',
  ...Array.from({ length: 4 }, (_, index) =>
    Array.from({ length: 2 ** (index + 1) }, (_, number) =>
      number
        .toString(2)
        .padStart(index + 1, '0')
        .replaceAll('0', 'a')
        .replaceAll('1', 'b'),
    ),
  ).flat(),
];

function subsequences(text) {
  return Array.from({ length: 2 ** text.length }, (_, mask) =>
    [...text].filter((_, index) => mask & (1 << index)).join(''),
  );
}
function isSubsequence(candidate, text) {
  let index = 0;
  for (const character of text) if (character === candidate[index]) index++;
  return index === candidate.length;
}

test('KMP and Z lesson examples agree with direct comparisons on repeated-prefix inputs', async () => {
  const kmp = await lessonFunction('strings/knuth-morris-pratt', 'kmp');
  const zArray = await lessonFunction('strings/z-algorithm', 'zArray');
  for (const text of binaryStrings) {
    for (const pattern of binaryStrings) assert.equal(kmp(text, pattern), text.indexOf(pattern));
    const expected = Array(text.length).fill(0);
    for (let index = 1; index < text.length; index++) {
      while (
        index + expected[index] < text.length &&
        text[expected[index]] === text[index + expected[index]]
      )
        expected[index]++;
    }
    assert.deepEqual(zArray(text), expected);
  }
});

test('sequence lesson recurrences agree with exhaustive small-string oracles', async () => {
  const lcsLength = await lessonFunction('sets/longest-common-subsequence', 'lcsLength');
  const scs = await lessonFunction(
    'sets/shortest-common-supersequence',
    'shortestCommonSupersequence',
  );
  const substring = await lessonFunction(
    'strings/longest-common-substring',
    'longestCommonSubstring',
  );
  for (const first of binaryStrings) {
    for (const second of binaryStrings) {
      const expectedLcs = Math.max(
        ...subsequences(first)
          .filter((value) => isSubsequence(value, second))
          .map((value) => value.length),
      );
      assert.equal(lcsLength(first, second), expectedLcs);
      const sequence = scs(first, second);
      assert.ok(isSubsequence(first, sequence) && isSubsequence(second, sequence));
      assert.equal(sequence.length, first.length + second.length - expectedLcs);
      let expectedSubstring = 0;
      for (let start = 0; start < first.length; start++) {
        for (let end = start + 1; end <= first.length; end++) {
          if (second.includes(first.slice(start, end)))
            expectedSubstring = Math.max(expectedSubstring, end - start);
        }
      }
      const result = substring(first, second);
      assert.equal(result.length, expectedSubstring);
      assert.ok(first.includes(result) && second.includes(result));
    }
  }
});

test('restricted regex lesson agrees with anchored native matching for its valid grammar', async () => {
  const matches = await lessonFunction('strings/regular-expression-matching', 'matches');
  const patterns = [
    '',
    'a',
    'b',
    '.',
    'a*',
    'b*',
    '.*',
    'a*b',
    '.*a',
    'a*b*',
    'ab*',
    'a.*b',
    'c*a*b',
  ];
  for (const text of binaryStrings) {
    for (const pattern of patterns)
      assert.equal(
        matches(text, pattern),
        new RegExp(`^(?:${pattern})$`).test(text),
        `${text} / ${pattern}`,
      );
  }
});

function reachable(graph, start) {
  const seen = new Set([start]);
  const pending = [start];
  while (pending.length) {
    for (const next of graph[pending.pop()]) {
      if (!seen.has(next)) {
        seen.add(next);
        pending.push(next);
      }
    }
  }
  return seen;
}

test('bridge and strongly-connected lesson results match independent reachability checks', async () => {
  const bridges = await lessonFunction('graphs/bridges', 'findBridges');
  const components = await lessonFunction(
    'graphs/strongly-connected-components',
    'stronglyConnectedComponents',
  );
  const undirected = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  const directed = [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
  ];
  for (let mask = 0; mask < 64; mask++) {
    const edges = undirected.filter((_, i) => mask & (1 << i));
    const expected = [];
    edges.forEach(([u, v], removed) => {
      const graph = Array.from({ length: 4 }, () => []);
      edges.forEach(([a, b], i) => {
        if (i !== removed) {
          graph[a].push(b);
          graph[b].push(a);
        }
      });
      if (!reachable(graph, u).has(v)) expected.push(`${u},${v}`);
    });
    assert.deepEqual(
      bridges(4, edges)
        .map((edge) => edge.sort((a, b) => a - b).join(','))
        .sort(),
      expected.sort(),
    );
    const graph = Array.from({ length: 3 }, () => []);
    directed.forEach(([u, v], i) => {
      if (mask & (1 << i)) graph[u].push(v);
    });
    const groups = components(graph);
    assert.deepEqual(groups.flat().sort(), [0, 1, 2]);
    for (let u = 0; u < 3; u++) {
      for (let v = 0; v < 3; v++) {
        const same = groups.some((group) => group.includes(u) && group.includes(v));
        assert.equal(same, reachable(graph, u).has(v) && reachable(graph, v).has(u));
      }
    }
  }
});

function permutations(values) {
  if (values.length === 0) return [[]];
  return values.flatMap((value, index) =>
    permutations(values.filter((_, i) => i !== index)).map((rest) => [value, ...rest]),
  );
}

test('array lesson operations preserve order at boundaries and remove only the first match', async () => {
  const insertAt = await lessonFunction('Array', 'insertAt');
  const removeAt = await lessonFunction('Array', 'removeAt');
  const removeValue = await lessonFunction('Array', 'removeValue');
  const binarySearch = await lessonFunction('Array', 'binarySearch');
  for (const values of [[], [2], [1, 2, 2, 4]]) {
    for (let index = 0; index <= values.length; index++) {
      const actual = [...values];
      insertAt(actual, index, 9);
      assert.deepEqual(actual, [...values.slice(0, index), 9, ...values.slice(index)]);
      assert.equal(removeAt(actual, index), 9);
      assert.deepEqual(actual, values);
    }
    for (let target = 0; target < 6; target++) {
      const index = binarySearch(values, target);
      if (values.includes(target)) assert.equal(values[index], target);
      else assert.equal(index, -1);
    }
  }
  const duplicateValues = [3, 1, 3, 2];
  assert.equal(removeValue(duplicateValues, 3), true);
  assert.deepEqual(duplicateValues, [1, 3, 2]);
  assert.equal(removeValue(duplicateValues, 99), false);
  for (const index of [-1, 0.5, NaN, 4]) {
    assert.throws(() => insertAt([1, 2], index, 0), RangeError);
    assert.throws(() => removeAt([1, 2], index), RangeError);
  }
  assert.throws(() => removeAt([], 0), RangeError);
});

test('linked-list lesson endpoints and both directions stay consistent through mixed edits', async () => {
  for (const [topic, name] of [
    ['binary-search/linked-list', 'LinkedList'],
    ['doubly-linked-list', 'DoublyLinkedList'],
  ]) {
    const List = await lessonFunction(topic, name);
    const list = new List();
    const expected = [];
    const check = () => {
      const values = [];
      let previous = null;
      for (let node = list.head; node !== null; node = node.next) {
        assert.ok(values.length <= expected.length, 'List must not contain a cycle');
        if (name === 'DoublyLinkedList') assert.equal(node.previous, previous);
        values.push(node.value);
        previous = node;
      }
      assert.deepEqual(values, expected);
      assert.equal(list.tail, previous);
      assert.deepEqual([...list.reverseValues()], [...expected].reverse());
      if (expected.length === 0) assert.equal(list.head, null);
      if (list.contains) {
        for (let value = 0; value < 7; value++)
          assert.equal(list.contains(value), expected.includes(value));
      }
    };
    assert.equal(list.remove(0), false);
    for (let step = 0; step < 120; step++) {
      const value = (step * 7 + Math.floor(step / 3)) % 6;
      if (step % 3 === 0) {
        const index = expected.indexOf(value);
        assert.equal(list.remove(value), index !== -1);
        if (index !== -1) expected.splice(index, 1);
      } else if (list.prepend && step % 2 === 0) {
        list.prepend(value);
        expected.unshift(value);
      } else {
        list.append(value);
        expected.push(value);
      }
      check();
    }
    while (expected.length) {
      const value = expected[expected.length - 1];
      expected.splice(expected.indexOf(value), 1);
      assert.equal(list.remove(value), true);
      check();
    }
  }
});

test('BST lesson handles every five-key shape, duplicate keys, and root deletion', async () => {
  const Tree = await lessonFunction('trees/binary-search-tree', 'BinarySearchTree');
  const keys = [-2, -1, 0, 1, 2];
  for (const insertionOrder of permutations(keys)) {
    for (const removalOrder of [keys, [...keys].reverse(), insertionOrder]) {
      const tree = new Tree();
      const remaining = new Set();
      const check = () => {
        const sorted = [...remaining].sort((a, b) => a - b);
        assert.deepEqual([...tree.inorder()], sorted);
        assert.equal(tree.size, sorted.length);
        assert.equal(tree.findMin(), sorted[0] ?? null);
        assert.equal(tree.findMax(), sorted.at(-1) ?? null);
        const inspect = (node, min, max, parent) => {
          if (node === null) return;
          assert.ok(node.value > min && node.value < max);
          assert.equal(tree.findParent(node.value), parent);
          assert.equal(tree.findNode(node.value), node);
          inspect(node.left, min, node.value, node);
          inspect(node.right, node.value, max, node);
        };
        inspect(tree.root, -Infinity, Infinity, null);
        for (const key of keys) assert.equal(tree.contains(key), remaining.has(key));
      };
      for (const key of insertionOrder) {
        assert.equal(tree.insert(key), true);
        remaining.add(key);
        assert.equal(tree.insert(key), false);
        check();
      }
      assert.equal(tree.remove(99), false);
      for (const key of removalOrder) {
        assert.equal(tree.remove(key), true);
        remaining.delete(key);
        assert.equal(tree.remove(key), false);
        check();
      }
      assert.equal(tree.root, null);
    }
  }
  const tree = new Tree();
  tree.insert(1);
  assert.throws(() => tree.remove(NaN), TypeError);
  assert.throws(() => tree.insert(Infinity), TypeError);
  assert.deepEqual([...tree.inorder()], [1]);
});

function componentCount(n, edges, removed = -1) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    if (u !== removed && v !== removed) {
      graph[u].push(v);
      graph[v].push(u);
    }
  }
  const seen = new Set([removed]);
  let count = 0;
  for (let vertex = 0; vertex < n; vertex++) {
    if (seen.has(vertex)) continue;
    count++;
    for (const reached of reachable(graph, vertex)) seen.add(reached);
  }
  return count;
}

test('articulation points and Hamiltonian cycles agree with exhaustive small-graph checks', async () => {
  const points = await lessonFunction('graphs/articulation-points', 'findArticulationPoints');
  const cycle = await lessonFunction('graphs/hamiltonian-cycle', 'hamiltonianCycle');
  const naiveCycle = await lessonFunction('graphs/hamiltonian-cycle', 'naiveHamiltonianCycle');
  const possibleEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  for (let mask = 0; mask < 64; mask++) {
    const edges = possibleEdges.filter((_, i) => mask & (1 << i));
    const baseline = componentCount(4, edges);
    const expectedPoints = [0, 1, 2, 3].filter((v) => componentCount(4, edges, v) > baseline);
    assert.deepEqual(points(4, edges), expectedPoints);
    assert.deepEqual(points(4, [...edges, ...edges, [0, 0]]), expectedPoints);
    const graph = Array.from({ length: 4 }, () => Array(4).fill(false));
    for (const [u, v] of edges) graph[u][v] = graph[v][u] = true;
    const expected =
      permutations([1, 2, 3])
        .map((order) => [0, ...order, 0])
        .find((route) => route.slice(1).every((v, i) => graph[route[i]][v])) ?? null;
    assert.deepEqual(cycle(graph), expected);
    assert.deepEqual(naiveCycle(graph), expected);
  }
  assert.deepEqual(points(0, []), []);
  assert.equal(cycle([]), null);
  assert.equal(
    cycle([
      [false, true],
      [true, false],
    ]),
    null,
  );
});

test('Floyd-Warshall handles parallel edges, unreachable nodes, and negative cycles', async () => {
  const shortestPaths = await lessonFunction('graphs/floyd-warshall', 'floydWarshall');
  // Enumerate signed DAGs, then find each answer by exploring every path.
  const pairs = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  for (let state = 0; state < 3 ** pairs.length; state++) {
    let encoded = state;
    const edges = [];
    for (const [u, v] of pairs) {
      const choice = encoded % 3;
      encoded = Math.floor(encoded / 3);
      if (choice) edges.push([u, v, choice === 1 ? -2 : 3]);
    }
    const expected = Array.from({ length: 4 }, () => Array(4).fill(Infinity));
    for (let start = 0; start < 4; start++) {
      const explore = (u, cost) => {
        expected[start][u] = Math.min(expected[start][u], cost);
        for (const [from, to, weight] of edges) if (from === u) explore(to, cost + weight);
      };
      explore(start, 0);
    }
    assert.deepEqual(shortestPaths(4, edges), expected);
  }
  assert.deepEqual(
    shortestPaths(2, [
      [0, 1, 5],
      [0, 1, 2],
    ]),
    [
      [0, 2],
      [Infinity, 0],
    ],
  );
  assert.deepEqual(
    shortestPaths(2, [
      [0, 1, -1],
      [1, 0, 2],
    ]),
    [
      [0, -1],
      [2, 0],
    ],
  );
  assert.deepEqual(shortestPaths(0, []), []);
  assert.throws(() => shortestPaths(1, [[0, 0, -1]]), RangeError);
  assert.throws(
    () =>
      shortestPaths(3, [
        [1, 2, -2],
        [2, 1, 1],
      ]),
    RangeError,
  );
});

test('travelling-salesman subset DP agrees with every tour on small directed matrices', async () => {
  const cheapest = await lessonFunction('graphs/travelling-salesman', 'travellingSalesman');
  const orders = permutations([1, 2, 3]);
  for (let seed = 0; seed < 80; seed++) {
    const cost = Array.from({ length: 4 }, (_, from) =>
      Array.from({ length: 4 }, (_, to) => {
        if (from === to) return 0;
        const value = (seed * (from + 1) + to * 7 + from * 3) % 13;
        return value < 2 ? Infinity : value - 4;
      }),
    );
    const original = cost.map((row) => [...row]);
    const expected = Math.min(
      ...orders.map((order) => {
        const route = [0, ...order, 0];
        return route.slice(1).reduce((total, to, i) => total + cost[route[i]][to], 0);
      }),
    );
    assert.equal(cheapest(cost), expected);
    assert.deepEqual(cost, original);
  }
  assert.equal(cheapest([]), 0);
  assert.equal(cheapest([[0]]), 0);
  assert.throws(() => cheapest([[0], [1, 0]]), TypeError);
  assert.throws(() => cheapest(Array(19)), RangeError);
});

test('N-Queens implementations return safe placements and reject impossible boards', async () => {
  const naive = await lessonFunction('uncategorized/n-queens', 'naiveNQueens');
  const solve = await lessonFunction('uncategorized/n-queens', 'solveNQueens');
  for (let n = 0; n <= 8; n++) {
    const result = solve(n);
    if (n <= 5) assert.deepEqual(result, naive(n));
    if (n === 2 || n === 3) assert.equal(result, null);
    else {
      assert.equal(result.length, n);
      assert.ok(result.every((column) => Number.isInteger(column) && column >= 0 && column < n));
      assert.equal(new Set(result).size, n);
      assert.equal(new Set(result.map((column, row) => row - column)).size, n);
      assert.equal(new Set(result.map((column, row) => row + column)).size, n);
    }
  }
  for (const n of [-1, 1.5, NaN]) {
    assert.throws(() => solve(n), RangeError);
    assert.throws(() => naive(n), RangeError);
  }
});

test('interpolation search handles duplicates, uneven values, and extreme finite ranges', async () => {
  const search = await lessonFunction('search/interpolation-search', 'interpolationSearch');
  for (const values of [[], [7], [7, 7, 7], [-100, -3, -3, 0, 100000], [-1e308, 0, 1e308]]) {
    for (const target of [...values, -2, 9, 100001]) {
      const result = search(values, target);
      if (values.includes(target)) assert.equal(values[result], target);
      else assert.equal(result, -1);
    }
  }
});

test('grid counts, power sets, and level traversal respect their boundary contracts', async () => {
  const count = await lessonFunction('uncategorized/unique-paths', 'uniquePaths');
  for (let width = 1; width <= 8; width++) {
    for (let height = 1; height <= 8; height++) {
      let expected = 1n;
      for (let i = 1; i < width; i++) expected = (expected * BigInt(height - 1 + i)) / BigInt(i);
      assert.equal(count(width, height), expected);
    }
  }
  assert.equal(count(30, 30), 30067266499541040n);
  assert.equal(count(0, 2), 0n);
  assert.throws(() => count(-1, 2), RangeError);
  const powerSet = await lessonFunction('sets/power-set', 'powerSet');
  assert.deepEqual(powerSet([1, 1, 2]), [[], [1], [2], [1, 2]]);
  assert.deepEqual(powerSet([]), [[]]);
  const input = [1, 2, 3, 4];
  const subsets = powerSet(input);
  assert.equal(new Set(subsets.map((values) => values.join(','))).size, 16);
  subsets[0].push(9);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.deepEqual(subsets[1], [1]);
  const levelOrder = await lessonFunction('graphs/breadth-first-search', 'levelOrder');
  const leaf = (value) => ({ value, left: null, right: null });
  const tree = { value: 1, left: { value: 2, left: leaf(4), right: null }, right: leaf(3) };
  const original = structuredClone(tree);
  assert.deepEqual(levelOrder(tree), [1, 2, 3, 4]);
  assert.deepEqual(tree, original);
  assert.deepEqual(levelOrder(null), []);
});
