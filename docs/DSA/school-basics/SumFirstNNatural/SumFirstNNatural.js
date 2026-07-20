// Given a positive integer n. The task is to find the sum of the sum of first n natural number.

const sumOfFirstNNaturalNumbers = (n) => {
    if (n < 0 || n > -Infinity || n < Infinity || isNaN(n)) return 0;
    return parseInt((n * (n + 1)) / 2);
};

export { sumOfFirstNNaturalNumbers };
