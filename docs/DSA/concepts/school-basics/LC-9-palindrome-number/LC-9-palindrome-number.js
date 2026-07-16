// 9. Palindrome Number
// Given an integer x, return true if x is a palindrome, and false otherwise.

// Example 1:
// Input: x = 121
// Output: true
// Explanation: 121 reads as 121 from left to right and from right to left.

// Example 2:
// Input: x = -121
// Output: false
// Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

// Example 3:
// Input: x = 10
// Output: false
// Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

// Constraints:
// -231 <= x <= 231 - 1
 

// const isPalindromeNumber = (x) => {
//     let num = x;
//     let revNum = 0;
//     while(num>0){
//         revNum=revNum*10+num%10;
//         num = Math.floor(num/10);
//     }
//     return revNum=== x? true:false;
// }

// The issue with the approaches suggested above is that they are not the most optimized solutions.

const isPalindromeNumber = (x) => {
    if(x<0 || (x!==0 && x%10===0))
        return false; // removing the negative and single digits numbers
    // target if the number i palindrome then its half are also palindrome
    let revNum=0;
    while(x>revNum){
        revNum=revNum*10+x%10;
        x = Math.floor(x/10);
    }
    return x=== revNum || x===Math.floor(revNum/10); // x===Math.floor(rev/10) in case of odd digits ignore center digits
}

export { isPalindromeNumber };