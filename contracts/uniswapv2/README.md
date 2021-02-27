# Uniswap V2 Area

Code from [Sushiswap](https://github.com/sushiswap/sushiswap/tree/017ac93b1f6e970516652629a4d1bc47a8c584d7/contracts) with the following modifications.

1. Remove `migrator` member in `UniswapV2Factory`
2. Delete references to migrator in UniswapV2Pair.
3. Delete all UniswapV2Router functions referencing ETH/WETH.
4. Delete IWETH.

To see all diffs:

```
git diff 017ac93b1f6e970516652629a4d1bc47a8c584d7 .
```

Diff: https://gist.github.com/macalinao/2ca9a77e221643061465df04a1872507
