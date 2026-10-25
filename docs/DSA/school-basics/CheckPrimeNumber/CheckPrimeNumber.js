// Contract, worked example, and edge cases are documented in index.mdx.
const PrimeNumber = (n) => {
  if (!Number.isSafeInteger(n) || n <= 1) return `${n} is NOT prime`;
  else {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return `${n} is NOT prime`;
    }
    return `${n} is prime`;
  }
};

export { PrimeNumber };
