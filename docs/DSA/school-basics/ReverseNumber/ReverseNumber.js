// Preserve the sign; reject inputs and results outside exact integer range.
export function reverseNumber(value) {
  if (!Number.isSafeInteger(value)) throw new RangeError('Use a safe integer');
  const sign = Math.sign(value);
  let remaining = Math.abs(value);
  let reversed = 0;
  while (remaining > 0) {
    reversed = reversed * 10 + (remaining % 10);
    if (!Number.isSafeInteger(reversed))
      throw new RangeError('Reversed value exceeds the safe integer range');
    remaining = Math.floor(remaining / 10);
  }
  return sign * reversed;
}
