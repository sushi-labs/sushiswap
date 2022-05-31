# Oracles

Currently there is two types of oracles which the sushi interface supports, Chainlink & SushiSwap TWAP.

## Chainlink

- Requires a mapping entry added (src/constants/chainlink/mapping.ts).
- Requires one exchange rate update to start.

## Adding Chainlink Oracles

Chainlink price feeds...

https://docs.chain.link/docs/ethereum-addresses/

https://docs.chain.link/docs/binance-smart-chain-addresses/

https://docs.chain.link/docs/matic-addresses/

https://docs.chain.link/docs/xdai-price-feeds/

https://docs.chain.link/docs/huobi-eco-chain-price-feeds/

https://docs.chain.link/docs/avalanche-price-feeds/

Each price feed has a pair token0/token1, SUSHI/ETH or SUSHI/USD for example, decimals, and proxy. We use this information to construct mappings of the price feed to their respectful pair tokens.

Chainlink tokens can be found in src/constants/chainlink/mappings, they are separated by network.

Any token which is not currently in the Chainlink tokens needs to be added, with the exception of USD, and non-crypto, these should not be added to the Chainlink tokens.

If a newly added token is not in the @sushiswap/default-token-list, it should be added.

Chainlink mappings can be found in src/constants/chainlink/mappings, they are separated by network.

Any price feed which is not currently in the Chainlink mappings need to be added.

Each mapping is keyed by the price feed proxy address, and contains and object with these properties

- from (token0 address)
- to (token1 address)
- decimals (price feed decimals)
- fromDecimals (token0 decimals)
- toDecimals (token1 decimals)

Tip: USD address is 0x0000000000000000000000000000000000000001 and decimals 8

<!-- ## SushiSwap TWAP

- Requires two exchange rate updates to start.
- On creation both current & oracle exchange rate will be set to zero.
- After first update both will still be zero, after the second both would be non-zero if a liquid pool is backing the oracle. -->
