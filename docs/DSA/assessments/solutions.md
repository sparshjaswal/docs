---
title: "Assessment hints and explained solutions"
sidebar_label: "Assessment solutions"
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Assessment hints and explained solutions

Return to the [eight prompts](./README.md) if you have not attempted them. All code blocks marked runnable are self-contained: paste one into `lesson.mjs`, then run `node lesson.mjs`. The separate standard-input download is a complete `.cjs` program. Costs assume ordinary dense arrays; hash-map operations use the expected-cost model.

## Hints only

Read the first hint, close this page, and try again. The second hint names more of the state.

| Assessment | First hint | Second hint |
| --- | --- | --- |
| 1 | A failed day ends the current run. | Track both the current suffix and the best length ever seen. |
| 2 | Copying the outer array preserves its references. | Allocate a new row for each row, even an empty one. |
| 3 | “Exactly once” refers to the whole input. | Count first, then scan the original order. |
| 4 | Positive additions cannot lower a sum. | Once valid, shorten from the left while retaining validity. |
| 5 | What distances are already known without traversing an edge? | Put all distinct stations in the queue before starting BFS. |
| 6 | Consider the last coin used. | Remove that coin and ask for the best smaller total. |
| 7 | Adding one more chosen person gives a ratio of adjacent combination counts. | Use `C(n, i) = C(n, i-1) * (n-i+1) / i` with exact integer arithmetic. |
| 8 | The numeric gap between 1 and 1000 is irrelevant to order. | Scan from right to left and count previously seen ranks smaller than the current rank. |

## 1. Keep a current run and a best run

The baseline starts at every day and scans forward while days qualify, O(n²) in the all-success case. The scan below reuses yesterday's result. After processing position i, `current` is the length of the qualifying suffix ending at i, and `best` is the greatest such length through i. A failed day makes the suffix empty; a successful day extends it by one. Taking the maximum preserves the second statement. Initially both are zero, so empty input works too. The loop advances once per day and terminates after n days.

```text
score       5   7   1   8   9  10
qualifies   Y   Y   N   Y   Y   Y
current     1   2   0   1   2   3
best        1   2   2   2   2   3
                    ^ reset only current
```

The table corresponds to the variables after each loop body. Resetting `best` would forget the first run; never resetting `current` would wrongly join separate runs.

```js runnable
function longestRun(scores, threshold) {
  let current = 0;
  let best = 0;
  for (const score of scores) {
    current = score >= threshold ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

function solveRuns(input) {
  if (input.trim() === '') return '';
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const testCases = Number(tokens[position++]);
  const answers = [];
  for (let test = 0; test < testCases; test++) {
    const length = Number(tokens[position++]);
    const threshold = Number(tokens[position++]);
    const scores = [];
    for (let index = 0; index < length; index++) {
      scores.push(Number(tokens[position++]));
    }
    answers.push(String(longestRun(scores, threshold)));
  }
  return answers.join('\n');
}

console.log(longestRun([5, 7, 1, 8, 9, 10], 5));
console.log(solveRuns('2\n6 5\n5 7 1 8 9 10\n0 -1\n'));
```

```text output
3
3
0
```

The expression `condition ? a : b` chooses a when the condition is true and b otherwise. It is shorthand for an `if/else`, not a new algorithm.

The function takes O(n) time and O(1) auxiliary space. The adapter assumes well-formed contest input; its token array uses O(B) memory for B input characters, plus scores and answers. For very large input, a cursor-based scanner avoids making one string per token. The parsing convenience does not make the whole submission constant-space.

For a LeetCode-style exercise return `longestRun(...)` from the required signature. For CodeChef-style execution, download the <a href={useBaseUrl('/examples/longest-run.cjs')} download>complete stdin program</a>, save it as `longest-run.cjs`, and run `node longest-run.cjs < input.txt`. It includes the function, parser, and `require('node:fs').readFileSync(0, 'utf8')` wrapper. File descriptor 0 means standard input. This format belongs to the original drill, not to every CodeChef problem.

## 2. Copy each row before reversing

```text
Input:    outer ------> row A [1, 2]
               ------> row B []

Shallow:  copy  ------> row A [1, 2]   SAME row objects
               ------> row B []

Answer:   new   ------> row C [2, 1]   NEW row objects
               ------> row D []
```

A reference points to an array object. Copying an outer reference does not copy the object at its destination. The algorithm allocates a new reversed row for each original row; primitive values can be copied directly.

```js runnable
function reverseRows(matrix) {
  return matrix.map(row => row.slice().reverse());
}
const original = [[1, 2], [], [3]];
const reversed = reverseRows(original);
console.log(JSON.stringify(reversed));
reversed[0][0] = 99;
console.log(JSON.stringify(original));
console.log(reversed[0] === original[0]);
console.log(JSON.stringify(reverseRows([])));
```

```text output
[[2,1],[],[3]]
[[1,2],[],[3]]
false
[]
```

`map` calls the arrow function once per row and collects its returned values. `slice` allocates a row copy; `reverse` changes that copy. Position j in an output row receives original position `row.length - 1 - j`, so every row is reversed with no omissions. There are R row visits and M element copies: O(R + M) time and required output space. Apart from that output, the algorithm uses O(1) explicit working state under the usual array-operation model. Copying nested object values would need a different contract; this solution only promises independent row arrays.

## 3. Frequency and order are different facts

A baseline counts each value by scanning the whole array: O(n²) time, O(1) working space. Store each count once instead. After the first pass, every map entry is its value's total frequency. The second pass returns the earliest value with frequency one. A single pass that returns a currently unique value is premature because later input can change its count.

```js runnable
function firstUnique(values) {
  const frequency = new Map();
  for (const value of values) {
    frequency.set(value, (frequency.get(value) ?? 0) + 1);
  }
  for (const value of values) {
    if (frequency.get(value) === 1) return value;
  }
  return null;
}
console.log(firstUnique([4, 7, 4, 9, 7, 2]));
console.log(firstUnique([0, 0]));
console.log(firstUnique([0, 1, 1]));
console.log(firstUnique([]));
```

```text output
9
null
0
null
```

`?? 0` supplies zero only when lookup is missing or null. Time is expected O(n); auxiliary space is O(d) for d distinct values, at most n. Check `answer !== null`, not its truthiness: zero is a valid answer.

## 4. A window whose left boundary never retreats

For each right endpoint, add its value. While the sum is at least the target, record the current length and remove the leftmost item. Every recorded window is valid. Removing a positive item only lowers the sum, so the final valid window before becoming too small is the shortest for this endpoint among starts not already discarded. An earlier discarded start already gave a valid, shorter-or-equal-length window at an earlier endpoint; it cannot improve the minimum now. This justifies moving left permanently.

```text
Input [2, 3, 1, 2, 4, 3], target 7
right  added  windows tested while valid      remaining [left,right+1)
  3      2    [0,4) sum 8, length 4           [1,4) sum 6
  4      4    [1,5) sum 10; [2,5) sum 7       [3,5) sum 6
  5      3    [3,6) sum 9; [4,6) sum 7        [5,6) sum 3
Best length: 2, from [4,6) containing [4,3].
```

Each shortening corresponds to one iteration of `while` below. Endpoints 0 through 2 are omitted from the table because no valid window exists yet.

```js runnable
function shortestPositiveRange(values, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < values.length; right++) {
    sum += values[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= values[left++];
    }
  }
  return best === Infinity ? 0 : best;
}
console.log(shortestPositiveRange([2, 3, 1, 2, 4, 3], 7));
console.log(shortestPositiveRange([1, 1], 3));
console.log(shortestPositiveRange([], 1));
```

```text output
2
0
0
```

Both boundaries advance at most n times, giving O(n) time and O(1) auxiliary space. The function assumes the positive-input contract rather than checking it inside the loop. Under the stated bounds the largest sum is at most `2 * 10^14`, which is safe as an integer Number.

For `[1, -1, 3]`, the correct length is 1, but this algorithm records 3 then stops shrinking at sum 2. Removing the next negative value would increase the sum again. The monotonic argument is gone. A more advanced solution uses prefix sums and a monotonic deque; a quadratic baseline remains valid while learning that extension.

## 5. Start BFS from all known answers

Run BFS separately for each of s distinct stations as a baseline: O(s(V + E)) time, retaining the minimum per town. A shared queue avoids repeated exploration. This is **multi-source BFS**: initialize every distinct source at distance zero, then use ordinary BFS. Think of simultaneous waves expanding one road per round.

```text
Layer 0: [0] [3]     both stations queued before exploration
Layer 1: [1] [2]     discovered from 0 and 3 respectively
Layer 2: [4]         discovered from 2
Unseen:  [5]         remains -1
```

The queue processes nondecreasing distances, just as in single-source BFS. If a newly discovered town had a shorter route from any station, the predecessor on that route would be in an earlier layer and would already have discovered it. Thus its first assigned distance is minimal across all sources. Marking on insertion prevents cycles and duplicate edges from duplicating work.

```js runnable
function stationDistances(graph, stations) {
  const distance = Array(graph.length).fill(-1);
  const queue = [];
  for (const station of stations) {
    if (distance[station] !== -1) continue;
    distance[station] = 0;
    queue.push(station);
  }
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    for (const neighbor of graph[current]) {
      if (distance[neighbor] !== -1) continue;
      distance[neighbor] = distance[current] + 1;
      queue.push(neighbor);
    }
  }
  return distance;
}
const graph = [[1], [0, 2], [1, 3, 4], [2], [2], []];
console.log(JSON.stringify(stationDistances(graph, [0, 3, 3])));
console.log(JSON.stringify(stationDistances(graph, [])));
```

```text output
[0,1,1,0,2,-1]
[-1,-1,-1,-1,-1,-1]
```

Time is O(V + E + S), including scanning S supplied station entries. Space is O(V) beyond the graph, including the output. The head index avoids repeated `shift()` and the queue retains at most V vertices for this single traversal. On a directed graph this computes distances **from** stations. To find distances **to** stations, reverse every edge first; reversing a path preserves its edge count and swaps its endpoints. Weighted roads require an appropriate weighted algorithm, not this queue rule.

## 6. Derive the recurrence from a last action

Greedily taking 4 then two 1s costs three coins; 3 + 3 uses two. Trying every coin recursively explores repeated remaining amounts. Instead define `best[x]` as the fewest coins whose sum is exactly x, or `Infinity` if impossible. `best[0] = 0`. For a final coin c, the preceding coins must optimally make `x - c`; otherwise replacing them with fewer would improve the whole answer. Therefore minimize `best[x - c] + 1` over affordable coins.

```text
coins [1,3,4]
total x      0  1  2  3  4  5  6
best[x]      0  1  2  1  1  2  2
At x=6: final 1 -> best[5]+1 = 3
        final 3 -> best[3]+1 = 2  <-- minimum
        final 4 -> best[2]+1 = 3
```

Every dependency is a smaller total because coins are positive. Induction on x proves that all candidate prefixes are already optimal when x is computed. Every feasible solution has a last coin, so the candidates cover all possibilities. A zero or negative coin would invalidate this evaluation order and is excluded by the contract.

```js runnable
function minimumCoins(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) {
        best[total] = Math.min(best[total], best[total - coin] + 1);
      }
    }
  }
  return best[amount] === Infinity ? -1 : best[amount];
}
console.log(minimumCoins([1, 3, 4], 6));
console.log(minimumCoins([2], 3));
console.log(minimumCoins([], 0));
```

```text output
2
-1
0
```

For amount A and m types, time is O(A(m + 1)) including table initialization and space O(A + 1). It is usually written O(Am) when m is positive. This is pseudo-polynomial: it depends on the value A, not merely the digits needed to write A. To return actual coins, save the last chosen coin on each improvement and subtract it repeatedly from A; ensure the amount is reachable first.

## 7. Divide only when divisibility is proved

Let `C(n, i)` count i-person committees. Counting ways to choose an `(i - 1)`-person committee and then add a new person gives `C(n, i-1) * (n-i+1)`. Every final i-person committee is counted i times, once for each person who could have been added last. Dividing by i is therefore exact. This proves both the recurrence and its integrality. Choosing k people is equivalent to excluding n-k people, so compute the smaller number of steps.

```js runnable
function chooseExact(n, k) {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let result = 1n;
  for (let chosen = 1; chosen <= k; chosen++) {
    result = result * BigInt(n - chosen + 1) / BigInt(chosen);
  }
  return result;
}
console.log(chooseExact(5, 2).toString());
console.log(chooseExact(60, 30).toString());
console.log(chooseExact(0, 0).toString());
console.log(chooseExact(3, 4).toString());
```

```text output
10
118264581564861424
1
0
```

The contract requires integer n and k. Multiplication happens before division; dividing the previous count first could truncate a necessary fraction. Number loop indices are safe here because n is at most 1000, and all large arithmetic happens after conversion to BigInt. Never convert the final count to Number just to print it.

There are O(min(k, n-k)) BigInt arithmetic steps, not constant-cost machine operations. If intermediate counts have at most B bits, storage is O(B) bits plus arithmetic temporaries; multiplication/division cost grows with operand size. This recurrence is exact integer arithmetic. Replacing division with ordinary division under a modulus is generally invalid; use the conditions taught in [modular arithmetic](../math/modular-arithmetic/README.md).

## 8. Replace magnitudes with ranks, then count a suffix

**Coordinate compression** replaces each distinct value by its sorted rank. It preserves comparisons, not distances or sums. For `[-1000, 7, 1000000]`, ranks `[1, 2, 3]` answer order questions, but rank gaps do not describe numeric gaps. Duplicates receive the same rank so equality stays equality.

Scan right to left. Before processing i, the Fenwick tree counts precisely the ranks at positions greater than i. Query through `rank - 1` to count strictly smaller values, then insert the current rank. Those counts correspond exactly to pairs whose left endpoint is i, and each pair has one left endpoint. Their sum therefore counts every inversion exactly once.

```text
values       [3, 1, 2, 1]        distinct values [1,2,3]
ranks        [3, 1, 2, 1]        mapping 1->1, 2->2, 3->3

visit index   rank   smaller in suffix   total
    3          1            0             0
    2          2            1             1
    1          1            0             1
    0          3            3             4
```

The four pairs of indices are `(0,1), (0,2), (0,3), (2,3)`. Querying through rank instead of rank minus one would incorrectly include the equal pair `(1,3)`.

```js runnable
function inversionCount(values) {
  const ordered = [...new Set(values)].sort((a, b) => a - b);
  const rankOf = new Map(ordered.map((value, index) => [value, index + 1]));
  const counts = Array(ordered.length + 1).fill(0);
  function prefixCount(rank) {
    let total = 0;
    for (; rank > 0; rank -= rank & -rank) total += counts[rank];
    return total;
  }
  function insert(rank) {
    for (; rank < counts.length; rank += rank & -rank) counts[rank]++;
  }
  let answer = 0;
  for (let index = values.length - 1; index >= 0; index--) {
    const rank = rankOf.get(values[index]);
    answer += prefixCount(rank - 1);
    insert(rank);
  }
  return answer;
}
console.log(inversionCount([3, 1, 2, 1]));
console.log(inversionCount([1000000000000, -7, -7]));
console.log(inversionCount([2, 2, 2]));
console.log(inversionCount([]));
```

```text output
4
2
0
0
```

The nested functions capture `counts` from their enclosing function; each call to `inversionCount` creates fresh state. In the Fenwick loops, `rank & -rank` isolates the lowest set bit and selects the next stored interval. Revisit the [Fenwick diagram and invariant](../trees/fenwick-tree/README.md) if this movement is not yet clear. The bitwise operation is safe on ranks at most 200000, even though original values may exceed 32 bits; never apply it directly to those original values.

Under an O(n log n) comparison-sort model and expected map/set operations, total time is O(n log n), auxiliary space O(n). Built-in sort's exact cost depends on the engine; the course's merge sort supplies a guaranteed comparison-sort alternative. The maximum count is `n(n-1)/2`, less than `2 * 10^10` at the stated bound, so Number is sufficient. Sorting `values` itself would destroy the original order and the problem. A merge-sort inversion counter is an alternative with the same asymptotic cost and no rank map; compare the two approaches after solving this one.

**Next:** close this page and reimplement the assessment you just studied. Then solve a new problem whose statement does not name its technique.
