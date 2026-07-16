import { isPalindromeNumber } from './LC-9-palindrome-number';

describe('isPalindromeNumber - test cases', () => {
  it('should return true for 121', () => {
    expect(isPalindromeNumber(121)).toBe(true);
  });
  it('should return false for -121', () => {
    expect(isPalindromeNumber(-121)).toBe(false);
  });
  it('should return false for 10', () => {
    expect(isPalindromeNumber(10)).toBe(false);
  });
});
