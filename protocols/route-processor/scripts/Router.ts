import { Token, Type, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { findMultiRouteExactIn, getBigNumber, MultiRoute, NetworkInfo, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import { DataFetcher } from './DataFetcher'
import { LiquidityProviders } from './liquidityProviders/LiquidityProviderMC'
import { convertTokenToBento, getBentoChainId } from './liquidityProviders/Trident'
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

export class Router {
  dataFetcher: DataFetcher
  fromToken: Type
  amountIn: BigNumber
  toToken: Type
  gasPrice: number
  providers?: LiquidityProviders[] // all providers if undefined
  minUpdateDelay: number

  dataFetcherPreviousState = 0
  routeCallBack?: RouteCallBack
  currentBestRoute?: MultiRoute
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer?: any // timer from setInterval

  constructor(
    dataFetcher: DataFetcher,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    minUpdateDelay = 1000 // Minimal delay between routing update
  ) {
    this.dataFetcher = dataFetcher
    this.fromToken = fromToken
    this.amountIn = amountIn
    this.toToken = toToken
    this.gasPrice = gasPrice
    this.providers = providers
    this.minUpdateDelay = minUpdateDelay
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

      const route = findMultiRouteExactIn(
        TokenToRToken(this.fromToken),
        TokenToRToken(this.toToken),
        this.amountIn,
        this.dataFetcher.getCurrentPoolCodeList(this.providers).map((pc) => pc.pool),
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

  getRPParams(
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    RPAddr: string,
    maxPriceImpact = 0.005
  ): RPParams {
    const tokenIn = fromToken instanceof Token ? fromToken.address : WNATIVE_ADDRESS[fromToken.chainId]
    const tokenOut = toToken instanceof Token ? toToken.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const amountOutMin = route.amountOutBN.mul(getBigNumber((1 - maxPriceImpact) * 1_000_000)).div(1_000_000)

    return {
      tokenIn,
      amountIn: route.amountInBN,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessorCode(route, RPAddr, to, this.dataFetcher.getCurrentPoolCodeMap()),
      value: fromToken instanceof Token ? undefined : route.amountInBN,
    }
  }

  getCurrentRouteRPParams(to: string, RPAddr: string, maxPriceImpact = 0.005): RPParams | undefined {
    if (this.currentBestRoute !== undefined) {
      return this.getRPParams(this.currentBestRoute, this.fromToken, this.toToken, to, RPAddr, maxPriceImpact)
    }
  }

  // Human-readable route printing
  routeToHumanString(route: MultiRoute, fromToken: Type, toToken: Type, shiftPrimary = '', shiftSub = '    '): string {
    const poolCodesMap = this.dataFetcher.getCurrentPoolCodeMap()
    let res = ''
    res += shiftPrimary + 'Route Status: ' + route.status + '\n'
    res += shiftPrimary + `Input: ${route.amountIn / Math.pow(10, fromToken.decimals)} ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res +=
        shiftSub +
        shiftSub +
        `${i + 1}. ${l.tokenFrom.symbol} ${Math.round(l.absolutePortion * 100)}%` +
        ` -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.symbol}\n`
      //console.log(l.poolAddress, l.assumedAmountIn, l.assumedAmountOut)
    })
    const output = parseInt(route.amountOutBN.toString()) / Math.pow(10, toToken.decimals)
    res += shiftPrimary + `Output: ${output} ${route.toToken.name}\n`

    return res
  }

  getCurrentRouteHumanString(shiftPrimary = '', shiftSub = '    '): string | undefined {
    if (this.currentBestRoute !== undefined) {
      return this.routeToHumanString(this.currentBestRoute, this.fromToken, this.toToken, shiftPrimary, shiftSub)
    }
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
