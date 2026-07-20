
# 🏫 School Level Basics

> **One-line summary**: Foundational mathematical and algorithmic building blocks — primes, GCD, palindromes, factorials, digit manipulation. Every DSA practitioner must write these from memory.

---

## Diagram

![School Basics Overview](../../assets/images/array-layout.svg)
![School Basics GIF](../../assets/images/cyclic-sort-flow-anim.svg)

## Concept

These problems build your intuition for:
- **Digit manipulation**: extracting digits via `% 10` and `Math.floor(n/10)`
- **Primality testing**: trial division up to √n
- **GCD / LCM**: Euclidean algorithm — `gcd(a,b) = gcd(b, a%b)`
- **Palindrome checking**: two-pointer or reverse-half technique
- **Bit tricks**: XOR swap, power-of-two check

---

## Key Algorithms

### Euclidean GCD
```javascript
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a / gcd(a, b)) * b; }
```

### Sieve of Eratosthenes
```javascript
function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++)
    if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = false;
  return isPrime;
}
```

### Digit Extraction
```javascript
function sumDigits(n) {
  let sum = 0;
  while (n > 0) { sum += n % 10; n = Math.floor(n / 10); }
  return sum;
}
```

### XOR Swap (no temp variable)
```javascript
let a = 5, b = 3;
a ^= b; b ^= a; a ^= b; // a=3, b=5
```

---

## Complexity Summary

| Problem | Time | Space |
|---------|------|-------|
| Sum 1..N (formula) | O(1) | O(1) |
| Prime check (trial division) | O(√n) | O(1) |
| Sieve of Eratosthenes | O(n log log n) | O(n) |
| Factorial (iterative) | O(n) | O(1) |
| GCD (Euclidean) | O(log min(a,b)) | O(1) |
| Palindrome check | O(n) | O(1) |

---

## Arrays — Key Concepts

Arrays are the most fundamental data structure: a contiguous block of memory with O(1) index access.

| Operation | Time | Notes |
|-----------|------|-------|
| Access by index | O(1) | Random access |
| Search (unsorted) | O(n) | Linear scan |
| Search (sorted) | O(log n) | Binary search |
| Insert at end | O(1) amortized | Dynamic array |
| Insert at index | O(n) | Shift required |
| Delete at index | O(n) | Shift required |

**Common pitfalls:**
- Off-by-one errors (`<` vs `<=`)
- Mutating array while iterating
- Forgetting to handle empty array edge cases

---

## Practice Problems

| Problem | Difficulty | Solution |
|---------|-----------|----------|
| [LC 9 — Palindrome Number](https://leetcode.com/problems/palindrome-number/) | Easy | [View Solution](./LC-9-palindrome-number) |
| [LC 125 — Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | [View Solution](./LC-125-valid-palindrome) |
| [LC 1071 — GCD of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | Easy | [View Solution](./LC-1071-greatest-common-divisor-of-strings) |
| [CC — ATM (HS08TEST)](https://www.codechef.com/problems/HS08TEST) | Easy |  |
| [CC — Factorial (FCTRL)](https://www.codechef.com/problems/FCTRL) | Easy | [View Solution](./FactorialOfNumber) |
| [CC — Chef and Squares (CHFSQRS)](https://www.codechef.com/problems/CHFSQRS) | Easy |  |
| [CC — Number of Rectangles (NRECT)](https://www.codechef.com/problems/NRECT) | Easy |  |
| [CC — Palindrome (PALIN)](https://www.codechef.com/problems/PALIN) | Easy |  |
| [LC 66 — Plus One](https://leetcode.com/problems/plus-one/) | Easy |  |
| [LC 7 — Reverse Integer](https://leetcode.com/problems/reverse-integer/) | Medium | [View Solution](./ReverseNumber) |
| [LC 202 — Happy Number](https://leetcode.com/problems/happy-number/) | Easy |  |
| [LC 1 — Two Sum](https://leetcode.com/problems/two-sum/) | Easy |  |
| [LC 26 — Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Easy |  |
| [LC 27 — Remove Element](https://leetcode.com/problems/remove-element/) | Easy |  |
| [LC 35 — Search Insert Position](https://leetcode.com/problems/search-insert-position/) | Easy |  |
| [LC 58 — Length of Last Word](https://leetcode.com/problems/length-of-last-word/) | Easy |  |
| [LC 88 — Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) | Easy |  |
| [LC 118 — Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/) | Easy |  |
| [LC 119 — Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii/) | Easy |  |
| [LC 136 — Single Number](https://leetcode.com/problems/single-number/) | Easy |  |
| [LC 169 — Majority Element](https://leetcode.com/problems/majority-element/) | Easy |  |
| [LC 217 — Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Easy |  |
| [LC 242 — Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy |  |
| [LC 283 — Move Zeroes](https://leetcode.com/problems/move-zeroes/) | Easy |  |
| [LC 344 — Reverse String](https://leetcode.com/problems/reverse-string/) | Easy |  |
| [LC 387 — First Unique Character in String](https://leetcode.com/problems/first-unique-character-in-a-string/) | Easy |  |
| [LC 412 — Fizz Buzz](https://leetcode.com/problems/fizz-buzz/) | Easy |  |
| [CC — Life, the Universe, and Everything (TEST)](https://www.codechef.com/problems/TEST) | Easy |  |
| [CC — Enormous Input Test (INTEST)](https://www.codechef.com/problems/INTEST) | Easy |  |
| [CC — Reverse The Number (FLOW007)](https://www.codechef.com/problems/FLOW007) | Easy |  |
| [CC — Find Remainder (FLOW002)](https://www.codechef.com/problems/FLOW002) | Easy |  |

---

## Related Topics

- [Math](../math/README.md) — deeper number theory
- [Bit Manipulation](../bit-manipulation/README.md) — XOR swap, parity tricks
- [Two Pointers](../two-pointers/README.md) — palindrome with two pointers

[← Back to Home](../index.md) · © sparshjaswal
