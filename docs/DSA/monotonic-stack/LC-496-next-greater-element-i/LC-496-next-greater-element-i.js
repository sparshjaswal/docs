// Contract, worked example, and edge cases are documented in index.mdx.
var nextGreaterElement = (nums1, nums2) => {
  // simpler approach
  let stack = [];
  let map = new Map();

  for (let num of nums2) {
    while (stack.length && num > stack[stack.length - 1]) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }
  while (stack.length) {
    map.set(stack.pop(), -1);
  }
  return nums1.map((item) => map.get(item));
};

export { nextGreaterElement };
