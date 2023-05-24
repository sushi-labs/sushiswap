import { ChainId } from '@sushiswap/chain'
import { Token, Type, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'
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

import { convertTokenToBento, getBentoChainId } from './lib/convert'
import { LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { PoolCode } from './pools/PoolCode'
import { getRouteProcessorCode } from './TinesToRouteProcessor'
import { getRouteProcessor2Code, PermitData } from './TinesToRouteProcessor2'
import { getRouteProcessor4Code } from './TinesToRouteProcessor4'

function TokenToRToken(t: Type): RToken {
  if (t instanceof Token) return t as RToken
  const nativeRToken: RToken = {
    address: '',
    name: t.name,
    symbol: t.symbol,
    chainId: t.chainId,
    decimals: 18,
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
  static findSushiRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number
  ) {
    return Router.findBestRoute(poolCodesMap, chainId, fromToken, amountIn, toToken, gasPrice, [
      LiquidityProviders.NativeWrap,
      LiquidityProviders.SushiSwapV2,
      LiquidityProviders.SushiSwapV3,
      LiquidityProviders.Trident,
    ])
  }

  static findSpecialRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    maxPriceImpact = 10 // 10%
  ) {
    // Find preferrable route
    const preferrableRoute = Router.findBestRoute(poolCodesMap, chainId, fromToken, amountIn, toToken, gasPrice, [
      LiquidityProviders.NativeWrap,
      LiquidityProviders.SushiSwapV2,
      LiquidityProviders.SushiSwapV3,
      LiquidityProviders.Trident,
    ])
    // If the route is successful and the price impact is less than maxPriceImpact, then return the route
    if (
      preferrableRoute.status === RouteStatus.Success &&
      preferrableRoute.priceImpact !== undefined &&
      preferrableRoute.priceImpact < maxPriceImpact / 100
    ) {
      return preferrableRoute
    }
    // Otherwise, find the route using all possible liquidity providers
    return Router.findBestRoute(poolCodesMap, chainId, fromToken, amountIn, toToken, gasPrice)
  }

  static findBestRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter
  ): MultiRoute {
    const networks: NetworkInfo[] = [
      {
        chainId: chainId,
        baseToken: WNATIVE[chainId] as RToken,
        gasPrice: gasPrice as number,
      },
      {
        chainId: getBentoChainId(chainId),
        baseToken: convertTokenToBento(WNATIVE[chainId]),
        gasPrice: gasPrice as number,
      },
    ]

    let poolCodes = Array.from(poolCodesMap.values())
    if (providers) {
      poolCodes = poolCodes.filter((pc) => [...providers, LiquidityProviders.NativeWrap].includes(pc.liquidityProvider))
    }
    let pools = Array.from(poolCodes).map((pc) => pc.pool)

    // console.log('before', pools.length)
    if (poolFilter) pools = pools.filter(poolFilter)
    // console.log('after', pools.length)
    // console.log({pools})
    const route = findMultiRouteExactIn(
      TokenToRToken(fromToken),
      TokenToRToken(toToken),
      amountIn,
      pools,
      networks,
      gasPrice
    )

    return {
      ...route,
      legs: route.legs.map((l) => ({
        ...l,
        poolName: poolCodesMap.get(l.poolAddress)?.poolName ?? 'Unknown Pool',
      })),
    }
  }

  static routeProcessorParams(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    RPAddr: string,
    maxPriceImpact = 0.005
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? fromToken.address
        : fromToken.chainId == ChainId.CELO
        ? WNATIVE_ADDRESS[ChainId.CELO] /*CELO native coin has ERC20 interface*/
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const tokenOut = toToken instanceof Token ? toToken.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const amountOutMin = route.amountOutBN.mul(getBigNumber((1 - maxPriceImpact) * 1_000_000)).div(1_000_000)

    return {
      tokenIn,
      amountIn: route.amountInBN,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessorCode(route, RPAddr, to, poolCodesMap),
      value: fromToken instanceof Token ? undefined : route.amountInBN,
    }
  }

  static routeProcessor2Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    RPAddr: string,
    permits: PermitData[] = [],
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
      routeCode: getRouteProcessor2Code(route, RPAddr, to, poolCodesMap, permits),
      value: fromToken instanceof Token ? undefined : route.amountInBN,
    }
  }

  static routeProcessor4Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    RPAddr: string,
    permits: PermitData[] = [],
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
      routeCode: getRouteProcessor4Code(route, RPAddr, to, poolCodesMap, permits),
      value: fromToken instanceof Token ? undefined : route.amountInBN,
    }
  }

  // Human-readable route printing
  static routeToHumanString(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    shiftPrimary = '',
    shiftSub = '    '
  ): string {
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
