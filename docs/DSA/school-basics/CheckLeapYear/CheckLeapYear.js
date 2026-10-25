// Gregorian calendar rule: century years must be divisible by 400.
export const isLeapYear = (year) =>
  Number.isSafeInteger(year) &&
  year > 0 &&
  (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0));
