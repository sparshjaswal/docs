
# Arrays

## Pattern Recognition

- **Contiguous Memory:** Arrays store elements in contiguous memory locations, allowing for constant-time access (O(1)) using an index.
- **Fixed or Dynamic Size:** Arrays can have a fixed size (in languages like C++) or be dynamic (like in JavaScript or Python).
- **Common Patterns:**
    - **Two Pointers:** Using two pointers to iterate from both ends of the array or at different speeds.
    - **Sliding Window:** A subarray of a certain size that moves through the array.
    - **Prefix Sum:** Pre-calculating sums of prefixes of the array to quickly find the sum of any subarray.
    - **Hashing:** Using a hash map to store frequencies or check for existence of elements.

## Interview Strategy

1.  **Clarify the problem:** Understand the constraints, input size, and expected output.
2.  **Discuss the brute-force solution:** This shows you can solve the problem, even if inefficiently.
3.  **Optimize the solution:** Use patterns like two pointers, sliding window, or hashing to improve the time or space complexity.
4.  **Analyze the complexity:** Discuss the time and space complexity of your optimized solution.
5.  **Code the solution:** Write clean, readable, and well-commented code.
6.  **Test with edge cases:** Consider empty arrays, arrays with one element, arrays with duplicate elements, etc.

## Multiple Solutions

### Example Problem: Find Two Numbers that Sum to a Target

**Solution 1: Brute Force (O(n^2))**

```javascript
function twoSumBruteForce(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
```

**Solution 2: Hashing (O(n))**

```javascript
function twoSumHashing(arr, target) {
    const numMap = new Map();
    for (let i = 0; i < arr.length; i++) {
        const complement = target - arr[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(arr[i], i);
    }
    return [];
}
```

## Complexity Analysis

| Algorithm            | Time Complexity | Space Complexity |
| -------------------- | --------------- | ---------------- |
| Brute Force          | O(n^2)          | O(1)             |
| Hashing              | O(n)            | O(n)             |
| Two Pointers (sorted)| O(n log n)      | O(1)             |

## Dry Runs

**Problem:** `twoSumHashing([2, 7, 11, 15], 9)`

1.  `i = 0`, `arr[0] = 2`, `complement = 7`. `numMap` is empty. `numMap.set(2, 0)`.
2.  `i = 1`, `arr[1] = 7`, `complement = 2`. `numMap.has(2)` is true. Return `[numMap.get(2), 1]` which is `[0, 1]`.

## Visualization

- **Array:** A series of connected boxes, each with an index and a value.
- **Two Pointers:** Two arrows pointing to different boxes in the array.
- **Sliding Window:** A highlighted section of the array that moves.

## LeetCode References

- [Two Sum](https://leetcode.com/problems/two-sum/)
- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

## Company-Specific Questions

- **Google:** Find the kth largest element in an unsorted array.
- **Facebook:** Given an array of integers, find the subarray with the largest sum.
- **Amazon:** Find the missing number in an array of n-1 integers from 1 to n.

## Variations

- **Sorted Array:** If the array is sorted, you can use binary search or the two-pointer technique to optimize.
- **2D Arrays (Matrices):** Problems involving grids, such as finding a path or a subgrid with a certain property.
- **Circular Arrays:** The end of the array wraps around to the beginning.

## Revision Notes

- Master the common patterns: two pointers, sliding window, prefix sum.
- Understand the trade-offs between different solutions (time vs. space).
- Practice with a variety of array problems on LeetCode.
- Be comfortable with complexity analysis.
