// Contract, worked example, and edge cases are documented in index.mdx.
const containsDuplicate = (nums) => {
  const s = new Set();
  for (let num of nums) {
    if (s.has(num)) return true;
    s.add(num);
  }
  return false;
};

export { containsDuplicate };
