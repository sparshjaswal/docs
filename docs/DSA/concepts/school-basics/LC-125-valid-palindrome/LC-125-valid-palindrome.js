// 125. Valid Palindrome
// A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

// Given a string s, return true if it is a palindrome, or false otherwise.

// Example 1:
// Input: s = "A man, a plan, a canal: Panama"
// Output: true
// Explanation: "amanaplanacanalpanama" is a palindrome.

// Example 2:
// Input: s = "race a car"
// Output: false
// Explanation: "raceacar" is not a palindrome.

// Example 3:
// Input: s = " "
// Output: true
// Explanation: s is an empty string "" after removing non-alphanumeric characters.
// Since an empty string reads the same forward and backward, it is a palindrome.

const isValidPalindrome = (s) => {
   let str = s.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g,"");
   return str ===str.split('').reverse().join('');
}

// two pointer is best way to solve a problem

// const isValidPalindrome = s => {
//    s = s.toLowerCase();
//    let i = 0;
//    let j = s.length-1;
//    while(i<j){
//       while (i < j && !/[a-z]/.test(s[i])) i++;
//       while (i < j && !/[a-z]/.test(s[j])) j--;
//       if (s[i] !== s[j]) return false;
//       i++;
//       j--;
//    }
//    return true;
// }

console.log(isValidPalindrome("A man, a plan, a canal: Panama"))
console.log(isValidPalindrome("race a car"))
console.log(isValidPalindrome(" "))

export { isValidPalindrome }