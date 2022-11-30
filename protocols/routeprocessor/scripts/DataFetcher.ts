import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { findMultiRouteExactIn, MultiRoute, NetworkInfo, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { Limited } from './Limited'
import { LiquidityProvider2 } from './liquidityProviders/LiquidityProvider2'
import { SushiProvider2 } from './liquidityProviders/Sushi2'
import { convertTokenToBento, getBentoChainId, TridentProvider } from './liquidityProviders/Trident'
import { PoolCode } from './pools/PoolCode'
import { getRouteProcessorCode } from './TinesToRouteProcessor'

enum LiquidityProvider2s {
    Sushiswap = 'Sushiswap',
    UniswapV2 = 'UniswapV2',
    Trident = 'Trident',
    Quickswap = 'Quickswap'
}

type RouteCallBack = (r: MultiRoute) => void

interface RoutingState {
  tokenFrom: RToken
  amountIn: number | BigNumber
  tokenTo: RToken
  gasPrice: number
  timer: any  // timer from setTimeout
}

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  //minUpdateDelay: number
  chainDataProvider: ethers.providers.BaseProvider
  limited: Limited
  //routeCallBacks: RouteCallBack[]
  providers: LiquidityProvider2[]
  poolCodes: Map<string, PoolCode>
  
  //currentBestRoute?: MultiRoute
  //routingState?: RoutingState

  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    chainId: ChainId, 
    //minUpdateDelay = 1000   // Minimal delay between routing update
  ) {
    this.chainId = chainId
    //this.minUpdateDelay = minUpdateDelay
    this.chainDataProvider = chainDataProvider
    this.limited = new Limited(10, 1000)
    //this.routeCallBacks = []
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
      // new TridentProvider(this.chainDataProvider, this.chainId, this.limited),
      // new UniswapProvider(this.chainDataProvider, this.chainId, this.limited),
      // new QuickSwapProvider(this.chainDataProvider, this.chainId, this.limited),
    ]
    this.providers.forEach(p => p.startFetchPoolsData())
    // this.routingState = {
    //   tokenFrom: tokenFrom as RToken,
    //   amountIn,
    //   tokenTo: tokenTo as RToken,
    //   gasPrice,
    //   timer: setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
    // }
  }

  // To stop gather pool data and routing calculation
  stopDataFetching() {
    this.providers.forEach(p =>p.stopFetchPoolsData())
  }

}