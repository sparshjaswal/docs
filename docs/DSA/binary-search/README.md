---
id: dsa-binary-search-readme
title: 🔍 Binary Search
slug: /DSA/binary-search/README
sidebar_label: 🔍 Binary Search
---

# 🔍 Binary Search

> **One-line summary**: Repeatedly halve the search space by comparing the middle element — O(log n) on any sorted or monotonic space.

---

## 🎯 Core Concepts

### What is Binary Search?

Binary search is a **divide-and-conquer** algorithm that efficiently finds a target value in a **sorted array** by repeatedly dividing the search space in half.

### How Binary Search Works

- If `arr[mid] > target` → Search **left half** (`right = mid - 1`)

3. **Repeat** until found or search space exhausted

### Key Insights

- **Efficiency**: Each comparison eliminates **half** the remaining search space
- **Prerequisite**: Array must be **sorted** (or have some monotonic property)
- **Logarithmic**: Reduces n elements to 1 in ~log₂(n) steps

### Binary Search Variants

- **Standard Search**: Find exact target in sorted array
- **First/Last Occurrence**: Find boundaries of duplicate elements
- **Rotated Arrays**: Search in rotated sorted arrays
- **Peak Finding**: Find local maxima in mountain arrays

- **Binary Search on Answer**: Find optimal value in solution space

### When to Use Binary Search?

✅ **Perfect for:**

- **Sorted arrays** with target search
- **"Find minimum/maximum value that satisfies condition"** problems
- **Rotated or mountain arrays**
- **Optimization problems** with monotonic solution space

### Enhanced Visualization

The enhanced animation above demonstrates:

- **Smooth pointer movements** showing low, high, and mid pointer transitions
- **Visual discard regions** highlighting eliminated search space
- **Step-by-step comparison logic** with detailed phase descriptions
- **Real-time complexity analysis** showing O(log n) efficiency
- **Interactive elements** with glow effects and status indicatorsdata (unless you can sort first)
- Small datasets (linear search might be faster)
- When you need to find all occurrences efficiently

---

## 📊 Visual Learning

![Binary Search Flow](../../assets/images/binary-search-flow.svg)
![Binary Search Animation](../../assets/images/binary-search-flow-anim.svg)

---

## ⚡ Time & Space Complexity

| **Rotated Array Search** | O(log n) | O(1) | Handle rotation with pivot |

| **Peak Finding** | O(log n) | O(1) | Find local maxima |
| **Binary Search on Answer** | O(n log W) | O(1) | W = search space range |
| **2D Matrix Search** | O(log(m×n)) | O(1) | Treat as 1D sorted array |

**Key Insight**: Binary search achieves logarithmic time by eliminating half the search space in each iteration.

---

## 🔧 Essential Patterns & Templates

```javascript
function binarySearch(arr, target) {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    // Prevent integer overflow
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) {
      return mid; // Found target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Target not found
}
// Time: O(log n), Space: O(1)
// Use case: Find exact target in sorted array
```

### 2️⃣ First/Last Occurrence - Find Boundaries

```javascript
function findFirstOccurrence(arr, target) {
  let left = 0,
    right = arr.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left for first occurrence
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

function findLastOccurrence(arr, target) {
  let left = 0,
    right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      result = mid;
      left = mid + 1; // Continue searching right for last occurrence
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
// Time: O(log n), Space: O(1)
// Use case: Find range of duplicate elements
```

### 3️⃣ Binary Search on Answer - Optimization Problems

```javascript
function binarySearchOnAnswer(nums, threshold) {
  let left = 1,
    right = Math.max(...nums);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (isFeasible(nums, mid, threshold)) {
      right = mid; // Try smaller values
    } else {
      left = mid + 1; // Need larger values
    }
  }
  return left;
}

function isFeasible(nums, divisor, threshold) {
  let sum = 0;
  for (const num of nums) {
    sum += Math.ceil(num / divisor);
  }
  return sum <= threshold;
}
// Time: O(n log W) where W is the search range
// Use case: "Find minimum X such that condition is satisfied"
```

### 4️⃣ Search in Rotated Sorted Array

```javascript
function searchRotated(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;

    // Determine which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Target in left half
      } else {
        left = mid + 1; // Target in right half
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Target in right half
      } else {
        right = mid - 1; // Target in left half
      }
    }
  }

  return -1;
}
// Time: O(log n), Space: O(1)
// Use case: Search in rotated sorted arrays
```

### 5️⃣ Search Insert Position

```javascript
while (left <= right) {
  const mid = left + Math.floor((right - left) / 2);

  if (nums[mid] === target) {
    return mid;
  } else if (nums[mid] < target) {
    left = mid + 1;
  } else {
  }
}

// Time: O(log n), Space: O(1)
// Use case: Find insertion point for maintaining sorted order
```

---

## ⚠️ Common Pitfalls & How to Avoid Them

```javascript
const mid = Math.floor((left + right) / 2); // Could overflow

// ✅ Safe approach - always use this
const mid = left + Math.floor((right - left) / 2);
```

```javascript
// ❌ Wrong boundary conditions
while (left < right) {  // Missing equal case
  // ... might miss exact match

}



  // ... handles all cases including when left === right
}




// ✅ Correct for "find minimum X" problems
while (left < right) {
  // ... converges to single answer
}
```

### 🚫 **Infinite Loops**

```javascript
// ❌ Wrong - can cause infinite loop
while (left < right) {
  const mid = Math.floor((left + right) / 2);
  if (condition) {
    left = mid; // Should be mid + 1
  } else {
    right = mid - 1;
  }
}

// ✅ Correct - ensure progress
while (left < right) {
  const mid = Math.floor((left + right) / 2);
  if (condition) {
    right = mid;
  } else {
    left = mid + 1;
  }
}
```

### 🚫 **Wrong Search Space**

```javascript
// ❌ Wrong - not considering all possibilities
let left = 1,
  right = nums.length; // Missing 0 or length?

// ✅ Correct - think about valid range
let left = 0,
  right = nums.length - 1; // For array indices
// OR
let left = 1,
  right = maxPossibleValue; // For answer space
```

### 🚫 **Non-Monotonic Feasible Function**

```javascript
// Binary search on answer requires monotonic property:
// If feasible(x) is true, then feasible(x+1) should also be true
// OR if feasible(x) is false, then feasible(x-1) should also be false

// ❌ Wrong - feasible function not monotonic
function feasible(x) {
  return someComplexCondition(x); // Random true/false
}

// ✅ Correct - monotonic feasible function
function feasible(capacity) {
  return canShipWithCapacity(capacity); // Larger capacity = always feasible
}
```

### 💡 **Pro Tips**

- **Draw the search space** - visualize what you're searching
- **Test boundary conditions** - empty array, single element, target at edges
- **Verify monotonic property** for binary search on answer
- **Use descriptive variable names** - `left`, `right`, `mid` are clear
- **Consider edge cases** - duplicates, rotated arrays, negative numbers

---

## Practice Problems

| Problem                                                                                                                         | Difficulty | Solution                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| [LC 704 — Binary Search](https://leetcode.com/problems/binary-search/)                                                          | Easy       |                                                                                      |
| [LC 35 — Search Insert Position](https://leetcode.com/problems/search-insert-position/)                                         | Easy       |                                                                                      |
| [LC 69 — Sqrt(x)](https://leetcode.com/problems/sqrtx/)                                                                         | Easy       |                                                                                      |
| [LC 278 — First Bad Version](https://leetcode.com/problems/first-bad-version/)                                                  | Easy       |                                                                                      |
| [LC 374 — Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/)                            | Easy       |                                                                                      |
| [LC 441 — Arranging Coins](https://leetcode.com/problems/arranging-coins/)                                                      | Easy       |                                                                                      |
| [LC 744 — Find Smallest Letter Greater Than Target](https://leetcode.com/problems/find-smallest-letter-greater-than-target/)    | Easy       |                                                                                      |
| [LC 852 — Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/)                        | Easy       |                                                                                      |
| [LC 1351 — Count Negative Numbers in a Sorted Matrix](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/) | Easy       |                                                                                      |
| [LC 1539 — Kth Missing Positive Number](https://leetcode.com/problems/kth-missing-positive-number/)                             | Easy       |                                                                                      |
| [CC — Binary Search Basic (BINSRCH)](https://www.codechef.com/problems/BINSRCH)                                                 | Easy       |                                                                                      |
| [CC — Find Element (FINDELEM)](https://www.codechef.com/problems/FINDELEM)                                                      | Easy       |                                                                                      |
| [LC 1283 — Find Smallest Divisor](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/)                   | Medium     | [View Solution](./LC-1283-find-the-smallest-divisor-given-a-threshold) |
| [LC 1101 — Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)                   | Medium     | [View Solution](./LC-1101-capacity-to-ship-packages-within-d-days)     |
| [LC 875 — Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                              | Medium     |                                                                                      |
| [LC 33 — Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)                         | Medium     |                                                                                      |
| [LC 153 — Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)            | Medium     |                                                                                      |
| [LC 162 — Find Peak Element](https://leetcode.com/problems/find-peak-element/)                                                  | Medium     |                                                                                      |
| [LC 34 — Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)  | Medium     |                                                                                      |
| [LC 74 — Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)                                                 | Medium     |                                                                                      |
| [LC 81 — Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)                   | Medium     |                                                                                      |
| [LC 154 — Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/)      | Medium     |                                                                                      |
| [LC 240 — Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/)                                          | Medium     |                                                                                      |
| [LC 275 — H-Index II](https://leetcode.com/problems/h-index-ii/)                                                                | Medium     |                                                                                      |
| [LC 287 — Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)                                  | Medium     |                                                                                      |
| [LC 378 — Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)      | Medium     |                                                                                      |
| [LC 540 — Single Element in a Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/)                    | Medium     |                                                                                      |
| [LC 658 — Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements/)                                      | Medium     |                                                                                      |
| [LC 702 — Search in a Sorted Array of Unknown Size](https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/)    | Medium     |                                                                                      |
| [LC 1004 — Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                   | Medium     |                                                                                      |
| [LC 1011 — Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)     | Medium     |                                                                                      |
| [LC 1482 — Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | Medium     |                                                                                      |
| [CC — Binary Search on Answer (BINSANS)](https://www.codechef.com/problems/BINSANS)                                             | Medium     |                                                                                      |
| [CC — Rotated Array Search (ROTARR)](https://www.codechef.com/problems/ROTARR)                                                  | Medium     |                                                                                      |
| [LC 410 — Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)                                      | Hard       |                                                                                      |
| [LC 4 — Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)                                | Hard       |                                                                                      |
| [LC 37 — Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)                                                           | Hard       |                                                                                      |
| [LC 174 — Dungeon Game](https://leetcode.com/problems/dungeon-game/)                                                            | Hard       |                                                                                      |
| [LC 302 — Smallest Rectangle Enclosing Black Pixels](https://leetcode.com/problems/smallest-rectangle-enclosing-black-pixels/)  | Hard       |                                                                                      |
| [LC 354 — Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                                        | Hard       |                                                                                      |
| [LC 719 — Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)                    | Hard       |                                                                                      |
| [LC 786 — K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)                            | Hard       |                                                                                      |
| [LC 1095 — Find in Mountain Array](https://leetcode.com/problems/find-in-mountain-array/)                                       | Hard       |                                                                                      |
| [LC 1231 — Divide Chocolate](https://leetcode.com/problems/divide-chocolate/)                                                   | Hard       |                                                                                      |
| [CC — Binary Search in Rotated Array (BINROT)](https://www.codechef.com/problems/BINROT)                                        | Hard       |                                                                                      |
| [CC — Advanced Binary Search (ADVBINS)](https://www.codechef.com/problems/ADVBINS)                                              | Hard       |                                                                                      |

---

## 🔗 Related Topics

- **[Dynamic Programming](../dp/README.md)** — Binary search can optimize DP solutions
- **[Divide and Conquer](../recursion/README.md)** — Binary search is a classic D&C algorithm

---

## 🎯 Quick Interview Prep Checklist

- [ ] Master the standard binary search template
- [ ] Understand first/last occurrence patterns
- [ ] Practice binary search on answer problems
- [ ] Know how to handle rotated sorted arrays
- [ ] Comfortable with 2D matrix search
- [ ] Understand when binary search applies
- [ ] Practice peak finding algorithms
- [ ] Know common pitfalls and edge cases

[← Back to Home](../index.md) · © sparshjaswal
