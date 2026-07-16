// 242. Valid Anagram
// Given two strings s and t, return true if t is an anagram of s, and false otherwise.

// Example 1:
// Input: s = "anagram", t = "nagaram"
// Output: true

// Example 2:
// Input: s = "rat", t = "car"
// Output: false

// Constraints:
// 1 <= s.length, t.length <= 5 * 104
// s and t consist of lowercase English letters.
// Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?

const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;
  const str = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    str[s.charCodeAt(i) - 97]++;
    str[t.charCodeAt(i) - 97]--;
  }
  return str.every((item) => item ===0);
};

console.log(isAnagram("anagram", "nagaram"));
console.log(isAnagram("rat", "car"));
