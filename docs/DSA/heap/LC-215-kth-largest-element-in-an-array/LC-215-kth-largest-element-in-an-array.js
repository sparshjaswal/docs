// Keep the k largest values seen so far in a min-heap. Duplicates count.
export function findKthLargest(nums, k) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) throw new RangeError('Invalid rank');
  const heap = [];
  function sink() {
    let index = 0;
    while (2 * index + 1 < heap.length) {
      let child = 2 * index + 1;
      if (child + 1 < heap.length && heap[child + 1] < heap[child]) child++;
      if (heap[index] <= heap[child]) break;
      [heap[index], heap[child]] = [heap[child], heap[index]];
      index = child;
    }
  }
  for (const value of nums) {
    if (heap.length < k) {
      heap.push(value);
      let index = heap.length - 1;
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (heap[parent] <= heap[index]) break;
        [heap[parent], heap[index]] = [heap[index], heap[parent]];
        index = parent;
      }
    } else if (value > heap[0]) {
      heap[0] = value;
      sink();
    }
  }
  return heap[0];
}
