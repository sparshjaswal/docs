// Given an integer array arr[], find the subarray (containing at least one element) which has the maximum possible sum, and return that sum.
// Note: A subarray is a continuous part of an array.

// Examples:
// Input: arr[] = [2, 3, -8, 7, -1, 2, 3]
// Output: 11
// Explanation: The subarray [7, -1, 2, 3] has the largest sum 11.

// Input: arr[] = [-2, -4]
// Output: -2
// Explanation: The subarray [-2] has the largest sum -2.

// Input: arr[] = [5, 4, 1, 7, 8]
// Output: 25
// Explanation: The subarray [5, 4, 1, 7, 8] has the largest sum 25.

// pseudocode
// function Kadane(arr):
//     maxEndingHere = arr[0]
//     maxSoFar = arr[0]

//     for i from 1 to arr.length - 1:
//         maxEndingHere = max(arr[i], maxEndingHere + arr[i])
//         maxSoFar = max(maxSoFar, maxEndingHere)

//     return maxSoFar

const maxSubarraySum = (arr) => {
    let sum = arr[0];
    let maxEndingHere = arr[0];
    startIndex = 0;
    endIndex = 0;
    let tempStartIndex = 0;
    for (let i= 0; i < arr.length; i++) {
        if(maxEndingHere + arr[i] < arr[i]) {
            maxEndingHere = arr[i];
            tempStartIndex = i;
        }else {
            maxEndingHere+= arr[i];
        }
        if(maxEndingHere > sum) {
            sum = maxEndingHere;
            startIndex = tempStartIndex;
            endIndex = i;
        }
    }
    return {sum, subarray: arr.slice(startIndex, endIndex + 1)};
}

console.log(maxSubarraySum([2, 3, -8, 7, -1, 2, 3]));
console.log(maxSubarraySum([-2, -4]));
console.log(maxSubarraySum([5, 4, 1, 7, 8]));