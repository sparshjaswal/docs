// Return a swapped pair; caller bindings cannot be reassigned by this function.
export function swapTwoVariable(a, b) {
  [a, b] = [b, a];
  return [a, b];
}
