import { ChainId } from '@sushiswap/chain'
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
  limited: Limited
  providers: LiquidityProvider2[]
  poolCodes: Map<string, PoolCode>
  
  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    chainId: ChainId, 
  ) {
    this.chainId = chainId
    this.chainDataProvider = chainDataProvider
    this.limited = new Limited(10, 1000)
    this.providers = []
    this.poolCodes = new Map()
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

}