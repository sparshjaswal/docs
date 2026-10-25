// Complete original shortest-route stdin drill.
class BinaryHeap {
  constructor(compare = (first, second) => first - second, values = []) {
    this.compare = compare;
    this.data = values.slice(); // Preserve the caller's array.
    for (let index = Math.floor(this.data.length / 2) - 1; index >= 0; index--) {
      this.siftDown(index);
    }
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    let index = this.data.push(value) - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[parent], this.data[index]) <= 0) break;
      [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.size === 0) return undefined;
    const answer = this.data[0];
    const last = this.data.pop();
    if (this.size > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return answer;
  }

  siftDown(index) {
    while (true) {
      const left = 2 * index + 1;
      if (left >= this.size) break;
      const right = left + 1;
      let bestChild = left;
      if (right < this.size && this.compare(this.data[right], this.data[left]) < 0) {
        bestChild = right;
      }
      if (this.compare(this.data[index], this.data[bestChild]) <= 0) break;
      [this.data[index], this.data[bestChild]] = [this.data[bestChild], this.data[index]];
      index = bestChild;
    }
  }
}

function dijkstraHeap(graph, source) {
  const distances = Array(graph.length).fill(Infinity);
  const parents = Array(graph.length).fill(-1);
  const pending = new BinaryHeap((a, b) => a.distance - b.distance);
  distances[source] = 0;
  pending.push({ vertex: source, distance: 0 });

  while (pending.size > 0) {
    const { vertex, distance } = pending.pop();
    if (distance !== distances[vertex]) continue; // An obsolete route.
    for (const { to, weight } of graph[vertex]) {
      const candidate = distance + weight;
      if (candidate < distances[to]) {
        distances[to] = candidate;
        parents[to] = vertex;
        pending.push({ vertex: to, distance: candidate });
      }
    }
  }
  return { distances, parents };
}

// LeetCode 743 interface: directed edges, labels 1 through n.
function networkDelayTime(times, n, k) {
  const graph = Array.from({ length: n }, () => []);
  for (const [from, to, weight] of times) {
    graph[from - 1].push({ to: to - 1, weight });
  }
  const { distances } = dijkstraHeap(graph, k - 1);
  let longest = 0;
  for (const distance of distances) {
    if (distance === Infinity) return -1;
    longest = Math.max(longest, distance);
  }
  return longest;
}

// Original CodeChef-style drill, not an official problem's input contract.
// T; then each case: V E source; then E directed edges: from to weight.
// Labels are 1-based. Print all V distances, using -1 for unreachable.
function solveRoutes(input) {
  if (input.trim() === '') return '';
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const nextNumber = () => Number(tokens[position++]);
  const testCases = nextNumber();
  const answers = [];
  for (let test = 0; test < testCases; test++) {
    const vertexCount = nextNumber();
    const edgeCount = nextNumber();
    const source = nextNumber() - 1;
    const graph = Array.from({ length: vertexCount }, () => []);
    for (let edge = 0; edge < edgeCount; edge++) {
      const from = nextNumber() - 1;
      const to = nextNumber() - 1;
      const weight = nextNumber();
      graph[from].push({ to, weight });
    }
    const { distances } = dijkstraHeap(graph, source);
    answers.push(distances.map(value => value === Infinity ? -1 : value).join(' '));
  }
  return answers.join('\n');
}
process.stdout.write(solveRoutes(require('node:fs').readFileSync(0, 'utf8')));
