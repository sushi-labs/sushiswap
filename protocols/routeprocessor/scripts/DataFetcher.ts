import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ethers } from 'ethers'
import { Limited } from './Limited'
import { LiquidityProvider2, LiquidityProviders } from './liquidityProviders/LiquidityProvider2'
import { SushiProvider2 } from './liquidityProviders/Sushi2'
import { PoolCode } from './pools/PoolCode'


// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  chainDataProvider: ethers.providers.BaseProvider
  limited = new Limited(10, 1000)
  providers: LiquidityProvider2[] = []
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0
  
  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    chainId: ChainId, 
  ) {
    this.chainId = chainId
    this.chainDataProvider = chainDataProvider
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    return liquidity.some(l => l == lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[]    // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = []
    if (this._providerIsIncluded(LiquidityProviders.Sushiswap, providers))
      this.providers.push(new SushiProvider2(this.chainDataProvider, this.chainId, this.limited))

    this.providers.forEach(p => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach(p =>p.stopFetchPoolsData())
  }

  fetchPoolsForToken(t0: Token, t1: Token) {
    this.providers.forEach(p =>p.fetchPoolsForToken(t0, t1))
  }

  getCurrentPoolCodeMap(providers?: LiquidityProviders[]): Map<string, PoolCode> {
    const result:Map<string, PoolCode> = new Map()
    this.providers.forEach(p => {
      if (!this._providerIsIncluded(p.getType(), providers)) return
      if (p.poolListWereUpdated()) {
        const poolCodes = p.getCurrentPoolList()
        let pcMap = this.poolCodes.get(p.getType())
        if (pcMap === undefined) {
          pcMap = new Map()
          this.poolCodes.set(p.getType(), pcMap)
        }
        poolCodes.forEach(pc => (pcMap as Map<string, PoolCode>).set(pc.pool.address, pc))
      }
      const pcMap = this.poolCodes.get(p.getType())
      if (pcMap)
        Array.from(pcMap.entries()).forEach(([addr, pc]) => result.set(addr, pc))
    })

    return result
  }

  getCurrentPoolCodeList(providers?: LiquidityProviders[]): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(providers)
    return Array.from(pcMap.values())
  }

  getCurrentPoolStateId() {
    if (this.providers.some(p => p.poolListWereUpdated())) 
      this.stateId += 1
    return this.stateId
  }

}