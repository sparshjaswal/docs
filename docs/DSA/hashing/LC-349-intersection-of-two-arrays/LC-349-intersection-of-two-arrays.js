// Contract, worked example, and edge cases are documented in index.mdx.
var intersection = (nums1, nums2) => {
  const numSet = new Set(nums1);
  const result = new Set();
  for (let n of nums2) {
    if (numSet.has(n)) result.add(n);
  }
  return [...result];
};

export { intersection };
