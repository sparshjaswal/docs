
# Strings

## Pattern Recognition

- **Sequence of Characters:** Strings are essentially arrays of characters.
- **Common Patterns:**
    - **Two Pointers:** For problems like palindromes, reversing, or finding substrings.
    - **Sliding Window:** For finding the longest substring with certain properties.
    - **Hashing:** To count character frequencies or find anagrams.
    - **Tries:** For problems involving prefixes and searching for words.

## Interview Strategy

1.  **Clarify the character set:** ASCII, Unicode, etc. This affects the space complexity of frequency maps.
2.  **Discuss immutability:** In many languages (like Java and Python), strings are immutable. This means that operations that modify a string actually create a new one.
3.  **Start with a simple approach:** A brute-force solution can be a good starting point.
4.  **Optimize:** Use string-specific patterns to improve performance.
5.  **Analyze complexity:** Discuss the time and space trade-offs.

## Multiple Solutions

### Example Problem: Longest Substring Without Repeating Characters

**Solution 1: Brute Force (O(n^3))**

```javascript
function lengthOfLongestSubstringBruteForce(s) {
    let maxLength = 0;
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            const substring = s.substring(i, j + 1);
            const charSet = new Set(substring);
            if (substring.length === charSet.size) {
                maxLength = Math.max(maxLength, substring.length);
            }
        }
    }
    return maxLength;
}
```

**Solution 2: Sliding Window (O(n))**

```javascript
function lengthOfLongestSubstringSlidingWindow(s) {
    let maxLength = 0;
    let start = 0;
    const charMap = new Map();
    for (let end = 0; end < s.length; end++) {
        const char = s[end];
        if (charMap.has(char)) {
            start = Math.max(charMap.get(char) + 1, start);
        }
        charMap.set(char, end);
        maxLength = Math.max(maxLength, end - start + 1);
    }
    return maxLength;
}
```

## Complexity Analysis

| Algorithm        | Time Complexity | Space Complexity |
| ---------------- | --------------- | ---------------- |
| Brute Force      | O(n^3)          | O(k) where k is the size of the substring |
| Sliding Window   | O(n)            | O(min(n, m)) where m is the size of the character set |

## Dry Runs

**Problem:** `lengthOfLongestSubstringSlidingWindow("abcabcbb")`

1.  `end = 0`, `char = 'a'`, `start = 0`, `maxLength = 1`. `charMap = {'a': 0}`.
2.  `end = 1`, `char = 'b'`, `start = 0`, `maxLength = 2`. `charMap = {'a': 0, 'b': 1}`.
3.  `end = 2`, `char = 'c'`, `start = 0`, `maxLength = 3`. `charMap = {'a': 0, 'b': 1, 'c': 2}`.
4.  `end = 3`, `char = 'a'`, `start = 1`. `maxLength = 3`. `charMap = {'a': 3, 'b': 1, 'c': 2}`.

## Visualization

- **String:** A sequence of boxes, each holding a character.
- **Sliding Window:** A window that expands from the right and shrinks from the left.

## LeetCode References

- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [Valid Anagram](https://leetcode.com/problems/valid-anagram/)
- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)
- [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

## Company-Specific Questions

- **Microsoft:** Reverse words in a string.
- **Apple:** Implement a function to perform basic string compression.
- **Adobe:** Find the first non-repeating character in a string.

## Variations

- **Anagrams:** Problems involving rearranging the characters of a string.
- **Palindromes:** Strings that read the same forwards and backwards.
- **Subsequences:** A sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

## Revision Notes

- Be very comfortable with the sliding window technique.
- Know how to use a hash map to store character frequencies.
- Remember that strings are often immutable.
- Practice problems involving palindromes, anagrams, and substrings.
