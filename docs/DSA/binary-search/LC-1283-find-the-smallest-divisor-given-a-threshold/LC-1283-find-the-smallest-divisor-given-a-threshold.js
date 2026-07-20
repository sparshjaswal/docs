// 1283. Find the Smallest Divisor Given a Threshold1283. Find the Smallest Divisor Given a Threshold
// Given an array of integers nums and an integer threshold, we will choose a positive integer divisor, divide all the array by it, and sum the division's result. Find the smallest divisor such that the result mentioned above is less than or equal to threshold.
// Each result of the division is rounded to the nearest integer greater than or equal to that element. (For example: 7/3 = 3 and 10/2 = 5).
// The test cases are generated so that there will be an answer.
// Example 1:
// Input: nums = [1,2,5,9], threshold = 6
// Output: 5
// Explanation: We can get a sum to 17 (1+2+5+9) if the divisor is 1. 
// If the divisor is 4 we can get a sum of 7 (1+1+2+3) and if the divisor is 5 the sum will be 5 (1+1+1+2).

// Example 2:
// Input: nums = [44,22,33,11,1], threshold = 5
// Output: 44

// Constraints:
// 1 <= nums.length <= 5 * 104
// 1 <= nums[i] <= 106
// nums.length <= threshold <= 106

const divisorSum = (nums, num, threshold) => {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += Math.ceil(nums[i] / num);
        if (sum > threshold)
            return false;
    }
    return true;
}

const smallestDivisor = (nums, threshold) => {
    let max = Math.max(...nums);
    let min = 1;
    while (min < max) {
        let mid = Math.floor((max + min) / 2);
        if (divisorSum(nums, mid, threshold)) {
            max = mid;
        } else {
            min = mid + 1;
        }
    }
    return min;
};

console.log(smallestDivisor([1, 2, 5, 9], 6));
console.log(smallestDivisor([44, 22, 33, 11, 1], 5));
console.log(smallestDivisor([21212, 10101, 12121], 1000000));