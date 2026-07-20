// Print matrix elements in zig-zag diagonal order.
// Example:
// [ [1,2,3],
//   [4,5,6],
//   [7,8,9] ]
// -> [1,2,4,7,5,3,6,8,9]

const diagonalTraverse = matrix => {
  if (!matrix.length || !matrix[0].length) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = [];

  for (let sum = 0; sum <= rows + cols - 2; sum++) {
    if (sum % 2 === 0) {
      let row = Math.min(sum, rows - 1);
      let col = sum - row;
      while (row >= 0 && col < cols) {
        result.push(matrix[row][col]);
        row--;
        col++;
      }
    } else {
      let col = Math.min(sum, cols - 1);
      let row = sum - col;
      while (col >= 0 && row < rows) {
        result.push(matrix[row][col]);
        row++;
        col--;
      }
    }
  }

  return result;
};

console.log(diagonalTraverse([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
console.log(diagonalTraverse([[1, 2, 3, 10], [4, 5, 6, 11], [7, 8, 9, 12], [13, 14, 15, 16]]));

export { diagonalTraverse };
