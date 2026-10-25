// Contract, worked example, and edge cases are documented in index.mdx.
var longestConsecutive = function (nums) {
  const numSet = new Set(nums);
  let longest = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let currentSubSequence = 1;
      let currentNum = num;
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentSubSequence++;
      }
      longest = Math.max(longest, currentSubSequence);
    }
  }
  return longest;
};

export { longestConsecutive };
