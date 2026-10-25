import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shipWithinDays } from './LC-1101-capacity-to-ship-packages-within-d-days.js';

test('matches the three workbook examples', () => {
  assert.equal(shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
  assert.equal(shipWithinDays([3, 2, 2, 4, 1, 4], 3), 6);
  assert.equal(shipWithinDays([1, 2, 3, 1, 1], 4), 3);
});

test('handles a single package, one day, and one package per day', () => {
  assert.equal(shipWithinDays([500], 1), 500);
  assert.equal(shipWithinDays([3, 2, 4], 1), 9);
  assert.equal(shipWithinDays([3, 2, 4], 3), 4);
});

test('preserves package order and does not mutate the input', () => {
  const weights = [5, 5, 1, 1];
  assert.equal(shipWithinDays(weights, 2), 7);
  assert.deepEqual(weights, [5, 5, 1, 1]);
});

test('handles the maximum input size and total weight', () => {
  const weights = Array(50_000).fill(500);
  assert.equal(shipWithinDays(weights, 1), 25_000_000);
  assert.equal(shipWithinDays(weights, 50_000), 500);
});

// Independently enumerate all contiguous partitions; no binary search or
// capacity-feasibility predicate is shared with the implementation.
function minimumPartitionCapacity(weights: number[], days: number): number {
  let best = Infinity;
  for (let cuts = 0; cuts < 2 ** (weights.length - 1); cuts += 1) {
    let groups = 1;
    let load = weights[0];
    let capacity = 0;
    for (let i = 1; i < weights.length; i += 1) {
      if (cuts & (1 << (i - 1))) {
        capacity = Math.max(capacity, load);
        groups += 1;
        load = 0;
      }
      load += weights[i];
    }
    if (groups <= days) best = Math.min(best, Math.max(capacity, load));
  }
  return best;
}

test('matches exhaustive partitions for every small input', () => {
  for (let length = 1; length <= 5; length += 1) {
    for (let encoding = 0; encoding < 3 ** length; encoding += 1) {
      const weights = Array.from({ length }, (_, i) => 1 + (Math.floor(encoding / 3 ** i) % 3));
      for (let days = 1; days <= length; days += 1) {
        assert.equal(
          shipWithinDays(weights, days),
          minimumPartitionCapacity(weights, days),
          `weights=${weights}, days=${days}`,
        );
      }
    }
  }
});
