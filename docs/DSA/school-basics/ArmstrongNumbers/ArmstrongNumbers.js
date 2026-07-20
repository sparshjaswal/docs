// Armstrong Numbers
// Given a number x, determine whether the given number is Armstrong's number or not. A positive integer of n digits is called an Armstrong number of order n (order is the number of digits) if
// abcd... = pow(a,n) + pow(b,n) + pow(c,n) + pow(d,n) + ....
// Here a, b, c and d are digits of input number abcd.....

// Examples
// Input: n = 153
// Output: true
// Explanation: 153 is an Armstrong number, 1*1*1 + 5*5*5 + 3*3*3 = 153

// Input: n = 9474
// Output: true
// Explanation: 94 + 44 + 74 + 44 = 6561 + 256 + 2401 + 256 = 9474

// Input: n = 123
// Output: false
// Explanation: 1³ + 2³ + 3³ = 1 + 8 + 27 = 36

const isArmstrongNumbers = (n) => {
   if(n<0||!Number.isInteger(n)) return false; // only positive && non decimal number
   if(n ===0) return true;
   const pow = String(n).length;
   let num = n;
   let sum=0;
   while(num>0){
    const digit = num%10;
    sum+=Math.pow(digit,pow)
    num=Math.floor(num/10);
   }
   return sum===n;
}                   
console.log(isArmstrongNumbers(153))
console.log(isArmstrongNumbers(9474))
console.log(isArmstrongNumbers(123))

export { isArmstrongNumbers }