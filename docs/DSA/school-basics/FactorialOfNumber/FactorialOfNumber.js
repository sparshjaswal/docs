// Exact factorial of a nonnegative safe integer; the result is a BigInt.
export function FactorialOfNumber(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Use a nonnegative safe integer');
  let result = 1n;
  for (let factor = 2n; factor <= BigInt(n); factor++) result *= factor;
  return result;
}
