// Preserve the lesson's invalid-input rule: return 0 for invalid n.
export function sumOfFirstNNaturalNumbers(n) {
  if (!Number.isSafeInteger(n) || n < 0) return 0;
  const result = (BigInt(n) * (BigInt(n) + 1n)) / 2n;
  if (result > BigInt(Number.MAX_SAFE_INTEGER))
    throw new RangeError('Sum exceeds the safe integer range');
  return Number(result);
}
