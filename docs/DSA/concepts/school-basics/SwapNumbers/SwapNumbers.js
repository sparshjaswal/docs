// Given two variables a and y, swap two variables without using a third variable. 

// Examples:

// Input: a = 2, b = 3
// Output: a = 3, b = 2

// Input: a = 20, b = 0
// Output: a = 0, b = 20

// Input: a = 10, b = 10
// Output: a = 10, b = 10

const swapTwoVariable = (a,b) => {
    a = a+b;
    b=a-b;
    a=a-b;
    console.log(`a = ${a}, b = ${b}`);
}

swapTwoVariable(2, 3);
swapTwoVariable(20, 0);
swapTwoVariable(10, 10);

export { swapTwoVariable }