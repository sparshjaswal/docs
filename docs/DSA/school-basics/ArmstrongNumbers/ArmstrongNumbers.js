// Nonnegative safe Number input; use BigInt so digit powers and their sum stay exact.
export function isArmstrongNumbers(n) {
  if (!Number.isSafeInteger(n) || n < 0) return false;
  const digits = String(n);
  const power = BigInt(digits.length);
  let sum = 0n;
  for (const digit of digits) sum += BigInt(digit) ** power;
  return sum === BigInt(n);
}
