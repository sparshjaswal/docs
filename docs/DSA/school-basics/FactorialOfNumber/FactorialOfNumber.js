// Find the Factorial of a large number
// Last Updated : 23 Jul, 2025
// Factorial of a non-negative integer, is the multiplication of all integers smaller than or equal to n. 

// Factorial of a number
// Factorial of a number
// Examples: 

// Input: 100
// Output: 933262154439441526816992388562667004-
//          907159682643816214685929638952175999-
//          932299156089414639761565182862536979-
//          208272237582511852109168640000000000-
//          00000000000000

// Input: 50
// Output: 3041409320171337804361260816606476884-
//          4377641568960512000000000000

// const FactorialOfNumber = (x) => {
//     if(x<=1)
//         return x;
//     return x*FactorialOfNumber(x-1);
    
// } call stack has limitation of 10k calls resursion is not a right solutions

const FactorialOfNumber = x => {
    if(x<1) return BigInt(x);
    let result = 1n;
    for(let i=2n;i<=BigInt(x);i++){
        result*=i;
    }
    return result;
}



export { FactorialOfNumber };