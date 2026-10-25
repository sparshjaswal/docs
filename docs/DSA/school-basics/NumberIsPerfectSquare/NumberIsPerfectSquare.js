// Check safe Number integers using an exact square comparison.
export function perfectSquare(n) {
  if (!Number.isSafeInteger(n) || n < 0) return false;
  const root = BigInt(Math.floor(Math.sqrt(n)));
  return root * root === BigInt(n);
}
