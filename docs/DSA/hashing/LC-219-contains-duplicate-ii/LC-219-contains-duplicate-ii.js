// Contract, worked example, and edge cases are documented in index.mdx.
const containsDuplicate = (nums, k) => {
  if (k <= 0) return false;
  const s = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (s.has(nums[i])) {
      const temp = Math.abs(s.get(nums[i]) - i);
      if (temp <= k) return true;
    }
    s.set(nums[i], i);
  }
  return false;
};

export { containsDuplicate };
