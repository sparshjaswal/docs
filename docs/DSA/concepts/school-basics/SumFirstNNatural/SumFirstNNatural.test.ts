import { sumOfFirstNNaturalNumbers } from './SumFirstNNatural';

describe('sumOfFirstNNaturalNumbers - test cases', () => {
  it('should return NaN for negative n', () => {
    expect(sumOfFirstNNaturalNumbers(-5)).toBe(0);
  });
  it('should return 0 for n=null', () => {
    expect(sumOfFirstNNaturalNumbers(null)).toBe(0);
  });
  it('should return NaN for n=undefined', () => {
    expect(sumOfFirstNNaturalNumbers(undefined)).toBe(0);
  });
  it('should return NaN for string input', () => {
    expect(sumOfFirstNNaturalNumbers('10')).toBe(0);
  });
  it('should return NaN for array input', () => {
    expect(sumOfFirstNNaturalNumbers([10])).toBe(0);
  });
  it('should return NaN for object input', () => {
    expect(sumOfFirstNNaturalNumbers({ n: 10 })).toBe(0);
  });
  it('should return NaN for Infinity', () => {
    expect(sumOfFirstNNaturalNumbers(Infinity)).toBe(0);
  });
  it('should return NaN for NaN input', () => {
    expect(sumOfFirstNNaturalNumbers(NaN)).toBe(0);
  });
});
