// Find the smallest and second smallest elements in an array

// Given an array arr[] of integers, find the smallest and second smallest distinct elements in the array. The result should be returned in ascending order, meaning the smallest element should come first, followed by the second smallest. If there is no valid second smallest (i.e., all elements are the same or the array has fewer than two elements), then return -1.

// Input: arr[] = [12, 25, 8, 55, 10, 33, 17, 11]
// Output: [8, 10]
// Explanation: The smallest element is 1 and second smallest element is 10.

// Input: arr[] = [2, 4, 3, 5, 6]
// Output: [2, 3]
// Explanation: 2 and 3 are respectively the smallest and second smallest elements in the array.

// Input: arr[] = [1, 1, 1]
// Output: [-1]
// Explanation: Only element is 1 which is smallest, so there is no second smallest element.

const smallest2number = (arr) => {
    if (arr.length < 2) return [-1];
    let first = Infinity;
    let second = Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < first) {
            second = first;
            first = arr[i];
        } else if (arr[i] < second && arr[i] !== first) {
            second = arr[i];
        }
    }
    if (second === Infinity) return [-1];
    return [first, second];
}

console.log(smallest2number([12, 25, 8, 55, 10, 33, 17, 11]))
console.log(smallest2number([2, 4, 3, 5, 6]))
console.log(smallest2number([1, 1, 1]))

export { smallest2number }