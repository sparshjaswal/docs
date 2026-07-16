
# 🔤 Strings

> **One-line summary**: Immutable character sequences — master sliding window, two pointers, and hashing on strings for O(n) solutions to substring/pattern problems.

---

## 📊 Visual Learning

### String Processing Techniques
![String Processing Overview](../../../assets/images/sliding-window.svg)
*Visualization of sliding window technique for substring problems and pattern matching*

### String Algorithm Animations
![String Processing Flow](../../../assets/images/sliding-window-flow-anim.svg)
*Interactive demonstration of string manipulation algorithms and optimization techniques*

### Two Pointers on Strings
![Two Pointers Technique](../../../assets/images/two-pointers-flow-anim.svg)
*Visual guide to using two pointers for palindrome checking and string reversal*

### String Hashing Visualization
![String Hashing](../../../assets/images/hash-table.svg)
*Understanding how string hashing works for fast substring search and pattern matching*

## 🎯 Core Concepts

### String Fundamentals
- **Immutability**: Strings in JavaScript are immutable — operations create new strings
- **Character Access**: Use `s[i]` or `s.charAt(i)` to access characters
- **Length**: `s.length` gives the number of characters
- **Conversion**: `s.split('')` converts string to character array for manipulation

### Essential String Operations
```javascript
// Basic operations
s.charAt(i)           // Get character at index i
s.charCodeAt(i)       // Get ASCII/Unicode value
String.fromCharCode(c) // Convert ASCII to character
s.slice(start, end)   // Extract substring
s.substring(start, end) // Similar to slice
s.indexOf(substr)     // Find first occurrence
s.toLowerCase()       // Convert to lowercase
s.toUpperCase()       // Convert to uppercase
```

### Key String Patterns
- **Anagram Detection**: Sort characters or use frequency counting
- **Palindrome Check**: Two pointers from ends moving inward
- **Substring Search**: Sliding window or KMP algorithm
- **Pattern Matching**: Regular expressions or manual parsing

### When to Use String Algorithms?
✅ **Use when you need:**
- Text processing and manipulation
- Pattern matching and searching
- Anagram or palindrome detection
- Substring operations
- Character frequency analysis

❌ **Avoid when:**
- Working with purely numerical data
- Simple boolean operations
- Array manipulations without text context

---

## 🔧 Essential Patterns & Templates

### 1️⃣ Anagram Detection - Two Approaches

**Method 1: Sorting (Simple but O(n log n))**
```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}
// Time: O(n log n), Space: O(n)
// Use case: Simple anagram check
```

**Method 2: Frequency Count (Optimal O(n))**
```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const freq = {};
  
  // Count characters in first string
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  // Decrement for second string
  for (const char of t) {
    if (!freq[char]) return false;
    freq[char]--;
  }
  
  return true;
}
// Time: O(n), Space: O(1) - at most 26 letters
```

### 2️⃣ Palindrome Check - Two Pointers
```javascript
function isPalindrome(s) {
  // Clean string: remove non-alphanumeric, convert to lowercase
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  let left = 0, right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  
  return true;
}
// Time: O(n), Space: O(1)
// Use case: Valid palindrome problems
```

### 3️⃣ Sliding Window - Longest Substring Without Repeating Characters
```javascript
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0, maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    // Shrink window until no duplicates
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}
// Time: O(n), Space: O(min(m,n)) where m is charset size
// Use case: Substring problems with constraints
```

### 4️⃣ String Matching - KMP Algorithm Preview
```javascript
function strStr(haystack, needle) {
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;
  
  // Simple approach - for KMP, build failure function
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.substring(i, i + needle.length) === needle) {
      return i;
    }
  }
  
  return -1;
}
// Time: O(n*m) simple, O(n+m) with KMP
// Use case: Pattern matching, substring search
```

### 5️⃣ Character Frequency Map
```javascript
function getCharFrequency(s) {
  const freq = new Map();
  
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  return freq;
}
// Use case: Anagrams, character analysis, permutations
```

---

## ⚠️ Common Pitfalls & How to Avoid Them

### 🚫 **Performance Pitfalls**
```javascript
// ❌ Wrong - O(n²) string concatenation in loop
let result = '';
for (let i = 0; i < arr.length; i++) {
  result += arr[i]; // Creates new string each time!
}

// ✅ Correct - O(n) using array join
const parts = [];
for (let i = 0; i < arr.length; i++) {
  parts.push(arr[i]);
}
const result = parts.join('');
```

### 🚫 **Character Access Confusion**
```javascript
// Both work in modern JavaScript
const char1 = str[i];        // ✅ Preferred - cleaner syntax
const char2 = str.charAt(i); // ✅ Safe - returns '' for invalid index

// Key difference:
str[999]        // undefined for out-of-bounds
str.charAt(999) // '' (empty string) for out-of-bounds
```

### 🚫 **Unicode and Emoji Issues**
```javascript
const text = "Hello 👋 World";
console.log(text.length); // 13 (not 12!) - emoji counts as 2

// ✅ For proper character counting with Unicode:
const properLength = [...text].length; // 12 - correct count
```

### 🚫 **Case Sensitivity Mistakes**
```javascript
// ❌ Wrong - case sensitive comparison
if (str1 === str2) { ... }

// ✅ Correct - case insensitive when needed
if (str1.toLowerCase() === str2.toLowerCase()) { ... }
```

### 🚫 **Boundary Conditions**
```javascript
// Always check for:
// - Empty strings
// - Single character strings
// - Null or undefined inputs
function safeStringOperation(s) {
  if (!s || s.length === 0) return '';
  // ... rest of logic
}
```

### 💡 **Pro Tips**
- Use `String.prototype.includes()` for substring checking
- Remember that `slice()` can take negative indices
- Use template literals for complex string building
- Consider regex for complex pattern matching
- Use `split()` and `join()` for character manipulation

---

## Practice Problems

| Problem | Difficulty | Solution |
| ------- | ---------- | -------- |
| [LC 14 — Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/) | Easy |  |
| [LC 28 — Implement strStr()](https://leetcode.com/problems/implement-strstr/) | Easy |  |
| [LC 58 — Length of Last Word](https://leetcode.com/problems/length-of-last-word/) | Easy |  |
| [LC 125 — Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy |  |
| [LC 242 — Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy |  |
| [LC 344 — Reverse String](https://leetcode.com/problems/reverse-string/) | Easy |  |
| [LC 345 — Reverse Vowels of a String](https://leetcode.com/problems/reverse-vowels-of-a-string/) | Easy |  |
| [LC 383 — Ransom Note](https://leetcode.com/problems/ransom-note/) | Easy |  |
| [LC 387 — First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) | Easy |  |
| [LC 389 — Find the Difference](https://leetcode.com/problems/find-the-difference/) | Easy |  |
| [LC 415 — Add Strings](https://leetcode.com/problems/add-strings/) | Easy |  |
| [LC 459 — Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) | Easy |  |
| [LC 520 — Detect Capital](https://leetcode.com/problems/detect-capital/) | Easy |  |
| [LC 541 — Reverse String II](https://leetcode.com/problems/reverse-string-ii/) | Easy |  |
| [LC 557 — Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii/) | Easy |  |
| [LC 680 — Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | Easy |  |
| [LC 709 — To Lower Case](https://leetcode.com/problems/to-lower-case/) | Easy |  |
| [LC 771 — Jewels and Stones](https://leetcode.com/problems/jewels-and-stones/) | Easy |  |
| [LC 796 — Rotate String](https://leetcode.com/problems/rotate-string/) | Easy |  |
| [LC 819 — Most Common Word](https://leetcode.com/problems/most-common-word/) | Easy |  |
| [LC 859 — Buddy Strings](https://leetcode.com/problems/buddy-strings/) | Easy |  |
| [LC 925 — Long Pressed Name](https://leetcode.com/problems/long-pressed-name/) | Easy |  |
| [LC 1002 — Find Common Characters](https://leetcode.com/problems/find-common-characters/) | Easy |  |
| [LC 1108 — Defanging an IP Address](https://leetcode.com/problems/defanging-an-ip-address/) | Easy |  |
| [LC 1221 — Split a String in Balanced Strings](https://leetcode.com/problems/split-a-string-in-balanced-strings/) | Easy |  |
| [CC — String Basics (STRBASIC)](https://www.codechef.com/problems/STRBASIC) | Easy |  |
| [CC — Character Count (CHARCOUNT)](https://www.codechef.com/problems/CHARCOUNT) | Easy |  |
| [CC — Palindrome Check (PALCHECK)](https://www.codechef.com/problems/PALCHECK) | Easy |  |
| [LC 3 — Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium |  |
| [LC 5 — Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium |  |
| [LC 6 — Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion/) | Medium |  |
| [LC 8 — String to Integer (atoi)](https://leetcode.com/problems/string-to-integer-atoi/) | Medium |  |
| [LC 12 — Integer to Roman](https://leetcode.com/problems/integer-to-roman/) | Medium |  |
| [LC 13 — Roman to Integer](https://leetcode.com/problems/roman-to-integer/) | Medium |  |
| [LC 17 — Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium |  |
| [LC 22 — Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | Medium |  |
| [LC 49 — Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium |  |
| [LC 71 — Simplify Path](https://leetcode.com/problems/simplify-path/) | Medium |  |
| [LC 91 — Decode Ways](https://leetcode.com/problems/decode-ways/) | Medium |  |
| [LC 139 — Word Break](https://leetcode.com/problems/word-break/) | Medium |  |
| [LC 151 — Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/) | Medium |  |
| [LC 165 — Compare Version Numbers](https://leetcode.com/problems/compare-version-numbers/) | Medium |  |
| [LC 179 — Largest Number](https://leetcode.com/problems/largest-number/) | Medium |  |
| [LC 187 — Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/) | Medium |  |
| [LC 227 — Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/) | Medium |  |
| [LC 271 — Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) | Medium |  |
| [LC 290 — Word Pattern](https://leetcode.com/problems/word-pattern/) | Medium |  |
| [LC 394 — Decode String](https://leetcode.com/problems/decode-string/) | Medium |  |
| [LC 424 — Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium |  |
| [LC 438 — Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Medium |  |
| [LC 443 — String Compression](https://leetcode.com/problems/string-compression/) | Medium |  |
| [LC 516 — Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | Medium |  |
| [LC 567 — Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium |  |
| [LC 647 — Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/) | Medium |  |
| [LC 692 — Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/) | Medium |  |
| [LC 763 — Partition Labels](https://leetcode.com/problems/partition-labels/) | Medium |  |
| [LC 791 — Custom Sort String](https://leetcode.com/problems/custom-sort-string/) | Medium |  |
| [LC 856 — Score of Parentheses](https://leetcode.com/problems/score-of-parentheses/) | Medium |  |
| [LC 890 — Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/) | Medium |  |
| [LC 929 — Unique Email Addresses](https://leetcode.com/problems/unique-email-addresses/) | Medium |  |
| [LC 1071 — Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | Medium |  |
| [LC 1209 — Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/) | Medium |  |
| [LC 1249 — Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/) | Medium |  |
| [LC 1456 — Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | Medium |  |
| [CC — String Manipulation (STRMANIP)](https://www.codechef.com/problems/STRMANIP) | Medium |  |
| [CC — Pattern Matching (PATMATCH)](https://www.codechef.com/problems/PATMATCH) | Medium |  |
| [CC — Anagram Problems (ANAGRAM)](https://www.codechef.com/problems/ANAGRAM) | Medium |  |
| [LC 10 — Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) | Hard |  |
| [LC 30 — Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Hard |  |
| [LC 32 — Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) | Hard |  |
| [LC 44 — Wildcard Matching](https://leetcode.com/problems/wildcard-matching/) | Hard |  |
| [LC 68 — Text Justification](https://leetcode.com/problems/text-justification/) | Hard |  |
| [LC 72 — Edit Distance](https://leetcode.com/problems/edit-distance/) | Hard |  |
| [LC 76 — Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard |  |
| [LC 87 — Scramble String](https://leetcode.com/problems/scramble-string/) | Hard |  |
| [LC 115 — Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | Hard |  |
| [LC 126 — Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) | Hard |  |
| [LC 140 — Word Break II](https://leetcode.com/problems/word-break-ii/) | Hard |  |
| [LC 214 — Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) | Hard |  |
| [LC 224 — Basic Calculator](https://leetcode.com/problems/basic-calculator/) | Hard |  |
| [LC 269 — Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | Hard |  |
| [LC 301 — Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) | Hard |  |
| [LC 316 — Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/) | Hard |  |
| [LC 336 — Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/) | Hard |  |
| [LC 472 — Concatenated Words](https://leetcode.com/problems/concatenated-words/) | Hard |  |
| [LC 564 — Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome/) | Hard |  |
| [LC 726 — Number of Atoms](https://leetcode.com/problems/number-of-atoms/) | Hard |  |
| [LC 727 — Minimum Window Subsequence](https://leetcode.com/problems/minimum-window-subsequence/) | Hard |  |
| [LC 1044 — Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) | Hard |  |
| [LC 1092 — Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/) | Hard |  |
| [LC 1316 — Distinct Echo Substrings](https://leetcode.com/problems/distinct-echo-substrings/) | Hard |  |
| [LC 1392 — Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) | Hard |  |
| [CC — Advanced String Algorithms (ADVSTR)](https://www.codechef.com/problems/ADVSTR) | Hard |  |
| [CC — KMP Algorithm (KMPALGO)](https://www.codechef.com/problems/KMPALGO) | Hard |  |
| [CC — String Hashing (STRHASH)](https://www.codechef.com/problems/STRHASH) | Hard |  |





















---

## 🔗 Related Topics

- **[Sliding Window](../sliding-window/README.md)** — Essential for substring problems
- **[Two Pointers](../two-pointers/README.md)** — Palindrome and string reversal
- **[Hashing](../hashing/README.md)** — Character frequency and anagram detection
- **[Dynamic Programming](../dp/README.md)** — Edit distance and string matching
- **[Backtracking](../backtracking/README.md)** — String permutations and combinations

---

## 🎯 Quick Interview Prep Checklist

- [ ] Master anagram detection (both sorting and frequency methods)
- [ ] Understand palindrome checking with two pointers
- [ ] Practice sliding window for substring problems
- [ ] Know string manipulation techniques (reverse, rotate)
- [ ] Comfortable with character frequency counting
- [ ] Understand basic pattern matching algorithms
- [ ] Practice string parsing and validation
- [ ] Know when to use StringBuilder pattern (array + join)

[← Back to Home](../index.md) · © sparshjaswal
