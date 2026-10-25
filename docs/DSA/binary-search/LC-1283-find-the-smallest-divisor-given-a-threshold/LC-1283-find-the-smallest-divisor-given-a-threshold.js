// Contract, worked example, and edge cases are documented in index.mdx.
const divisorSum = (nums, num, threshold) => {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += Math.ceil(nums[i] / num);
    if (sum > threshold) return false;
  }
  return true;
};

const smallestDivisor = (nums, threshold) => {
  let max = nums.reduce((maximum, value) => Math.max(maximum, value), 1);
  let min = 1;
  while (min < max) {
    let mid = Math.floor((max + min) / 2);
    if (divisorSum(nums, mid, threshold)) {
      max = mid;
    } else {
      min = mid + 1;
    }
  }
  return min;
};

export { smallestDivisor };
