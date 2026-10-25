// Contract, worked example, and edge cases are documented in index.mdx.
const twoSum = (nums, target) => {
  const indexByValue = new Map();
  for (let i = 0; i < nums.length; i++) {
    let currentNum = nums[i];
    let targetNum = target - currentNum;
    if (indexByValue.has(targetNum)) {
      return [i, indexByValue.get(targetNum)];
    }
    indexByValue.set(currentNum, i);
  }
};

export { twoSum };
