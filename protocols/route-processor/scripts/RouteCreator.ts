import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE } from '@sushiswap/currency'
import { findMultiRouteExactIn, MultiRoute, NetworkInfo, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber, ethers } from 'ethers'

import { Limited } from './Limited'
import { LiquidityProvider } from './liquidityProviders/LiquidityProvider'
import { QuickSwapProvider } from './liquidityProviders/QuickSwap'
import { SushiProvider } from './liquidityProviders/Sushi'
import { convertTokenToBento, getBentoChainId, TridentProvider } from './liquidityProviders/Trident'
import { UniswapProvider } from './liquidityProviders/UniswapV2'
import { PoolCode } from './pools/PoolCode'
import { getRouteProcessorCode } from './TinesToRouteProcessor'

enum LiquidityProviders {
  Sushiswap = 'Sushiswap',
  UniswapV2 = 'UniswapV2',
  Trident = 'Trident',
  Quickswap = 'Quickswap',
}

type RouteCallBack = (r: MultiRoute) => void

interface RoutingState {
  tokenFrom: RToken
  amountIn: number | BigNumber
  tokenTo: RToken
  gasPrice: number
  timer: any // timer from setTimeout
}

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class RouteCreator {
  chainId: ChainId
  minUpdateDelay: number
  chainDataProvider: ethers.providers.BaseProvider
  limited: Limited
  routeCallBacks: RouteCallBack[]
  providers: LiquidityProvider[]
  poolCodes: Map<string, PoolCode>

  currentBestRoute?: MultiRoute
  routingState?: RoutingState

  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    chainId: ChainId,
    minUpdateDelay = 1000 // Minimal delay between routing update
  ) {
    this.chainId = chainId
    this.minUpdateDelay = minUpdateDelay
    this.chainDataProvider = chainDataProvider
    this.limited = new Limited(10, 1000)
    this.routeCallBacks = []
    this.providers = []
    this.poolCodes = new Map()
  }

  // Starts pool data fetching and routing calculation
  // Async routing protocol
  startRouting(
    tokenFrom: Token,
    amountIn: number | BigNumber,
    tokenTo: Token,
    gasPrice: number,
    liquidity?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopRouting()
    this.currentBestRoute = undefined
    this.poolCodes = new Map()
    this.providers = [
      new SushiProvider(this.chainDataProvider, this.chainId, this.limited),
      new TridentProvider(this.chainDataProvider, this.chainId, this.limited),
      new UniswapProvider(this.chainDataProvider, this.chainId, this.limited),
      new QuickSwapProvider(this.chainDataProvider, this.chainId, this.limited),
    ]
    this.providers.forEach((p) => p.startGetherData(tokenFrom, tokenTo))
    this.routingState = {
      tokenFrom: tokenFrom as RToken,
      amountIn,
      tokenTo: tokenTo as RToken,
      gasPrice,
      timer: setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay),
    }
  }

  // Callback registration.
  // callbacks are called each time route changes
  onRouteUpdate(p: RouteCallBack) {
    this.routeCallBacks.push(p)
    if (this.currentBestRoute) p(this.currentBestRoute)
  }

  // To stop gather pool data and routing calculation
  stopRouting() {
    if (this.routingState?.timer !== undefined) clearTimeout(this.routingState?.timer)
    this.providers.forEach((p) => p.stopGetherData())
    this.routingState = undefined
    this.routeCallBacks = []
  }

  getBestRoute() {
    return this.currentBestRoute
  }

  _checkRouteUpdate() {
    const state = this.routingState
    if (!state) return

    state.timer = setTimeout(() => this._checkRouteUpdate(), this.minUpdateDelay)
    if (this.providers.some((p) => p.poolListWereUpdated())) {
      let poolCodes: PoolCode[] = []
      this.providers.forEach((p) => (poolCodes = poolCodes.concat(p.getCurrentPoolList())))
      // console.log('pools:', poolCodes.length)
      // state.poolCodes?.forEach(pc => {
      //   console.log(`${pc.pool.token0.symbol} ${pc.pool.token1.symbol} ${pc.pool.address}`);
      // })

      const networks: NetworkInfo[] = [
        {
          chainId: this.chainId,
          baseToken: WNATIVE[this.chainId] as RToken,
          gasPrice: state.gasPrice as number,
        },
        {
          chainId: getBentoChainId(this.chainId),
          baseToken: convertTokenToBento(WNATIVE[this.chainId]),
          gasPrice: state.gasPrice as number,
        },
      ]

      poolCodes.forEach((pc) => this.poolCodes.set(pc.pool.address, pc))

      const route = findMultiRouteExactIn(
        state.tokenFrom,
        state.tokenTo,
        state.amountIn,
        poolCodes.map((pc) => pc.pool),
        networks,
        state.gasPrice
      )
      //console.log('route status', route.status, route.totalAmountOut)

      if (route.status != RouteStatus.NoWay) {
        if (!this.currentBestRoute || route.totalAmountOut > this.currentBestRoute.totalAmountOut) {
          this.currentBestRoute = route
          this.routeCallBacks.forEach((p) => p(route))
        }
      }
    }
  }

  // Converts route in route processor code
  getRouteProcessorCodeForBestRoute(routeProcessor: string, to: string, maxSlippage: number): string {
    if (this.currentBestRoute === undefined) return ''
    const code = getRouteProcessorCode(this.currentBestRoute, routeProcessor, to, this.poolCodes)
    return code
  }

  // Human-readable route printing
  routeToString(route: MultiRoute, fromToken: Token, toToken: Token, shiftPrimary = '', shiftSub = '    '): string {
    let res = ''
    res += shiftPrimary + 'Route Status: ' + route.status + '\n'
    res += shiftPrimary + `Input: ${route.amountIn / Math.pow(10, fromToken.decimals)} ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res +=
        shiftSub +
        shiftSub +
        `${i + 1}. ${l.tokenFrom.name} ${Math.round(l.absolutePortion * 100)}%` +
        ` -> [${this.poolCodes.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.name}\n`
      //console.log(l.poolAddress, l.assumedAmountIn, l.assumedAmountOut)
    })
    const output = parseInt(route.amountOutBN.toString()) / Math.pow(10, toToken.decimals)
    res += shiftPrimary + `Output: ${output} ${route.toToken.name}\n`

    return res
  }
}
