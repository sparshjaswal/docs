// Contract, worked example, and edge cases are documented in index.mdx.
var topKFrequent = (nums, k) => {
  // hashing
  const arrFreq = new Map();
  for (let num of nums) {
    arrFreq.set(num, (arrFreq.get(num) || 0) + 1);
  }
  // bucket sort
  const arr = new Array(nums.length + 1);
  for (let [key, value] of arrFreq) {
    if (!arr[value]) arr[value] = [];
    arr[value].push(key);
  }
  let res = [];
  for (let i = nums.length; i > 0; i--) {
    if (arr[i]) {
      res.push(...arr[i]);
      if (res.length === k) return res;
    }
  }
};

export { topKFrequent };
