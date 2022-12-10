import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ethers } from 'ethers'

import { Limited } from './Limited'
import { LiquidityProviderMC, LiquidityProviders } from './liquidityProviders/LiquidityProviderMC'
import { QuickSwapProviderMC } from './liquidityProviders/QuickSwapMC'
import { SushiProviderMC } from './liquidityProviders/SushiMC'
import { UniSwapV2ProviderMC } from './liquidityProviders/UniswapV2MC'
import { MultiCallProvider } from './MulticallProvider'
import { PoolCode } from './pools/PoolCode'

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  chainDataProvider: ethers.providers.BaseProvider
  multiCallProvider: MultiCallProvider
  limited = new Limited(10, 1000)
  providers: LiquidityProviderMC[] = []
  lastProviderStates: Map<LiquidityProviders, number> = new Map()
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0

  constructor(chainDataProvider: ethers.providers.BaseProvider, chainId: ChainId) {
    this.chainId = chainId
    this.chainDataProvider = chainDataProvider
    this.multiCallProvider = new MultiCallProvider(chainDataProvider)
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    return liquidity.some((l) => l == lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = []
    if (this._providerIsIncluded(LiquidityProviders.Sushiswap, providers))
      this.providers.push(
        new SushiProviderMC(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited)
      )
    if (this._providerIsIncluded(LiquidityProviders.UniswapV2, providers))
      this.providers.push(
        new UniSwapV2ProviderMC(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited)
      )
    if (this._providerIsIncluded(LiquidityProviders.Quickswap, providers))
      this.providers.push(
        new QuickSwapProviderMC(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited)
      )

    this.providers.forEach((p) => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach((p) => p.stopFetchPoolsData())
  }

  fetchPoolsForToken(t0: Token, t1: Token) {
    this.providers.forEach((p) => p.fetchPoolsForToken(t0, t1))
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

  getCurrentPoolStateId() {
    const currentStateId = this.providers.reduce((a, b) => (a += b.getCurrentPoolStateId()), 0)
    this.stateId = currentStateId
    return this.stateId
  }
}
