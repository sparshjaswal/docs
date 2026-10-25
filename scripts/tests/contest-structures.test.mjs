import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Test the exact implementations learners can copy from runnable lesson blocks.
async function lessonExport(topic, name) {
  const source = readFileSync(
    new URL(`../../docs/DSA/${topic}/README.md`, import.meta.url),
    'utf8',
  );
  const block = [...source.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)].find(
    (match) => match[1].includes(`class ${name} {`) || match[1].includes(`function ${name}(`),
  );
  assert.ok(block, `Missing runnable ${name}`);
  const code = block[1].replace(/^console\.log\([^\n]*\);?$/gm, '');
  const module = await import(
    `data:text/javascript,${encodeURIComponent(`${code}\nexport { ${name} };`)}`
  );
  return module[name];
}

test('array queue preserves FIFO through compaction, emptying, and reuse', async () => {
  const ArrayQueue = await lessonExport('queue', 'ArrayQueue');
  const queue = new ArrayQueue();
  const oracle = [];
  const marker = { value: 42 };
  const values = [undefined, null, marker, 0, false, ''];
  for (let step = 0; step < 4000; step++) {
    if (step % 5 < 3) {
      const value = values[step % values.length];
      queue.enqueue(value);
      oracle.push(value);
    } else {
      assert.equal(queue.dequeue(), oracle.shift());
    }
    assert.equal(queue.size, oracle.length);
    assert.equal(queue.peek(), oracle[0]);
    assert.ok(queue.items.length <= 2 * queue.size);
    for (let index = 0; index < queue.head; index++) {
      assert.equal(queue.items[index], undefined);
    }
  }
  while (oracle.length) assert.equal(queue.dequeue(), oracle.shift());
  assert.equal(queue.size, 0);
  assert.equal(queue.dequeue(), undefined);
  assert.equal(queue.items.length, 0);
  queue.enqueue(marker);
  assert.equal(queue.dequeue(), marker);
});

test('comparator heap agrees with sorting for mixed operations, ties, and heapify', async () => {
  const BinaryHeap = await lessonExport('heap', 'BinaryHeap');
  for (const direction of [1, -1]) {
    const compare = (first, second) => direction * (first - second);
    const values = [3, -7, 3, 0, 8, -1];
    const original = values.slice();
    const heap = new BinaryHeap(compare, values);
    assert.deepEqual(values, original);
    const oracle = values.slice().sort(compare);
    for (let step = 0; step < 600; step++) {
      if (step % 3 !== 0) {
        const value = ((step * 37) % 31) - 15;
        heap.push(value);
        oracle.push(value);
        oracle.sort(compare);
      } else {
        assert.equal(heap.pop(), oracle.shift());
      }
      assert.equal(heap.peek(), oracle[0]);
      assert.equal(heap.size, oracle.length);
      for (let child = 1; child < heap.size; child++) {
        const parent = Math.floor((child - 1) / 2);
        assert.ok(compare(heap.data[parent], heap.data[child]) <= 0);
      }
    }
    while (oracle.length) assert.equal(heap.pop(), oracle.shift());
    assert.equal(heap.pop(), undefined);
    assert.equal(heap.peek(), undefined);
    heap.push(4);
    assert.equal(heap.pop(), 4);
    assert.equal(heap.size, 0);
  }
});

test('heap supports record tie breakers and exact large integer priorities', async () => {
  const BinaryHeap = await lessonExport('heap', 'BinaryHeap');
  const records = [{ priority: 2, order: 2 }, { priority: 1, order: 1 }, { priority: 2, order: 0 }];
  const compareRecords = (first, second) => first.priority - second.priority || first.order - second.order;
  const recordsHeap = new BinaryHeap(compareRecords, records);
  assert.deepEqual(
    Array.from({ length: records.length }, () => recordsHeap.pop()),
    records.slice().sort(compareRecords),
  );
  const compareBigInts = (first, second) => first < second ? -1 : first > second ? 1 : 0;
  const values = [9007199254740993n, -9007199254740993n, 9007199254740992n];
  const bigHeap = new BinaryHeap(compareBigInts, values);
  assert.deepEqual(
    Array.from({ length: values.length }, () => bigHeap.pop()),
    values.slice().sort(compareBigInts),
  );
});

test('spiral boundaries agree with a visited-cell walking oracle for rectangular shapes', async () => {
  const spiralOrder = await lessonExport('matrix', 'spiralOrder');
  for (let rows = 0; rows <= 7; rows++) {
    for (let columns = 0; columns <= 7; columns++) {
      const grid = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, column) => row * columns + column),
      );
      const before = JSON.stringify(grid);
      const expected = [];
      const seen = new Set();
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      let row = 0;
      let column = 0;
      let direction = 0;
      for (let step = 0; step < rows * columns; step++) {
        expected.push(grid[row][column]);
        seen.add(`${row},${column}`);
        let nextRow = row + directions[direction][0];
        let nextColumn = column + directions[direction][1];
        if (
          nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns ||
          seen.has(`${nextRow},${nextColumn}`)
        ) {
          direction = (direction + 1) % directions.length;
          nextRow = row + directions[direction][0];
          nextColumn = column + directions[direction][1];
        }
        row = nextRow;
        column = nextColumn;
      }
      assert.deepEqual(spiralOrder(grid), expected);
      assert.equal(JSON.stringify(grid), before);
    }
  }
  assert.deepEqual(spiralOrder([[4, 4], [4, 4]]), [4, 4, 4, 4]);
});

test('BFS distances match all-pairs shortest paths across every three-vertex directed graph', async () => {
  const bfsDistances = await lessonExport('graphs', 'bfsDistances');
  const dfsReachable = await lessonExport('graphs', 'dfsReachable');
  const size = 3;
  for (let mask = 0; mask < 2 ** (size * size); mask++) {
    const graph = Array.from({ length: size }, () => []);
    const distance = Array.from({ length: size }, (_, from) =>
      Array.from({ length: size }, (_, to) => from === to ? 0 : Infinity),
    );
    for (let from = 0; from < size; from++) {
      for (let to = 0; to < size; to++) {
        if (mask & (1 << (from * size + to))) {
          graph[from].push(to);
          distance[from][to] = Math.min(distance[from][to], 1);
        }
      }
    }
    for (let via = 0; via < size; via++) {
      for (let from = 0; from < size; from++) {
        for (let to = 0; to < size; to++) {
          distance[from][to] = Math.min(distance[from][to], distance[from][via] + distance[via][to]);
        }
      }
    }
    const before = JSON.stringify(graph);
    for (let start = 0; start < size; start++) {
      assert.deepEqual(
        bfsDistances(graph, start),
        distance[start].map(value => value === Infinity ? -1 : value),
      );
      assert.equal(dfsReachable(graph, start), distance[start].filter(Number.isFinite).length);
    }
    assert.equal(JSON.stringify(graph), before);
  }
  assert.deepEqual(bfsDistances([]), []);
  assert.deepEqual(bfsDistances([[1, 1], [], []], 0), [0, 1, -1]);
  assert.throws(() => bfsDistances([[]], -1), RangeError);
  assert.throws(() => bfsDistances([[]], 1), RangeError);
  assert.throws(() => bfsDistances([[]], 0.5), RangeError);
  assert.equal(dfsReachable([]), 0);
  assert.throws(() => dfsReachable([[]], 1), RangeError);
  const chain = Array.from({ length: 20000 }, (_, index) => index + 1 < 20000 ? [index + 1] : []);
  const distances = bfsDistances(chain);
  assert.equal(distances.at(-1), 19999);
  assert.equal(dfsReachable(chain), 20000);
});

test('chained hash table keeps colliding keys distinct through updates and deletions', async () => {
  const ChainedTable = await lessonExport('hash-table', 'ChainedTable');
  const table = new ChainedTable(3);
  const expected = new Map();
  for (let step = 0; step < 300; step++) {
    const key = (step * 7) % 23;
    if (step % 4 === 0) {
      assert.equal(table.delete(key), expected.delete(key));
    } else {
      const value = step % 7 === 0 ? undefined : `value-${step}`;
      table.set(key, value);
      expected.set(key, value);
    }
    for (let probe = 0; probe < 25; probe++) {
      assert.equal(table.has(probe), expected.has(probe));
      assert.equal(table.get(probe), expected.get(probe));
    }
  }
  assert.throws(() => new ChainedTable(0), RangeError);
  assert.throws(() => table.set(-1, 'x'), RangeError);
  assert.throws(() => table.get(Number.MAX_SAFE_INTEGER + 1), RangeError);
  assert.throws(() => table.get('1'), RangeError);
});

test('map and set examples agree with exhaustive pair checks on small arrays', async () => {
  const twoSum = await lessonExport('hashing', 'twoSum');
  const containsDuplicate = await lessonExport('sets', 'containsDuplicate');
  const uniqueIntersection = await lessonExport('sets', 'uniqueIntersection');
  for (let length = 0; length <= 5; length++) {
    for (let encoded = 0; encoded < 3 ** length; encoded++) {
      let remaining = encoded;
      const values = Array.from({ length }, () => {
        const value = remaining % 3 - 1;
        remaining = Math.floor(remaining / 3);
        return value;
      });
      const before = values.slice();
      const duplicateExists = values.some((value, index) => values.slice(index + 1).includes(value));
      assert.equal(containsDuplicate(values), duplicateExists);
      for (let target = -2; target <= 2; target++) {
        const pairExists = values.some((value, index) =>
          values.slice(index + 1).some(other => value + other === target),
        );
        const pair = twoSum(values, target);
        if (!pairExists) assert.equal(pair, null);
        else {
          assert.ok(pair !== null && pair[0] < pair[1]);
          assert.equal(values[pair[0]] + values[pair[1]], target);
        }
      }
      const second = [0, 1, 1, 2, -1, 0];
      const expectedIntersection = second.filter((value, index) =>
        second.indexOf(value) === index && values.includes(value),
      );
      assert.deepEqual(uniqueIntersection(values, second), expectedIntersection);
      assert.deepEqual(values, before);
    }
  }
});
