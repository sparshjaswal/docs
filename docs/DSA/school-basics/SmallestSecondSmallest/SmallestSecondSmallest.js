// Contract, worked example, and edge cases are documented in index.mdx.
const smallest2number = (arr) => {
  if (arr.length < 2) return [-1];
  let first = Infinity;
  let second = Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < first) {
      second = first;
      first = arr[i];
    } else if (arr[i] < second && arr[i] !== first) {
      second = arr[i];
    }
  }
  if (second === Infinity) return [-1];
  return [first, second];
};

export { smallest2number };
