// Print rectangular pattern with given center (c1, c2) in an n x n matrix.
// Each cell value is the Chebyshev distance from the center.

const printRectPattern = (c1, c2, n) => {
  if (n <= 0) return [];

  const result = Array.from({ length: n }, () => Array(n).fill(0));

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      result[row][col] = Math.max(Math.abs(row - c1), Math.abs(col - c2));
    }
  }

  return result;
};

console.log(printRectPattern(2, 2, 5));
console.log(printRectPattern(3, 4, 7));

export { printRectPattern };

