// 118. Pascal's Triangle
// Given an integer numRows, return the first numRows of Pascal's triangle.
// In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:

// Example 1:
// Input: numRows = 5
// Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]

// Example 2:
// Input: numRows = 1
// Output: [[1]]

// Constraints:
// 1 <= numRows <= 30

const generate = numRows => {
    if(numRows ===0 ) return [[1]]
    const res = [];
    for(let i=0;i<numRows;i++){
        const row = new Array(i+1).fill(1);
        for(let j=1;j<i;j++){
            row[j]=res[i-1][j-1]+res[i-1][j];
        }
        res.push(row);
    }
    return res;
}

console.log(generate(5))
console.log(generate(1))
console.log(generate(0))

export { generate }