// A Prime Number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

// Examples:

// Input: n = 29
// Output: 29 is prime
// Explanation: 29 has no divisors other than 1 and 29 itself. Hence, it is a prime number.

// Input: n = 15
// Output: 15 is NOT prime

const PrimeNumber = (n) => {
  if (n <= 1) return `${n} is NOT prime`;
  else {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return `${n} is NOT prime`;
    }
    return `${n} is prime`;
  }
};

export { PrimeNumber };
