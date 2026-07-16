// 128. Longest Consecutive Sequence
// Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.
// You must write an algorithm that runs in O(n) time.

// Example 1:
// Input: nums = [100,4,200,1,3,2]
// Output: 4
// Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

// Example 2:
// Input: nums = [0,3,7,2,5,8,4,6,0,1]
// Output: 9

// Example 3:
// Input: nums = [1,0,1,2]
// Output: 3

// Constraints:
// 0 <= nums.length <= 105
// -109 <= nums[i] <= 109

var longestConsecutive = function(nums) {
    const numSet = new Set(...nums);
    const longest=0;
    for(let num of nums){
        if(!numSet.has(num-1)){
            let currentSubSequence = 1;
            let currentNum = num;
            while(numSet.has(currentNum+1)){
                currentNum++;
                currentSubSequence++;
            }
            longest=Math.max(longest,currentSubSequence)
        }
    }
    return longest;
};

console.log(longestConsecutive([100,4,200,1,3,2]));
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1]));
console.log(longestConsecutive([1,0,1,2]));
