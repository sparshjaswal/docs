// Check if given number is perfect square
// Last Updated : 17 Sep, 2024
// Given a number n, check if it is a perfect square or not. 

// Examples : 

// Input  : n = 36
// Output : Yes

// Input : n = 2500
// Output : Yes
// Explanation: 2500 is a perfect square of 50

// Input  : n = 8
// Output : No

const perfectSquare = (n) => {
    if (n < 0) return false;
    let sqrt = Math.sqrt(n);
    if (Number.isInteger(sqrt))
        return true;
    else
        return false;
}
console.log(perfectSquare(36));
console.log(perfectSquare(2500));
console.log(perfectSquare(8));

export { perfectSquare }