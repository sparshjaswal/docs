// Contract, worked example, and edge cases are documented in index.mdx.
const BestTimeToBuyAndSellStock = (prices) => {
  let BP = prices[0];
  let MAX_PROFIT = 0;
  for (let i = 0; i < prices.length; i++) {
    let PROFIT = prices[i] - BP;
    MAX_PROFIT = Math.max(PROFIT, MAX_PROFIT);
    BP = Math.min(prices[i], BP);
  }
  return MAX_PROFIT;
};

export { BestTimeToBuyAndSellStock };
