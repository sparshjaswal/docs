// Contract, worked example, and edge cases are documented in index.mdx.
const isPalindromeNumber = (x) => {
  if (x < 0 || (x !== 0 && x % 10 === 0)) return false; // removing the negative and single digits numbers
  // target if the number i palindrome then its half are also palindrome
  let revNum = 0;
  while (x > revNum) {
    revNum = revNum * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === revNum || x === Math.floor(revNum / 10); // x===Math.floor(rev/10) in case of odd digits ignore center digits
};

export { isPalindromeNumber };
