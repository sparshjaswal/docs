// Program to Print Floyd's Triangle
// Floyd's triangle is a triangle with first natural numbers. 
 
// 1
// 2     3
// 4     5     6
// 7     8     9     10
// 11     12     13     14     15

const printFloydsTriangle = (numRows) => {
  let current = 1;
  const rows = [];
  for (let i = 1; i <= numRows; i++) {
    const row = [];
    for (let j = 0; j < i; j++) {
      row.push(current);
      current++;
    }
    rows.push(row.join(' '));
  }
  return rows.join('\n');
};

console.log(printFloydsTriangle(3));
console.log(printFloydsTriangle(5));