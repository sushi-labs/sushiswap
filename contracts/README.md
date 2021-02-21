# Uniswap V2 Area

Code from [Sushiswap](https://github.com/sushiswap/sushiswap/tree/ad788804755b2867dc67ba54d09f1e218e80a76f/contracts) with the following modifications.

1. Remove `migrator` member in `UniswapV2Factory`
2. Delete references to migrator in UniswapV2Pair.
3. Delete all UniswapV2Router functions referencing ETH/WETH.
4. Delete IWETH.

To see all diffs:

```
$ git diff 4c4bf551417e3df09a25aa0dbb6941cccbbac11a .
```
