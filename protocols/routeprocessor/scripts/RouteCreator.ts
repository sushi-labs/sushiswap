import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { findMultiRouteExactIn, MultiRoute, NetworkInfo, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { Limited } from './Limited'
import { LiquidityProvider } from './liquidityProviders/LiquidityProvider'
import { SushiProvider } from './liquidityProviders/Sushi'
import { convertTokenToBento, getBentoChainId } from './liquidityProviders/Trident'
import { PoolCode } from './pools/PoolCode'

enum LiquidityProviders {
    Sushiswap = 'Sushiswap',
    UniswapV2 = 'UniswapV2',
    Trident = 'Trident',
    Quickswap = 'Quickswap'
}

type RouteProcessor = (r: MultiRoute) => void

interface RoutingState {
  tokenFrom: RToken
  amountIn: number | BigNumber
  tokenTo: RToken
  gasPrice: number
  timer: any  // timer from setTimeout
}

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class RouteCreator {
  chainId: ChainId
  minUpdateDelay: number
  chainDataProvider: ethers.providers.BaseProvider
  limited: Limited
  routeProcessors: RouteProcessor[]
  providers: LiquidityProvider[]
  
  currentBestRoute?: MultiRoute
  routingState?: RoutingState

  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    chainId: ChainId, 
    minUpdateDelay = 1000   // Minimal delay between routing update
  ) {
    this.chainId = chainId
    this.minUpdateDelay = minUpdateDelay
    this.chainDataProvider = chainDataProvider
    this.limited = new Limited(10, 1000)
    this.routeProcessors = []
    this.providers = []
  }

  // Starts pool data fetching and routing calculation
  // Async routing protocol
  startRouting(
    tokenFrom: Token, 
    amountIn: number | BigNumber, 
    tokenTo: Token,
    gasPrice: number,
    liquidity?: LiquidityProviders[]    // all providers if undefined
  ) {
    this.stopRouting()
    this.currentBestRoute = undefined
    this.providers = [
      new SushiProvider(this.chainDataProvider, this.chainId, this.limited),
    ]
    this.providers.forEach(p => p.startGetherData(tokenFrom, tokenTo))
    this.routingState = {
      tokenFrom: tokenFrom as RToken,
      amountIn,
      tokenTo: tokenTo as RToken,
      gasPrice,
      timer: setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
    }
  }

  // Callback registration.
  // callbacks are called each time route changes
  onRouteUpdate(p: RouteProcessor) {
    this.routeProcessors.push(p)
    if (this.currentBestRoute) p(this.currentBestRoute)
  }

  // To stop gather pool data and routing calculation
  stopRouting() {
    if (this.routingState?.timer !== undefined) clearTimeout(this.routingState?.timer)
    this.providers.forEach(p =>p.stopGetherData())
    this.routingState = undefined
    this.routeProcessors = []
  }

  _checkRouteUpdate() {
    const state = this.routingState
    if (!state) return

    state.timer = setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
    if (this.providers.some(p => p.poolListWereUpdated())) {
      let poolCodes: PoolCode[] = []
      this.providers.forEach(p => poolCodes = poolCodes.concat(p.getCurrentPoolList()))
      
      const networks: NetworkInfo[] = [{
        chainId: this.chainId,
        baseToken: WNATIVE[this.chainId] as RToken, 
        gasPrice: state.gasPrice as number
      }, {
        chainId: getBentoChainId(this.chainId),
        baseToken: convertTokenToBento(WNATIVE[this.chainId]), 
        gasPrice: state.gasPrice as number
      }]
  
      const route = findMultiRouteExactIn(
        state.tokenFrom, 
        state.tokenTo, 
        state.amountIn,
        poolCodes.map(pc => pc.pool), 
        networks,
        state.gasPrice
      )
      if (route.status != RouteStatus.NoWay) {
        if (!this.currentBestRoute || route.totalAmountOut > this.currentBestRoute.totalAmountOut) {
          this.currentBestRoute = route
          this.routeProcessors.forEach(p => p(route))
        }
      }
    }    
  }

  // Converts route in route processor code
  makeRouteProcessorCode(route: MultiRoute, to: string, maxSlippage: number): string {
    return 'unimplemented'
  }

  // Human-readable route printing
  printRoute(route: MultiRoute): string {
    return 'unimplemented'
  }
}