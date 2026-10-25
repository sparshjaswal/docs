// Contract, worked example, and edge cases are documented in index.mdx.
var moveZeroes = (nums) => {
  let zeros = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      if (zeros !== i) nums[zeros] = nums[i];
      zeros++;
    }
  }
  while (zeros < nums.length) nums[zeros++] = 0;
  return nums;
};

export { moveZeroes };
