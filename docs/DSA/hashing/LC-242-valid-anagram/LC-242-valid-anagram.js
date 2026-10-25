// Contract, worked example, and edge cases are documented in index.mdx.
const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;
  const str = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    str[s.charCodeAt(i) - 97]++;
    str[t.charCodeAt(i) - 97]--;
  }
  return str.every((item) => item === 0);
};

export { isAnagram };
