import { findMultiRouteExactIn, MultiRoute, NetworkInfo } from "@sushiswap/tines";
import { BigNumber, ethers } from "ethers";
import { Network, Token } from "./networks/Network";
import { SushiProvider } from "./liquidityProviders/Sushi";
import { getRouteProcessorCode } from "./TinesToRouteProcessor";
import { UniswapProvider } from "./liquidityProviders/UniswapV2";
import { convertTokenToBento, getBentoChainId, TridentProvider } from "./liquidityProviders/Trident";
import { Limited } from "./Limited";
import { PoolCode } from "./pools/PoolCode";
import { QuickSwapProvider } from "./liquidityProviders/QuickSwap";

export class Swapper {
  routeProcessor: string
  chainDataProvider: ethers.providers.BaseProvider
  forkProvider: Provider
  network: Network
  poolsNumber: {[network: string]: number}
  limited: Limited
  pools: Map<string, PoolCode>

  constructor(
    routeProcessor: string, 
    chainDataProvider: ethers.providers.BaseProvider, 
    forkProvider: Provider, 
    net: Network
  ) {
    this.routeProcessor = routeProcessor
    this.chainDataProvider = chainDataProvider
    this.forkProvider = forkProvider
    this.network = net
    this.poolsNumber = {}
    this.limited = new Limited(12, 1000)    // Free Alchemy account allows 330/26 eth_calls per second
    this.pools = new Map()
  }

  async getRoute(tokenIn: Token, amountIn: BigNumber, tokenOut: Token): Promise<MultiRoute> {
    const providers = [
      new SushiProvider(this.chainDataProvider, this.network, this.limited),
      new UniswapProvider(this.chainDataProvider, this.network, this.limited),
      new QuickSwapProvider(this.chainDataProvider, this.network, this.limited),
      new TridentProvider(this.chainDataProvider, this.forkProvider, this.network, this.limited),
    ]
    const poolsPromises = providers.map(p => p.getPools(tokenIn, tokenOut))
    const poolsArrays = await Promise.all(poolsPromises)
    poolsArrays.forEach((a, i) => this.poolsNumber[providers[i].getPoolProviderName()] = a.length)
    const poolCodes = poolsArrays.reduce((prev, curr) => prev.concat(curr), [])
    poolCodes.forEach(pc => this.pools.set(pc.pool.address, pc))
    const pools = poolCodes.map(pc => pc.pool)

    const networks: NetworkInfo[] = [{
      chainId: this.network.chainId,
      baseToken:this.network.baseWrappedToken, 
      gasPrice: 50e9
    }, {
      chainId: getBentoChainId(this.network.chainId),
      baseToken: convertTokenToBento(this.network.baseWrappedToken), 
      gasPrice: 50e9
    }]

    const route = findMultiRouteExactIn(tokenIn, tokenOut, amountIn, pools, networks,  50e9)
    return route
  }

  getRouteProcessorCode(route: MultiRoute, to: string): string {
    const code = getRouteProcessorCode(route, this.routeProcessor, to, this.pools)
    return code
  }

  getPoolsProviderName(poolAddress: string): string {
    const pc = this.pools.get(poolAddress) as PoolCode
    return pc.poolName
  }

}