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

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
class RouteCreator {
  chainId: ChainId
  minUpdateDelay: number
  chainDataProvider: ethers.providers.BaseProvider
  limited: Limited
  routeProcessors: RouteProcessor[]
  
  currentBestRoute?: MultiRoute
  timer: any
  providers: LiquidityProvider[]
  tokenFrom?: Token
  amountIn?: number | BigNumber
  tokenTo?: Token
  gasPrice?: number

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
  startRouting(
    tokenFrom: Token, 
    amountIn: number | BigNumber, 
    tokenTo: Token,
    gasPrice: number,
    liquidity?: LiquidityProviders[]    // all providers if undefined
  ) {
    this.stopRouting()
    this.providers = [
      new SushiProvider(this.chainDataProvider, this.chainId, this.limited),
    ]
    this.providers.forEach(p => p.startGetherData(tokenFrom, tokenTo))
    this.tokenFrom = tokenFrom
    this.amountIn = amountIn
    this.tokenTo = tokenTo
    this.gasPrice = gasPrice
    this.timer = setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
  }

  onRouteUpdate(p: RouteProcessor) {
    this.routeProcessors.push(p)
    if (this.currentBestRoute) p(this.currentBestRoute)
  }

  stopRouting() {
    if (this.timer !== undefined) clearTimeout(this.timer)
    this.providers.forEach(p =>p.stopGetherData())
  }

  _checkRouteUpdate() {    
    this.timer = setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
    if (this.providers.some(p => p.poolListWereUpdated())) {
      let poolCodes: PoolCode[] = []
      this.providers.forEach(p => poolCodes = poolCodes.concat(p.getCurrentPoolList()))
      
      const networks: NetworkInfo[] = [{
        chainId: this.chainId,
        baseToken: WNATIVE[this.chainId] as RToken, 
        gasPrice: this.gasPrice as number
      }, {
        chainId: getBentoChainId(this.chainId),
        baseToken: convertTokenToBento(WNATIVE[this.chainId]), 
        gasPrice: this.gasPrice as number
      }]
  
      const route = findMultiRouteExactIn(
        this.tokenFrom as RToken, 
        this.tokenTo as RToken, 
        this.amountIn as number | BigNumber, 
        poolCodes.map(pc => pc.pool), 
        networks,
        this.gasPrice as number
      )
      if (route.status != RouteStatus.NoWay) {
        if (!this.currentBestRoute || route.totalAmountOut > this.currentBestRoute.totalAmountOut) {
          this.currentBestRoute = route
          this.routeProcessors.forEach(p => p(route))
        }
      }
    }    
  }

  makeRouteProcessorCode(route: MultiRoute, to: string, maxSlippage: number): string {
    return 'unimplemented'
  }

  printRoute(route: MultiRoute): string {
    return 'unimplemented'
  }
}