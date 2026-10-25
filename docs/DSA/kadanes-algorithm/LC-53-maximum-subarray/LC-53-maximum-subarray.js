// Contract, worked example, and edge cases are documented in index.mdx.
const maxSubarraySum = (arr) => {
  if (arr.length === 0) throw new RangeError('Use a nonempty array');
  let sum = arr[0];
  let maxEndingHere = arr[0];
  let startIndex = 0;
  let endIndex = 0;
  let tempStartIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (maxEndingHere + arr[i] < arr[i]) {
      maxEndingHere = arr[i];
      tempStartIndex = i;
    } else {
      maxEndingHere += arr[i];
    }
    if (maxEndingHere > sum) {
      sum = maxEndingHere;
      startIndex = tempStartIndex;
      endIndex = i;
    }
  }
  return { sum, subarray: arr.slice(startIndex, endIndex + 1) };
};

export { maxSubarraySum };
