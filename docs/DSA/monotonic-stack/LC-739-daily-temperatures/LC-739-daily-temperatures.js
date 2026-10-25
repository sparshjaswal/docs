// Contract, worked example, and edge cases are documented in index.mdx.
var dailyTemperatures = (arr) => {
  const n = arr.length;
  const res = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && arr[i] > arr[stack[stack.length - 1]]) {
      let prevIndex = stack.pop();
      res[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }
  return res;
};

export { dailyTemperatures };
