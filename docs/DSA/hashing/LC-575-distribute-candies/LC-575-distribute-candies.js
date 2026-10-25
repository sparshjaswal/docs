// Contract, worked example, and edge cases are documented in index.mdx.
const distributeCandies = (candyType) => {
  const totalCandyCanEat = candyType.length / 2;
  const totalCandyType = new Set([...candyType]).size;
  return Math.min(totalCandyCanEat, totalCandyType);
};

export { distributeCandies };
