// 59. Spiral Matrix II
// Given n, generate an n x n matrix filled with numbers from 1 to n^2 in spiral order.

const generateMatrix = n => {
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  let top = 0;
  let bottom = n - 1;
  let left = 0;
  let right = n - 1;
  let value = 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) matrix[top][col] = value++;
    top++;

    for (let row = top; row <= bottom; row++) matrix[row][right] = value++;
    right--;

    if (top <= bottom) {
      for (let col = right; col >= left; col--) matrix[bottom][col] = value++;
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) matrix[row][left] = value++;
      left++;
    }
  }

  return matrix;
};

console.log(generateMatrix(1));
console.log(generateMatrix(3));

export { generateMatrix };
