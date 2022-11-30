import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ethers } from 'ethers'
import { Limited } from './Limited'
import { LiquidityProvider2 } from './liquidityProviders/LiquidityProvider2'
import { SushiProvider2 } from './liquidityProviders/Sushi2'
import { PoolCode } from './pools/PoolCode'

enum LiquidityProvider2s {
    Sushiswap = 'Sushiswap',
    UniswapV2 = 'UniswapV2',
    Trident = 'Trident',
    Quickswap = 'Quickswap'
}

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  chainDataProvider: ethers.providers.BaseProvider
  limited = new Limited(10, 1000)
  providers: LiquidityProvider2[] = []
  poolCodes: Map<string, PoolCode> = new Map()
  stateId = 0
  
  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    chainId: ChainId, 
  ) {
    this.chainId = chainId
    this.chainDataProvider = chainDataProvider
  }

  // Starts pool data fetching
  startDataFetching(
    liquidity?: LiquidityProvider2s[]    // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()
    this.providers = [
      new SushiProvider2(this.chainDataProvider, this.chainId, this.limited),
    ]
    this.providers.forEach(p => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach(p =>p.stopFetchPoolsData())
  }

  fetchPoolsForToken(t: Token) {
    this.providers.forEach(p =>p.fetchPoolsForToken(t))
  }

  getCurrentPoolList(): PoolCode[] {
    if (this.providers.some(p => p.poolListWereUpdated())) {
      let poolCodes: PoolCode[] = []
      this.providers.forEach(p => poolCodes = poolCodes.concat(p.getCurrentPoolList()))
      poolCodes.forEach(pc => this.poolCodes.set(pc.pool.address, pc))
      this.stateId += 1
    }
    return Array.from(this.poolCodes.values())
  }

  getCurrentPoolStateId() {
    return this.stateId
  }

}