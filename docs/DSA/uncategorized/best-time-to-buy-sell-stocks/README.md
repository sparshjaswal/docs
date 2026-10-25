---
id: dsa-uncategorized-best-time-to-buy-sell-stocks-readme
title: "Best Time to Buy and Sell Stock"
slug: /DSA/uncategorized/best-time-to-buy-sell-stocks/README
sidebar_label: "Best Time to Buy and Sell S..."
---

# Best Time to Buy and Sell Stock

**Read first:** [Greedy](../../greedy/README.md).

**Practice focus:** Compare buying and selling on each rise with a full search under the unlimited-transactions rules.

## Task Description

This is an array exercise with all daily prices known in advance. A transaction buys one share and later sells it. Find the largest total profit when any number of transactions is allowed, but you may hold at most one share at a time. The model has no fee, cooldown, or transaction limit; adding any of those changes the problem.

> Note: You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy again).

**Example #1**

```
Input: [7, 1, 5, 3, 6, 4]
Output: 7
```

_Explanation:_ Buy on day `2` (`price = 1`) and sell on day `3` (`price = 5`), `profit = 5-1 = 4`. Then buy on day `4` (`price = 3`) and sell on day `5` (`price = 6`), `profit = 6-3 = 3`.

**Example #2**

```
Input: [1, 2, 3, 4, 5]
Output: 4
```

_Explanation:_ Buy on day `1` (`price = 1`) and sell on day `5` (`price = 5`), `profit = 5-1 = 4`. Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.

**Example #3**

```
Input: [7, 6, 4, 3, 1]
Output: 0
```

_Explanation:_ In this case, no transaction is done, i.e. max `profit = 0`.

## Possible Solutions

### Divide and conquer approach `O(2^n)`

At each day, compare two choices: do nothing, or perform the allowed action. The state needs **both the day and whether the next action is buying or selling**. A day alone does not describe the remaining choices.

When buying is allowed, buying subtracts today’s price and changes the next action to selling. Selling adds today’s price and changes it back to buying. Skipping the day preserves the current action. Return the larger future total. The linked implementation explores both choices recursively rather than saving repeated states.

> See the full code example in [dqBestTimeToBuySellStocks.js](dqBestTimeToBuySellStocks.js)

#### Time Complexity

Each nonterminal call branches into two choices across n days, giving O(2ⁿ) time. Many branches revisit the same day and holding state.

#### Additional Space Complexity

The implementation passes a day index instead of copying the remaining array. Its active recursive calls use O(n) extra space.

## Peak Valley Approach `O(n)`

If we plot the prices array (i.e. `[7, 1, 5, 3, 6, 4]`) we may notice that the points of interest are the consecutive valleys and peaks

![For unlimited transactions, each rising price section can contribute a buy-low, sell-high profit.](https://leetcode.com/media/original_images/122_maxprofit_1.PNG)

_Image source: [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solution/)_

Buy at the start of a rising stretch and sell at its end. Under this exercise’s rules, taking each rise does not prevent taking a later rise. A falling stretch contributes nothing.

> See the full code example in [peakvalleyBestTimeToBuySellStocks.js](peakvalleyBestTimeToBuySellStocks.js)

#### Time Complexity

Since the algorithm requires only one pass through the prices array, the time complexity would equal `O(n)`.

#### Additional Space Complexity

Except of the prices array itself the algorithm consumes the constant amount of memory. Thus, additional space complexity is `O(1)`.

## Accumulator Approach `O(n)`

The same profit can be counted without explicitly locating each peak and valley. Consider `[1, 7, 2, 3, 6, 7, 6, 7]`:

![Adding each positive day-to-day price difference gives the total profit for the unlimited-transactions version.](https://leetcode.com/media/original_images/122_maxprofit_2.PNG)

_Image source: [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solution/)_

Add each positive difference between neighboring days. Across one rise, these differences cancel internally: `(b − a) + (c − b) = c − a`. They equal the profit from buying at the valley and selling at the peak. Skip negative differences. This proof depends on unlimited transactions with no fee or cooldown.

> See the full code example in [accumulatorBestTimeToBuySellStocks.js](accumulatorBestTimeToBuySellStocks.js)

#### Time Complexity

Since the algorithm requires only one pass through the prices array, the time complexity would equal `O(n)`.

#### Additional Space Complexity

Except of the prices array itself the algorithm consumes the constant amount of memory. Thus, additional space complexity is `O(1)`.

## References

- [Best Time to Buy and Sell Stock on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

**Next:** [Dynamic Programming](../../dp/README.md).
