import { reverseNumber } from './ReverseNumber';

describe('sumOfFirstNNaturalNumbers - test cases', () => {
  it('should return 221 for negative 122', () => {
    expect(reverseNumber(122)).toBe(221);
  });
  it('should return 2 for 200', () => {
    expect(reverseNumber(200)).toBe(2);
  });
  it('should return 54321 for negative 12345', () => {
    expect(reverseNumber(12345)).toBe(54321);
  });
});
