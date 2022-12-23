import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE } from '@sushiswap/currency'
import { findMultiRouteExactIn, MultiRoute, NetworkInfo, RToken } from '@sushiswap/tines'
import { BigNumber, ethers } from 'ethers'

import { Limited } from './Limited'
import { QuickSwapProvider } from './liquidityProviders/QuickSwap'
import { SushiProvider } from './liquidityProviders/Sushi'
import { convertTokenToBento, getBentoChainId, TridentProvider } from './liquidityProviders/Trident'
import { UniswapProvider } from './liquidityProviders/UniswapV2'
import { PoolCode } from './pools/PoolCode'
import { getRouteProcessorCode } from './TinesToRouteProcessor'

export class Swapper {
  routeProcessor: string
  chainDataProvider: ethers.providers.BaseProvider
  chainId: ChainId
  poolsNumber: { [network: string]: number }
  limited: Limited
  pools: Map<string, PoolCode>

  constructor(routeProcessor: string, chainDataProvider: ethers.providers.BaseProvider, chainId: ChainId) {
    this.routeProcessor = routeProcessor
    this.chainDataProvider = chainDataProvider
    this.chainId = chainId
    this.poolsNumber = {}
    this.limited = new Limited(12, 1000) // Free Alchemy account allows 330/26 eth_calls per second
    this.pools = new Map()
  }

  async getRoute(tokenIn: Token, amountIn: BigNumber, tokenOut: Token): Promise<MultiRoute> {
    const providers = [
      new SushiProvider(this.chainDataProvider, this.chainId, this.limited),
      new UniswapProvider(this.chainDataProvider, this.chainId, this.limited),
      new QuickSwapProvider(this.chainDataProvider, this.chainId, this.limited),
      new TridentProvider(this.chainDataProvider, this.chainId, this.limited),
    ]
    const poolsPromises = providers.map((p) => p.getPools(tokenIn, tokenOut))
    const poolsArrays = await Promise.all(poolsPromises)
    poolsArrays.forEach((a, i) => (this.poolsNumber[providers[i].getPoolProviderName()] = a.length))
    const poolCodes = poolsArrays.reduce((prev, curr) => prev.concat(curr), [])
    poolCodes.forEach((pc) => this.pools.set(pc.pool.address, pc))
    const pools = poolCodes.map((pc) => pc.pool)

    const networks: NetworkInfo[] = [
      {
        chainId: this.chainId,
        baseToken: WNATIVE[this.chainId] as RToken,
        gasPrice: 50e9,
      },
      {
        chainId: getBentoChainId(this.chainId),
        baseToken: convertTokenToBento(WNATIVE[this.chainId]),
        gasPrice: 50e9,
      },
    ]

    const route = findMultiRouteExactIn(tokenIn as RToken, tokenOut as RToken, amountIn, pools, networks, 50e9)
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
