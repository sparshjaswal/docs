// Print concentric rectangular pattern in a 2D matrix.
// Example n=3:
// 3 3 3 3 3
// 3 2 2 2 3
// 3 2 1 2 3
// 3 2 2 2 3
// 3 3 3 3 3

const concentricRect = n => {
  if (n <= 0) return [];

  const size = 2 * n - 1;
  const result = Array.from({ length: size }, () => Array(size).fill(0));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const minDistance = Math.min(row, col, size - 1 - row, size - 1 - col);
      result[row][col] = n - minDistance;
    }
  }

  return result;
};

console.log(concentricRect(3));
console.log(concentricRect(4));

export { concentricRect };
