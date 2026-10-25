// Contract, worked example, and edge cases are documented in index.mdx.
var isSubsequence = function (s, t) {
  let index = 0;
  for (let str of t) {
    if (str === s[index]) {
      index++;
    }
  }
  return index === s.length;
};

export { isSubsequence };
