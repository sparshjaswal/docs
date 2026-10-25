// Contract, worked example, and edge cases are documented in index.mdx.
const isValidPalindrome = (s) => {
  let str = s.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, '');
  return str === str.split('').reverse().join('');
};

export { isValidPalindrome };
