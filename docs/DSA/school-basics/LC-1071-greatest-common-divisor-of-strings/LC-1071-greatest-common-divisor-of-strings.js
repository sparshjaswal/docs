// Contract, worked example, and edge cases are documented in index.mdx.
const gcdOfStrings = (str1, str2) => {
  if (str1 + str2 === str2 + str1) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const gcdLength = gcd(str1.length, str2.length);
    return str1.slice(0, gcdLength);
  } else return '';
};

export { gcdOfStrings };
