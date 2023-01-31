import type { ChainId } from '@sushiswap/chain'
import { Native, Token, Type, WNATIVE } from '@sushiswap/currency'
import { configureChains, createClient } from '@wagmi/core'

import type { PoolCode } from '../pools/PoolCode'
import { allChains } from './chains'
import { ApeSwapProvider } from './liquidity-providers/ApeSwap'
import { DfynProvider } from './liquidity-providers/Dfyn'
import { ElkProvider } from './liquidity-providers/Elk'
import { JetSwapProvider } from './liquidity-providers/JetSwap'
import { LiquidityProvider, LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider'
import { QuickSwapProvider } from './liquidity-providers/QuickSwap'
import { SushiProvider } from './liquidity-providers/Sushi'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2'
import { allProviders } from './providers'

const { provider } = configureChains(allChains, allProviders, { pollingInterval: 10000 })

createClient({
  autoConnect: true,
  provider,
})

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  providers: LiquidityProvider[] = []
  lastProviderStates: Map<LiquidityProviders, number> = new Map()
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0

  constructor(chainId: ChainId) {
    this.chainId = chainId
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    if (lp == LiquidityProviders.NativeWrap) return true
    return liquidity.some((l) => l == lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [new NativeWrapProvider(this.chainId)]

    if (this._providerIsIncluded(LiquidityProviders.SushiSwap, providers)) {
      if (SushiProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new SushiProvider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.UniswapV2, providers)) {
      if (UniswapV2Provider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new UniswapV2Provider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.QuickSwap, providers)) {
      if (QuickSwapProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new QuickSwapProvider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.ApeSwap, providers)) {
      if (ApeSwapProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new ApeSwapProvider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.Dfyn, providers)) {
      if (DfynProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new DfynProvider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.Elk, providers)) {
      if (ElkProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new ElkProvider(this.chainId))
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.JetSwap, providers)) {
      if (JetSwapProvider.isDeployedOnChain(this.chainId)) {
        this.providers.push(new JetSwapProvider(this.chainId))
      }
    }

    this.providers.forEach((p) => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach((p) => p.stopFetchPoolsData())
  }

  fetchPoolsForToken(t0: Type, t1: Type) {
    if (t0 instanceof Native) t0 = WNATIVE[t0.chainId]
    if (t1 instanceof Native) t1 = WNATIVE[t1.chainId]
    this.providers.forEach((p) => p.fetchPoolsForToken(t0 as Token, t1 as Token))
  }

  getCurrentPoolCodeMap(providers?: LiquidityProviders[]): Map<string, PoolCode> {
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      if (!this._providerIsIncluded(p.getType(), providers)) return
      if (p.getCurrentPoolStateId() !== this.lastProviderStates.get(p.getType())) {
        this.lastProviderStates.set(p.getType(), p.getCurrentPoolStateId())
        const poolCodes = p.getCurrentPoolList()
        let pcMap = this.poolCodes.get(p.getType())
        if (pcMap === undefined) {
          pcMap = new Map()
          this.poolCodes.set(p.getType(), pcMap)
        }
        poolCodes.forEach((pc) => (pcMap as Map<string, PoolCode>).set(pc.pool.address, pc))
      }
      const pcMap = this.poolCodes.get(p.getType())
      if (pcMap) Array.from(pcMap.entries()).forEach(([addr, pc]) => result.set(addr, pc))
    })

    return result
  }

  getCurrentPoolCodeList(providers?: LiquidityProviders[]): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(providers)
    return Array.from(pcMap.values())
  }

  getCurrentPoolStateId(providers?: LiquidityProviders[]) {
    let state = 0
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers)) state += p.getCurrentPoolStateId()
    })
    return state
  }

  // returns the last processed by all LP block number
  getLastUpdateBlock(providers?: LiquidityProviders[]): number {
    let lastUpdateBlock: number | undefined
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers)) {
        const last = p.getLastUpdateBlock()
        if (last < 0) return
        if (lastUpdateBlock === undefined) lastUpdateBlock = last
        else lastUpdateBlock = Math.min(lastUpdateBlock, last)
      }
    })
    return lastUpdateBlock === undefined ? 0 : lastUpdateBlock
  }
}
