// 283. Move Zeroes
// Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.
// Note that you must do this in-place without making a copy of the array.

// Example 1:
// Input: nums = [0,1,0,3,12]
// Output: [1,3,12,0,0]

// Example 2:
// Input: nums = [0]
// Output: [0]

// Example 3:
// Input: nums = [1,0]
// Output: [1,0]

// Constraints:
// 1 <= nums.length <= 104
// -231 <= nums[i] <= 231 - 1

var moveZeroes = (nums) => {
    let zeros=0;
    for(let i=0;i<nums.length;i++){
        if(nums[i]!==0){
            if(zeros!==i)
                nums[zeros]=nums[i];
                zeros++;
        }
    }
    while(zeros<nums.length)nums[zeros++]=0;
    return nums;
};
console.log(moveZeroes([0, 1, 0, 3, 12]));
console.log(moveZeroes([0]));
console.log(moveZeroes([1,0]));
console.log(moveZeroes([4,2,4,0,0,3,0,5,1,0]));