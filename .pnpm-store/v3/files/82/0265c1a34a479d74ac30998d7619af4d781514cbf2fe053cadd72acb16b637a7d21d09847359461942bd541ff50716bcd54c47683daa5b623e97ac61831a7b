# sushi-data

This is a collection of utilities to query SushiSwap data from Ethereum. This
data has been indexed by the Graph via the subgraph the SushiSwap team maintains.

## Supported Queries

The below all return a Promise that resolves with the requested results.

1. `sushi.priceUSD({¹})` Gets USD price of Sushi.
2. `sushi.priceETH({¹})` Gets ETH price of Sushi.
3. `blocks.latestBlock()` Gets the latest block.
4. `blocks.getBlock({¹})` Gets data for the specified block.
5. `charts.factory()` Gets data for the SushiSwap factory broken down daily + weekly.
6. `charts.tokenHourly({token_address, startTime?})` Gets data for specified token broken down hourly.
7. `charts.tokenDaily({token_address})` Gets data for specified token broken down daily.
8. `charts.pairHourly({pair_address, startTime?})` Gets data for specified pair broken down hourly.
9. `charts.pairDaily({pair_address})` Gets data for specified pair broken down daily.
10. `exchange.token({¹, token_address})` Gets data for specified token.
11. `exchange.token24h({¹, token_address})` Gets 24h data for specified token.
12. `exchange.tokenHourData({², token_address})` Gets hourly data for specified token.
13. `exchange.tokenDayData({², token_address})` Gets daily data for specified token.
14. `exchange.tokens({¹})` Gets data for all tokens.
15. `exchange.tokens24h({¹})` Gets 24h data for all tokens.
16. `exchange.pair({¹, pair_address})` Gets data for specified pair.
17. `exchange.pair24h({¹, pair_address})` Gets 24h data for specified pair.
18. `exchange.pairHourData({², pair_address})` Gets hourly data for specified pair.
19. `exchange.pairDayData({{², pair_address})` Gets daily data for specified pair.
20. `exchange.pairs({¹, [pair_addresses]?})` Gets data for all / specified pairs.
21. `exchange.pairs24h({¹})` Gets 24h data for all pairs.
22. `exchange.ethPrice({¹})` Gets USD price of ETH.
23. `exchange.ethPriceHourly({²})` Gets USD price of ETH broken down hourly.
24. `exchange.factory({¹})` Gets all data for the SushiSwap factory.
25. `exchange.dayData({²})` Gets data for the SushiSwap factory broken down by day.
26. `exchange.twentyFourHourData({¹})` Gets 24h data for the SushiSwap factory.
27. `exchange_v1.userHistory({², user_address})` Gets LP history for specified user.
28. `exchange_v1.userPositions({¹, user_address})` Gets LP positions for specified user.
29. `masterchef.info({¹})` Gets MasterChef contract info.
30. `masterchef.pool({¹, pool_id, pool_address})` Gets pool info, either by pool id or by pool address.
31. `masterchef.pools({¹})` Gets pool info for all pools in MasterChef.
32. `masterchef.user({¹, user_address})` Gets user's data for all of the user's pools.
33. `masterchef.users({¹})` Gets all users and data for all of the users' pools.
34. `masterchef.apys({¹})` Gets pool info for all pools in MasterChef including APYs.
35. `masterchef.apys24h({¹})` Gets 24h pool info for all pools in MasterChef including APYs.
36. `exchange.stakedValue({¹, token_address})` Get pricing info for MasterChef pool.
37. `bar.info({¹})` Gets SushiBar contract info.
38. `bar.user({¹, user_address})` Gets SushiBar data for specified user.
39. `maker.info({¹})` Gets SushiMaker contract info.
40. `maker.servings({²})` Gets past servings to the bar.
41. `maker.servers({¹})` Gets servers that have served Sushi to the bar.
42. `maker.pendingServings({¹})` Gets data on the servings ready to be served to the bar.
43. `timelock.queuedTxs({²})` Gets queued Timelock transactions.
44. `timelock.canceledTxs({²})` Gets canceled Timelock transactions.
45. `timelock.executedTxs({²})` Gets executed Timelock transactions.
46. `timelock.allTxs({²})` Gets all Timelock transactions.
47. `lockup.user({¹, user_address})` Gets lockup data for specified user.
48. `bentobox.clones({masterAddress, chainId})` Gets Clone contracts for specified master contract.

¹ `{block, timestamp}` Supports fetching at a specific block / UNIX timestamp.    
² `{minBlock, maxBlock, minTimestamp, maxTimestamp}` Supports fetching in a specific timeframe.

## Supported Subscriptions
The below all return an Observable that when subscribed to with an object.

1. `sushi.observePriceETH()` Gets an observable of the current ETH price of Sushi.
2. `blocks.observeLatestBlock()` Gets an observable of the latest block.
3. `exchange.observeToken({token_address})` Gets an observable for specified token.
4. `exchange.observeTokens()` Gets an observable for the top 1000 tokens (by volume in USD).
5. `exchange.observePair({pair_address})` Gets an observable for specified pair.
6. `exchange.observePairs()` Gets an observable for the top 1000 pairs (by liquidity in USD).
7. `exchange.observeEthPrice()` Gets an observable for the current USD price of ETH.
8. `exchange.observeFactory()` Gets an observable for the SushiSwap factory.
9. `bar.observeInfo()` Gets an observable for SushiBar contract info.
10. `maker.observePendingServings()` Gets an observable for pending servings.

## Timeseries

`sushiData.timeseries({blocks = [], timestamps = [], target = targetFunction}, {targetArguments})` Returns an array of queries. Blocks / timestamps are arrays of the blocks / timestamps to query (choose one). The target is the target function, the target arguments are the arguments for the target. See example below

## Example

```javascript
const sushiData = require('@sushiswap/sushi-data'); // common js
// or
import sushiData from '@sushiswap/sushi-data'; // es modules

// query and log resolved results
sushiData.masterchef
  .pools({block: 11223344})
  .then(pools => console.log(pools))

sushiData.timelock
  .allTxs({minTimestamp: 1605239738, maxTimestamp: 1608239738})
  .then(txs => console.log(txs))

sushiData.bar
  .user({user_address: '0x6684977bbed67e101bb80fc07fccfba655c0a64f'})
  .then(user => console.log(user))

sushiData.exchange
  .observePairs()
  .subscribe({next: (pairs) => console.log(pairs), error: (err) => console.log(err)})

sushiData
  .timeseries({blocks: [11407623, 11507623, 11607623], target: sushiData.exchange.pair}, {pair_address: "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0"})
```
