import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

function fromLesson(path, names) {
  const markdown = readFileSync(new URL(`../../docs/DSA/${path}`, import.meta.url), 'utf8');
  const blocks = [...markdown.matchAll(/^```js runnable\n([\s\S]*?)^```/gm)];
  const block = blocks.find((match) => names.every((name) =>
    new RegExp(`(?:function|class) ${name}\\b`).test(match[1])));
  assert.ok(block, `Documented implementation missing: ${names}`);
  return vm.runInNewContext(`${block[1]}\n;({${names.join(',')}})`, {
    console: { log() {} },
  }, { timeout: 5000 });
}
const solutions = 'assessments/solutions.md';
const plain = value => JSON.parse(JSON.stringify(value));

function* arrays(length, alphabet) {
  for (let code = 0; code < alphabet.length ** length; code++) {
    yield Array.from({ length }, (_, i) => alphabet[Math.floor(code / alphabet.length ** i) % alphabet.length]);
  }
}

test('assessment scans match exhaustive runs, counts, and pair enumeration', () => {
  const { longestRun } = fromLesson(solutions, ['longestRun']);
  const { firstUnique } = fromLesson(solutions, ['firstUnique']);
  const { inversionCount } = fromLesson(solutions, ['inversionCount']);
  for (let n = 0; n <= 7; n++) {
    for (const values of arrays(n, [-1, 0, 2])) {
      let longest = 0;
      let inversions = 0;
      for (let i = 0; i < n; i++) {
        for (let end = i + 1; end <= n; end++) {
          if (values.slice(i, end).every(value => value >= 0)) longest = Math.max(longest, end - i);
        }
        for (let j = i + 1; j < n; j++) if (values[i] > values[j]) inversions++;
      }
      assert.equal(longestRun(values, 0), longest);
      assert.equal(firstUnique(values), values.find(value => values.filter(x => x === value).length === 1) ?? null);
      const copy = values.slice();
      assert.equal(inversionCount(values), inversions);
      assert.deepEqual(values, copy);
    }
  }
  const descending = Array.from({ length: 200000 }, (_, i) => 10 ** 12 - i);
  assert.equal(inversionCount(descending), 19999900000);
});

test('row reversal allocates independent rows including shared input rows', () => {
  const { reverseRows } = fromLesson(solutions, ['reverseRows']);
  const row = [1, 2];
  const input = [row, row, [], [3]];
  const output = reverseRows(input);
  assert.deepEqual(plain(output), [[2, 1], [2, 1], [], [3]]);
  output[0][0] = 99;
  assert.equal(output[1][0], 2);
  assert.deepEqual(input, [[1, 2], [1, 2], [], [3]]);
  assert.deepEqual(plain(reverseRows([])), []);
});

test('positive windows agree with exhaustive range sums', () => {
  const { shortestPositiveRange } = fromLesson(solutions, ['shortestPositiveRange']);
  for (let n = 0; n <= 6; n++) {
    for (const values of arrays(n, [1, 2, 3])) {
      for (const target of [1, 4, 7, 20]) {
        let best = Infinity;
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j <= n; j++) {
            if (values.slice(i, j).reduce((a, b) => a + b, 0) >= target) best = Math.min(best, j - i);
          }
        }
        assert.equal(shortestPositiveRange(values, target), best === Infinity ? 0 : best);
      }
    }
  }
  // Deliberate counterexample used in the prose, outside the algorithm's contract.
  assert.equal(shortestPositiveRange([1, -1, 3], 3), 3);
});

function allPairs(graph) {
  const distance = graph.map((_, i) => graph.map((_, j) => i === j ? 0 : Infinity));
  graph.forEach((edges, i) => edges.forEach(({ to, weight }) => {
    distance[i][to] = Math.min(distance[i][to], weight);
  }));
  for (let k = 0; k < graph.length; k++) {
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph.length; j++) {
        distance[i][j] = Math.min(distance[i][j], distance[i][k] + distance[k][j]);
      }
    }
  }
  return distance;
}

test('heap shortest paths and multi-source BFS match independent all-pairs distances', () => {
  const { dijkstraHeap, networkDelayTime } = fromLesson('graphs/dijkstra/README.md', ['dijkstraHeap', 'networkDelayTime']);
  const { stationDistances } = fromLesson(solutions, ['stationDistances']);
  assert.deepEqual(plain(stationDistances([], [])), []);
  for (let n = 1; n <= 12; n++) {
    for (let seed = 0; seed < 30; seed++) {
      const graph = Array.from({ length: n }, () => []);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if ((i * 31 + j * 17 + seed * 7) % 5 < 2) {
            graph[i].push({ to: j, weight: (i * j + seed) % 7 });
            graph[i].push({ to: j, weight: 10 }); // parallel, inferior edge
          }
        }
      }
      const expected = allPairs(graph);
      for (let source = 0; source < n; source++) {
        const result = dijkstraHeap(graph, source);
        assert.deepEqual(Array.from(result.distances), expected[source]);
        for (let target = 0; target < n; target++) {
          if (result.distances[target] === Infinity) continue;
          let current = target;
          let steps = 0;
          let cost = 0;
          while (current !== source) {
            assert.ok(steps++ < n, 'parent chain must not cycle');
            const parent = result.parents[current];
            cost += Math.min(...graph[parent].filter(edge => edge.to === current).map(edge => edge.weight));
            current = parent;
          }
          assert.equal(cost, expected[source][target]);
        }
      }
      const unweighted = graph.map(edges => edges.map(edge => edge.to));
      const unitExpected = allPairs(graph.map(edges => edges.map(edge => ({ ...edge, weight: 1 }))));
      const stations = seed % 4 === 0 ? [] : [0, n - 1, 0];
      assert.deepEqual(Array.from(stationDistances(unweighted, stations)),
        graph.map((_, vertex) => {
          const minimum = Math.min(...stations.map(station => unitExpected[station][vertex]));
          return minimum === Infinity ? -1 : minimum;
        }));
    }
  }
  assert.equal(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
  assert.equal(networkDelayTime([[1, 2, 1]], 2, 2), -1);
});

test('coin DP matches an independent BFS over achievable amounts', () => {
  const { minimumCoins } = fromLesson(solutions, ['minimumCoins']);
  for (let mask = 0; mask < 32; mask++) {
    const coins = [1, 2, 3, 4, 5].filter((_, i) => mask & (1 << i));
    const distance = Array(31).fill(-1);
    distance[0] = 0;
    const queue = [0];
    for (let head = 0; head < queue.length; head++) {
      for (const coin of coins) {
        const next = queue[head] + coin;
        if (next > 30 || distance[next] !== -1) continue;
        distance[next] = distance[queue[head]] + 1;
        queue.push(next);
      }
    }
    for (let amount = 0; amount <= 30; amount++) assert.equal(minimumCoins(coins, amount), distance[amount]);
  }
});

test('exact combinations agree with Pascal addition and retain large integers', () => {
  const { chooseExact } = fromLesson(solutions, ['chooseExact']);
  let row = [1n];
  for (let n = 0; n <= 100; n++) {
    for (let k = -1; k <= n + 1; k++) assert.equal(chooseExact(n, k), row[k] ?? 0n);
    row = Array.from({ length: n + 2 }, (_, k) => (row[k - 1] ?? 0n) + (row[k] ?? 0n));
  }
  assert.equal(chooseExact(60, 30), 118264581564861424n);
});

test('lazy range sums match a plain array through overlapping additions and partial queries', () => {
  const { RangeAddSum } = fromLesson('trees/segment-tree/range-updates.md', ['RangeAddSum']);
  for (let n = 0; n <= 25; n++) {
    const input = Array.from({ length: n }, (_, i) => i - 7);
    const values = input.slice();
    const tree = new RangeAddSum(input);
    for (let step = 0; step < 80; step++) {
      const first = (step * 7) % (n + 1);
      const second = (step * 13 + 1) % (n + 1);
      const left = Math.min(first, second);
      const right = Math.max(first, second);
      const delta = step % 9 - 4;
      tree.add(left, right, delta);
      for (let i = left; i < right; i++) values[i] += delta;
      for (let from = 0; from <= n; from++) {
        for (let to = from; to <= n; to++) {
          assert.equal(tree.sum(from, to), values.slice(from, to).reduce((a, b) => a + b, 0));
        }
      }
    }
    assert.deepEqual(input, Array.from({ length: n }, (_, i) => i - 7));
    assert.throws(() => tree.sum(-1, 0), /Expected/);
    assert.throws(() => tree.add(0, n + 1, 2), /Expected/);
    assert.throws(() => tree.sum(0.5, 1), /Expected/);
  }
});

test('downloadable stdin submissions match the teaching functions on multiple cases', () => {
  for (const [filename, lesson, functionName, input] of [
    ['longest-run.cjs', solutions, 'solveRuns', '3\r\n6 5\r\n5 7 1 8 9 10\r\n0 -1\r\n3 -2\r\n-2 -1 -3\r\n'],
    ['dijkstra-routes.cjs', 'graphs/dijkstra/README.md', 'solveRoutes', '3\n4 4 1\n1 2 10\n1 3 1\n3 2 1\n2 2 0\n1 0 1\n2 0 2\n'],
  ]) {
    const solver = fromLesson(lesson, [functionName])[functionName];
    for (const sample of ['', input, input.replace(/\s+/g, ' ')]) {
      const result = spawnSync(process.execPath, [new URL(`../../static/examples/${filename}`, import.meta.url).pathname], {
        input: sample, encoding: 'utf8', timeout: 5000,
      });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, solver(sample));
    }
  }
});
