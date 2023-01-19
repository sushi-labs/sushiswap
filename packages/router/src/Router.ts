import { Token, Type, WNATIVE } from '@sushiswap/currency'
import {
  findMultiRouteExactIn,
  getBigNumber,
  MultiRoute,
  NetworkInfo,
  RouteStatus,
  RPool,
  RToken,
} from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import type { DataFetcher } from './DataFetcher'
import type { LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { convertTokenToBento, getBentoChainId } from './liquidity-providers/Trident'
import { getRouteProcessorCode } from './TinesToRouteProcessor'

type RouteCallBack = (r: MultiRoute) => void

function TokenToRToken(t: Type): RToken {
  if (t instanceof Token) return t as RToken
  const nativeRToken: RToken = {
    address: '',
    name: t.name,
    symbol: t.symbol,
    chainId: t.chainId,
  }
  return nativeRToken
}

export interface RPParams {
  tokenIn: string
  amountIn: BigNumber
  tokenOut: string
  amountOutMin: BigNumber
  to: string
  routeCode: string
  value?: BigNumber
}

export type PoolFilter = (list: RPool) => boolean

export class Router {
  dataFetcher: DataFetcher
  fromToken: Type
  amountIn: BigNumber
  toToken: Type
  gasPrice: number
  providers?: LiquidityProviders[] | undefined // all providers if undefined
  minUpdateDelay: number
  poolFilter?: PoolFilter

  dataFetcherPreviousState = 0
  routeCallBack?: RouteCallBack
  currentBestRoute?: MultiRoute | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer?: any // timer from setInterval

  constructor(
    dataFetcher: DataFetcher,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter,
    minUpdateDelay = 1000 // Minimal delay between routing update
  ) {
    this.dataFetcher = dataFetcher
    this.fromToken = fromToken
    this.amountIn = amountIn
    this.toToken = toToken
    this.gasPrice = gasPrice
    this.providers = providers
    this.minUpdateDelay = minUpdateDelay
    this.poolFilter = poolFilter
  }

  startRouting(p: RouteCallBack) {
    this.stopRouting()
    this.routeCallBack = p
    this.currentBestRoute = undefined
    this.dataFetcherPreviousState = 0
    this._checkRouteUpdate() // Maybe a route is ready
    this.timer = setInterval(() => this._checkRouteUpdate(), this.minUpdateDelay)
  }

  // To stop gather pool data and routing calculation
  stopRouting() {
    if (this.timer) clearInterval(this.timer)
    this.timer = undefined
  }

  getBestRoute() {
    return this.currentBestRoute
  }

  _checkRouteUpdate() {
    const currentDataFetcherStateId = this.dataFetcher.getCurrentPoolStateId(this.providers)
    if (this.dataFetcherPreviousState != currentDataFetcherStateId) {
      this.dataFetcherPreviousState = currentDataFetcherStateId

      const networks: NetworkInfo[] = [
        {
          chainId: this.dataFetcher.chainId,
          baseToken: WNATIVE[this.dataFetcher.chainId] as RToken,
          gasPrice: this.gasPrice as number,
        },
        {
          chainId: getBentoChainId(this.dataFetcher.chainId),
          baseToken: convertTokenToBento(WNATIVE[this.dataFetcher.chainId]),
          gasPrice: this.gasPrice as number,
        },
      ]

      let pools = this.dataFetcher.getCurrentPoolCodeList(this.providers).map((pc) => pc.pool)
      if (this.poolFilter) pools = pools.filter(this.poolFilter)

      const route = findMultiRouteExactIn(
        TokenToRToken(this.fromToken),
        TokenToRToken(this.toToken),
        this.amountIn,
        pools,
        networks,
        this.gasPrice
      )

      if (route.status != RouteStatus.NoWay) {
        this.currentBestRoute = route
        if (this.routeCallBack) this.routeCallBack(route)
      }
    }
  }

  changeRouteParams(fromToken: Type, amountIn: BigNumber, toToken: Type, gasPrice: number) {
    this.fromToken = fromToken
    this.amountIn = amountIn
    this.toToken = toToken
    this.gasPrice = gasPrice
    this.currentBestRoute = undefined
    this._checkRouteUpdate() // Recalc route immediately
  }

  getCurrentRouteRPParams(to: string, RPAddr: string, maxPriceImpact = 0.005): RPParams | undefined {
    if (this.currentBestRoute !== undefined) {
      return Router.routeProcessorParams(
        this.dataFetcher,
        this.currentBestRoute,
        this.fromToken,
        this.toToken,
        to,
        RPAddr,
        maxPriceImpact
      )
    }
  }

  getCurrentRouteHumanString(shiftPrimary = '', shiftSub = '    '): string | void {
    if (this.currentBestRoute !== undefined) {
      return Router.routeToHumanString(
        this.dataFetcher,
        this.currentBestRoute,
        this.fromToken,
        this.toToken,
        shiftPrimary,
        shiftSub
      )
    }
  }

  getCurrentRouteHumanArray(): string[] | void {
    if (this.currentBestRoute !== undefined) {
      const poolCodesMap = this.dataFetcher.getCurrentPoolCodeMap()
      return [
        `Route Status: ${this.currentBestRoute.status}`,
        `Input: ${this.currentBestRoute.amountInBN.div(BigNumber.from(10).pow(this.fromToken.decimals))} ${
          this.fromToken.symbol
        }`,
        ...this.currentBestRoute.legs.map((l, i) => {
          return (
            `${i + 1}. ${l.tokenFrom.symbol} ${Math.round(l.absolutePortion * 100)}%` +
            ` -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.symbol}`
          )
        }),
        `Output: ${this.currentBestRoute.amountOutBN.div(BigNumber.from(10).pow(this.toToken.decimals))} ${
          this.toToken.symbol
        }`,
        `Price Impact: ${(Number(this.currentBestRoute.priceImpact) * 100).toFixed(2)}%`,
      ]
    }
  }

  static findBestRoute(
    dataFetcher: DataFetcher,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter
  ): MultiRoute {
    const networks: NetworkInfo[] = [
      {
        chainId: dataFetcher.chainId,
        baseToken: WNATIVE[dataFetcher.chainId] as RToken,
        gasPrice: gasPrice as number,
      },
      {
        chainId: getBentoChainId(dataFetcher.chainId),
        baseToken: convertTokenToBento(WNATIVE[dataFetcher.chainId]),
        gasPrice: gasPrice as number,
      },
    ]

    let pools = dataFetcher.getCurrentPoolCodeList(providers).map((pc) => pc.pool)
    if (poolFilter) pools = pools.filter(poolFilter)

    return findMultiRouteExactIn(TokenToRToken(fromToken), TokenToRToken(toToken), amountIn, pools, networks, gasPrice)
  }

  static routeProcessorParams(
    dataFetcher: DataFetcher,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    RPAddr: string,
    maxPriceImpact = 0.005
  ): RPParams {
    const tokenIn = fromToken instanceof Token ? fromToken.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const tokenOut = toToken instanceof Token ? toToken.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const amountOutMin = route.amountOutBN.mul(getBigNumber((1 - maxPriceImpact) * 1_000_000)).div(1_000_000)

    return {
      tokenIn,
      amountIn: route.amountInBN,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessorCode(route, RPAddr, to, dataFetcher.getCurrentPoolCodeMap()),
      value: fromToken instanceof Token ? undefined : route.amountInBN,
    }
  }

  // Human-readable route printing
  static routeToHumanString(
    dataFetcher: DataFetcher,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    shiftPrimary = '',
    shiftSub = '    '
  ): string {
    const poolCodesMap = dataFetcher.getCurrentPoolCodeMap()
    let res = ''
    res += shiftPrimary + 'Route Status: ' + route.status + '\n'
    res += shiftPrimary + `Input: ${route.amountIn / Math.pow(10, fromToken.decimals)} ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res +=
        shiftSub +
        `${i + 1}. ${l.tokenFrom.symbol} ${Math.round(l.absolutePortion * 100)}%` +
        ` -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.symbol}\n`
      //console.log(l.poolAddress, l.assumedAmountIn, l.assumedAmountOut)
    })
    const output = parseInt(route.amountOutBN.toString()) / Math.pow(10, toToken.decimals)
    res += shiftPrimary + `Output: ${output} ${route.toToken.symbol}`

    return res
  }
}

export function tokenQuantityString(token: Type, amount: BigNumber) {
  const denominator = BigNumber.from(10).pow(token.decimals)
  const integer = amount.div(denominator)
  const fractional = amount.sub(integer.mul(denominator))
  if (fractional.isZero()) return `${integer} ${token.symbol}`
  const paddedFractional = fractional.toString().padStart(token.decimals, '0')
  return `${integer}.${paddedFractional} ${token.symbol}`
}
