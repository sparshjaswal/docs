// Given an Integer n, find the reverse of its digits.

// Examples:  

// Input: n = 122
// Output: 221
// Explanation: By reversing the digits of number, number will change into 221.

// Input: n = 200
// Output: 2
// Explanation: By reversing the digits of number, number will change into 2.

// Input: n = 12345 
// Output: 54321
// Explanation: By reversing the digits of number, number will change into 54321.

const reverseNumber = (num) => {
    let revNum = 0;
    while(num>0){
        revNum=revNum*10+num%10;
        num = Math.floor(num/10);
    }
    return revNum;
}

export { reverseNumber };