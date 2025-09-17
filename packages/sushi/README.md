# Sushi

Sushi library


## RainDataFetcher (sushi indexer router) Usage Example
This is a simple example for using `RainDataFetcher`, read the docs of methods of `RainDataFetcher` for more details:

```ts
import { ChainId } from "sushi/chain";
import { Token } from "sushi/currency";
import { publicClientConfig } from "sushi/config";
import { createPublicClient, http, parseUnits } from "viem";
import { LiquidityProviders, RainDataFetcher } from "sushi";

// create viem client
const chain = publicClientConfig[ChainId.ARBITRUM].chain;
const client = createPublicClient({
    chain,
    transport: http("https://rpc.com"),
});

// specify a list liquidity providers
const specifiedLiquidityProviders = [LiquidityProviders.UniswapV2, LiquidityProviders.SushiSwapV3];
const router = await RainDataFetcher.init(
    ChainId.ARBITRUM,
    client,
    specifiedLiquidityProviders, // do not pass this param to have all available liquidity providers for the operating chain
);

// sync the pools data every 10 secs in the background, this is very cheap using a few eth_getLogs calls but keeps all data synced
setInterval(async () => {
    const untilBlockNumber = 123n; // optional, set to undefined to update pools data to latest block
    await router.updatePools(untilBlockNumber);
}, 10_000);

// build tokens
const fromToken = new Token({
    chainId: ChainId.ARBITRUM,
    decimals: 18,
    address: "0x123...",
    symbol: "SYM"
});
const toToken = new Token({
    chainId: ChainId.ARBITRUM,
    decimals: 6,
    address: "0x123...",
    symbol: "SYM"
});

// 1.2 as amountIn
// also can set to 1 for a unit market result
const amountIn = parseUnits("1.2", fromToken.decimals);

// get the best route
const gasPrice = await client.getGasPrice();
const { pcMap, route } = await router.findBestRoute(
    ChainId.ARBITRUM,
    fromToken,
    toToken,
    amountIn,
    Number(gasPrice),
);

if (route.status == "NoWay") {
    throw new Error("did not find any route");
} else {
    return route.amountOutBI; // the received amount of toToken for the given amountIn of fromToken
}
```
