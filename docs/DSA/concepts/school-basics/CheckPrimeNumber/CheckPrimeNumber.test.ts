import { PrimeNumber } from './CheckPrimeNumber';

describe('PrimeNumber - test cases', () => {
  it('should return 0 is NOT prime', () => {
    expect(PrimeNumber(0)).toBe('0 is NOT prime');
  });
  it('should return 9', () => {
    expect(PrimeNumber(9)).toBe('9 is NOT prime');
  });
});
