import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Run the displayed lesson code rather than a second copy of each algorithm.
async function lessonFunctions(relativePath, names) {
  const source = readFileSync(new URL(`../../docs/DSA/${relativePath}/README.md`, import.meta.url), 'utf8');
  const blocks = [...source.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)]
    .map((match) => match[1])
    .filter((block) => names.some((name) =>
      block.includes(`function ${name}(`) || block.includes(`class ${name} {`)));
  const code = blocks.join('\n').replace(/^console\.log\([^\n]*$/gm, '');
  return import(`data:text/javascript,${encodeURIComponent(`${code}\nexport { ${names.join(', ')} };`)}`);
}

test('Dijkstra lesson matches an independent all-pairs oracle on small nonnegative graphs', async () => {
  const { dijkstra, reconstructPath } = await lessonFunctions('graphs/dijkstra', ['dijkstra', 'reconstructPath']);
  const edges = [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]];
  // Each directed edge is absent, zero-weight, weight 1, or weight 3.
  for (let encoding = 0; encoding < 4 ** edges.length; encoding++) {
    let remaining = encoding;
    const graph = [[], [], []];
    const oracle = Array.from({ length: 3 }, (_, from) =>
      Array.from({ length: 3 }, (_, to) => from === to ? 0 : Infinity));
    for (const [from, to] of edges) {
      const choice = remaining % 4;
      remaining = Math.floor(remaining / 4);
      if (choice === 0) continue;
      const weight = [0, 0, 1, 3][choice];
      graph[from].push({ to, weight });
      oracle[from][to] = weight;
    }
    // Floyd–Warshall allows each intermediate vertex in turn.
    for (let via = 0; via < 3; via++) {
      for (let from = 0; from < 3; from++) {
        for (let to = 0; to < 3; to++) {
          oracle[from][to] = Math.min(oracle[from][to], oracle[from][via] + oracle[via][to]);
        }
      }
    }
    for (let source = 0; source < 3; source++) {
      const result = dijkstra(graph, source);
      assert.deepEqual(result.distances, oracle[source]);
      for (let target = 0; target < 3; target++) {
        const path = reconstructPath(result, target);
        if (oracle[source][target] === Infinity) {
          assert.deepEqual(path, []);
          continue;
        }
        assert.equal(path[0], source);
        assert.equal(path.at(-1), target);
        assert.equal(new Set(path).size, path.length, 'Parent chain must not contain a cycle');
        let cost = 0;
        for (let index = 1; index < path.length; index++) {
          cost += graph[path[index - 1]].find((edge) => edge.to === path[index]).weight;
        }
        assert.equal(cost, oracle[source][target]);
      }
    }
  }
  assert.deepEqual(dijkstra([[]], 0), { distances: [0], parents: [-1] });
  assert.deepEqual(dijkstra([
    [{ to: 0, weight: 0 }, { to: 1, weight: 9 }, { to: 1, weight: 2 }], [],
  ], 0).distances, [0, 2]);
});

test('tree lessons handle empty, asymmetric, duplicate-value, and deep inputs', async () => {
  const { preorderTraversal } = await lessonFunctions('trees', ['preorderTraversal']);
  const { levelOrder } = await lessonFunctions('trees', ['levelOrder']);
  const { inorderTraversal, maxDepth } = await lessonFunctions('trees', ['inorderTraversal', 'maxDepth']);
  const { countLeaves } = await lessonFunctions('trees', ['countLeaves']);
  const node = (val, left = null, right = null) => ({ val, left, right });
  const root = node(8, node(2, null, node(8)), node(2, node(5), null));
  const before = JSON.stringify(root);
  assert.deepEqual(preorderTraversal(root), [8, 2, 8, 2, 5]);
  assert.deepEqual(inorderTraversal(root), [2, 8, 8, 5, 2]);
  assert.deepEqual(levelOrder(root), [[8], [2, 2], [8, 5]]);
  assert.equal(maxDepth(root), 3);
  assert.equal(countLeaves(root), 2);
  assert.equal(JSON.stringify(root), before, 'Traversal must not mutate child references');
  for (const traversal of [preorderTraversal, inorderTraversal, levelOrder]) {
    assert.deepEqual(traversal(null), []);
  }
  assert.equal(maxDepth(null), 0);
  assert.equal(countLeaves(null), 0);
  assert.equal(countLeaves(node(0)), 1);

  let deep = null;
  for (let value = 19999; value >= 0; value--) deep = node(value, null, deep);
  const preorder = preorderTraversal(deep);
  assert.equal(preorder.length, 20000);
  assert.equal(preorder[0], 0);
  assert.equal(preorder.at(-1), 19999);
  assert.equal(levelOrder(deep).length, 20000);
  assert.equal(countLeaves(deep), 1);
});

test('ancestor lesson compares node identity and handles a target above another', async () => {
  const { lowestCommonAncestor } = await lessonFunctions('trees', ['lowestCommonAncestor']);
  const first = { val: 7, left: null, right: null };
  const second = { val: 7, left: null, right: null };
  const parent = { val: 7, left: first, right: second };
  const root = { val: 7, left: parent, right: { val: 7, left: null, right: null } };
  assert.equal(lowestCommonAncestor(root, first, second), parent);
  assert.equal(lowestCommonAncestor(root, parent, second), parent);
  assert.equal(lowestCommonAncestor(root, first, root.right), root);
});

test('priority queue lesson preserves priority and arrival-order ties during interleaved operations', async () => {
  const { ScanPriorityQueue } = await lessonFunctions('priority-queue', ['ScanPriorityQueue']);
  const queue = new ScanPriorityQueue();
  const expected = [];
  assert.equal(queue.peek(), undefined);
  assert.equal(queue.dequeue(), undefined);
  for (let step = 0; step < 900; step++) {
    if (step % 3 !== 2) {
      const priority = (step * 17 + Math.floor(step / 7)) % 7 - 3;
      queue.enqueue(step, priority);
      expected.push({ value: step, priority, order: step });
    } else {
      expected.sort((first, second) => first.priority - second.priority || first.order - second.order);
      assert.equal(queue.dequeue(), expected.shift()?.value);
    }
    expected.sort((first, second) => first.priority - second.priority || first.order - second.order);
    assert.equal(queue.peek(), expected[0]?.value);
    assert.equal(queue.size, expected.length);
  }
  while (expected.length > 0) assert.equal(queue.dequeue(), expected.shift().value);
  assert.equal(queue.size, 0);
  assert.equal(queue.dequeue(), undefined);
  queue.enqueue(undefined, 0);
  assert.equal(queue.size, 1);
  assert.equal(queue.dequeue(), undefined);
  assert.equal(queue.size, 0);
  for (const priority of [NaN, Infinity, -Infinity, '1']) {
    assert.throws(() => queue.enqueue('invalid', priority), RangeError);
  }
});

test('LRU lesson matches an independent array model and preserves both directions of every link', async () => {
  const { LRUCache } = await lessonFunctions('lru-cache', ['LRUCache']);
  for (let capacity = 0; capacity <= 5; capacity++) {
    const cache = new LRUCache(capacity);
    const expected = [];
    const inspect = () => {
      const actual = [];
      const visited = new Set();
      let previous = cache.oldest;
      for (let node = cache.oldest.next; node !== cache.newest; node = node.next) {
        assert.ok(!visited.has(node), 'Forward links must not cycle');
        visited.add(node);
        assert.equal(node.previous, previous);
        assert.equal(cache.nodes.get(node.key), node);
        actual.push({ key: node.key, value: node.value });
        previous = node;
      }
      assert.equal(cache.newest.previous, previous);
      assert.deepEqual(actual, expected);
      assert.equal(cache.nodes.size, expected.length);
      assert.ok(expected.length <= capacity);
      let next = cache.newest;
      for (let index = expected.length - 1; index >= 0; index--) {
        const node = next.previous;
        assert.equal(node.next, next);
        assert.equal(node.key, expected[index].key);
        next = node;
      }
      assert.equal(next.previous, cache.oldest);
      assert.equal(cache.oldest.next, next);
    };
    for (let step = 0; step < 600; step++) {
      const key = (step * 7 + Math.floor(step / 3)) % 9;
      const index = expected.findIndex((entry) => entry.key === key);
      if (step % 4 !== 3) {
        const value = step % 13; // Includes stored zero and repeated updates.
        cache.put(key, value);
        if (index >= 0) expected.splice(index, 1);
        expected.push({ key, value });
        if (expected.length > capacity) expected.shift();
      } else {
        const entry = index >= 0 ? expected.splice(index, 1)[0] : undefined;
        assert.equal(cache.get(key), entry?.value ?? -1);
        if (entry) expected.push(entry);
      }
      inspect();
    }
  }
  const single = new LRUCache(1);
  single.put(0, 0);
  assert.equal(single.get(0), 0);
  single.put(0, 7);
  assert.equal(single.nodes.size, 1);
  assert.equal(single.get(0), 7);
  single.put(1, 9);
  assert.equal(single.get(0), -1);
  assert.equal(single.get(1), 9);
  for (const capacity of [-1, 0.5, NaN, Infinity]) {
    assert.throws(() => new LRUCache(capacity), RangeError);
  }
});
