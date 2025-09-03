# Sushi

Sushi library


## RainDataFetcher (sushi indexer router) Usage Example
This is a simple example for using `RainDataFetcher`, read the docs of methods of `RainDataFetcher` for more details:

```ts
import { ChainId } from "sushi/chain";
import { createPublicClient, http } from "viem";
import { publicClientConfig } from "sushi/config";
import { LiquidityProviders, RainDataFetcher } from "sushi";

// create viem client
const chain = publicClientConfig[ChainId.ARBITRUM].chain;
const client = createPublicClient({
    chain,
    transport: http("https://rpc.com"),
});

// desired liquidity providers, set to undefined to have all available liquidity providers for the operating network
const lps = [LiquidityProviders.UniswapV2, LiquidityProviders.SushiSwapV3];
const router = await RainDataFetcher.init(
    ChainId.ARBITRUM,
    client,
    lps,
);

// sync the pools data every 30 secs in the background
setInterval(async () => {
    const untilBlockNumber = 123n; // optional, set to undefined to update pools data to latest block
    await router.updatePools(untilBlockNumber);
}, 30_000);


// get the best route
const gasPrice = await client.getGasPrice();
const { pcMap, route } = await router.findBestRoute(
    ChainId.ARBITRUM,
    fromToken,
    toToken,
    amountIn, // set to 1 unit of fromToken for a unit market result
    Number(gasPrice),
);

if (route.status == "NoWay") {
    throw new Error("did not find any route");
} else {
    return route.amountOutBI; // the received amount of toToken for the given amountIn of fromToken
}
```