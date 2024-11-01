import {
  Address,
  Hex,
  encodeFunctionData,
  prepareEncodeFunctionData,
} from 'viem'
import { routeProcessor2Abi } from '../abi/routeProcessor2Abi.js'
import { routeProcessor4Abi } from '../abi/routeProcessor4Abi.js'
import { routeProcessorAbi } from '../abi/routeProcessorAbi.js'
import { ChainId } from '../chain/index.js'
import { Native, WNATIVE, WNATIVE_ADDRESS } from '../currency/index.js'
import { Token, Type } from '../currency/index.js'
import {
  MultiRoute,
  NetworkInfo,
  RPool,
  RToken,
  RouteStatus,
  convertTokenToBento,
  findMultiRouteExactIn,
  getBentoChainId,
  getBigInt,
} from '../tines/index.js'
import { LiquidityProviders } from './liquidity-providers/index.js'
import { PoolCode } from './pool-codes/index.js'
import {
  PermitData,
  RouterLiquiditySource,
  getRouteProcessor2Code,
} from './tines-to-route-processor-2.js'
import { getRouteProcessor4Code } from './tines-to-route-processor-4.js'
import { getRouteProcessorCode } from './tines-to-route-processor.js'

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

const RPprocessRouteEncodeData = prepareEncodeFunctionData({
  abi: routeProcessorAbi,
  functionName: 'processRoute',
})
const RP2processRouteEncodeData = prepareEncodeFunctionData({
  abi: routeProcessor2Abi,
  functionName: 'processRoute',
})
const RP4processRouteEncodeData = prepareEncodeFunctionData({
  abi: routeProcessor4Abi,
  functionName: 'processRoute',
})

const isWrap = ({ fromToken, toToken }: { fromToken: Type; toToken: Type }) =>
  fromToken.isNative &&
  toToken.wrapped.address === Native.onChain(toToken.chainId).wrapped.address
const isUnwrap = ({ fromToken, toToken }: { fromToken: Type; toToken: Type }) =>
  toToken.isNative &&
  fromToken.wrapped.address ===
    Native.onChain(fromToken.chainId).wrapped.address

export interface RPParams {
  tokenIn: Address
  amountIn: bigint
  tokenOut: Address
  amountOutMin: bigint
  to: Address
  routeCode: Hex
  data: string
  value?: bigint | undefined
}

export type PoolFilter = (list: RPool) => boolean

export class Router {
  static findSushiRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Type,
    amountIn: bigint,
    toToken: Type,
    gasPrice: number,
  ) {
    return Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      [
        LiquidityProviders.NativeWrap,
        LiquidityProviders.SushiSwapV2,
        LiquidityProviders.SushiSwapV3,
        LiquidityProviders.Trident,
      ],
    )
  }

  static findSpecialRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Type,
    amountIn: bigint,
    toToken: Type,
    gasPrice: number,
    maxPriceImpact = 1, // 1%
  ) {
    // Find preferrable route
    const preferrableRoute = Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      [
        LiquidityProviders.NativeWrap,
        LiquidityProviders.SushiSwapV2,
        LiquidityProviders.SushiSwapV3,
        LiquidityProviders.Trident,
      ],
    )
    // If the route is successful and the price impact is less than maxPriceImpact, then return the route
    if (
      preferrableRoute.status === RouteStatus.Success &&
      preferrableRoute.priceImpact !== undefined &&
      preferrableRoute.priceImpact < maxPriceImpact / 100
    ) {
      return preferrableRoute
    }
    // Otherwise, find the route using all possible liquidity providers
    return Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
    )
  }

  static findBestRoute(
    poolCodes: Map<string, PoolCode> | PoolCode[],
    chainId: ChainId,
    fromToken: Type,
    amountIn: bigint,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter,
    flows?: number | number[],
    pickRoute?: 'single' | 'multi',
  ): MultiRoute {
    const networks: NetworkInfo[] = [
      {
        chainId: Number(chainId),
        baseToken: WNATIVE[chainId] as RToken,
        gasPrice: gasPrice as number,
      },
      {
        chainId: getBentoChainId(chainId),
        baseToken: convertTokenToBento(WNATIVE[chainId]),
        gasPrice: gasPrice as number,
      },
    ]

    let poolCodesMap: Map<string, PoolCode>
    if (poolCodes instanceof Map) poolCodesMap = poolCodes
    else {
      poolCodesMap = new Map()
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))
    }

    let poolCodesList =
      poolCodes instanceof Map ? Array.from(poolCodes.values()) : poolCodes
    if (providers) {
      poolCodesList = poolCodesList.filter((pc) =>
        [...providers, LiquidityProviders.NativeWrap].includes(
          pc.liquidityProvider,
        ),
      )
    }
    let pools = Array.from(poolCodesList).map((pc) => pc.pool)

    if (poolFilter) pools = pools.filter(poolFilter)

    const route = findMultiRouteExactIn(
      TokenToRToken(fromToken),
      TokenToRToken(toToken),
      amountIn,
      pools,
      networks,
      gasPrice,
      flows,
      pickRoute,
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
    to: Address,
    RPAddr: Address,
    maxPriceImpact = 0.005,
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? (fromToken.address as Address)
        : fromToken.chainId === ChainId.CELO
          ? WNATIVE_ADDRESS[
              ChainId.CELO
            ] /*CELO native coin has ERC20 interface*/
          : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const tokenOut =
      toToken instanceof Token
        ? (toToken.address as Address)
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const isWrapOrUnwap =
      isWrap({ fromToken, toToken }) || isUnwrap({ fromToken, toToken })
    const amountOutMin = isWrapOrUnwap
      ? route.amountOutBI
      : (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
        1_000_000n

    const routeCode = getRouteProcessorCode(
      route,
      RPAddr,
      to,
      poolCodesMap,
    ) as Hex
    const data = encodeFunctionData({
      ...RPprocessRouteEncodeData,
      args: [tokenIn, route.amountInBI, tokenOut, amountOutMin, to, routeCode],
    })
    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode,
      data,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  static routeProcessor2Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: Address,
    RPAddr: Address,
    permits: PermitData[] = [],
    maxPriceImpact = 0.005,
    source = RouterLiquiditySource.Sender,
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? (fromToken.address as Address)
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const tokenOut =
      toToken instanceof Token
        ? (toToken.address as Address)
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const isWrapOrUnwap =
      isWrap({ fromToken, toToken }) || isUnwrap({ fromToken, toToken })
    const amountOutMin = isWrapOrUnwap
      ? route.amountOutBI
      : (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
        1_000_000n

    const routeCode = getRouteProcessor2Code(
      route,
      RPAddr,
      to,
      poolCodesMap,
      permits,
      source,
    ) as Hex
    const data = encodeFunctionData({
      ...RP2processRouteEncodeData,
      args: [tokenIn, route.amountInBI, tokenOut, amountOutMin, to, routeCode],
    })
    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode,
      data,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  static routeProcessor3Params = this.routeProcessor2Params
  static routeProcessor3_1Params = this.routeProcessor2Params
  static routeProcessor3_2Params = this.routeProcessor2Params

  static routeProcessor4Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: Address,
    RPAddr: Address,
    permits: PermitData[] = [],
    maxPriceImpact = 0.005,
    source = RouterLiquiditySource.Sender,
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? (fromToken.address as Address)
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const tokenOut =
      toToken instanceof Token
        ? (toToken.address as Address)
        : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const isWrapOrUnwap =
      isWrap({ fromToken, toToken }) || isUnwrap({ fromToken, toToken })
    const amountOutMin = isWrapOrUnwap
      ? route.amountOutBI
      : (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
        1_000_000n

    const routeCode = getRouteProcessor4Code(
      route,
      RPAddr,
      to,
      poolCodesMap,
      permits,
      source,
    ) as Hex
    const data = encodeFunctionData({
      ...RP4processRouteEncodeData,
      args: [tokenIn, route.amountInBI, tokenOut, amountOutMin, to, routeCode],
    })
    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode,
      data,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  // Human-readable route printing
  static routeToHumanString(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    shiftPrimary = '',
    shiftSub = '    ',
  ): string {
    let res = ''
    res += `${shiftPrimary}Route Status: ${route.status}\n`
    res += `${shiftPrimary}Input: ${
      route.amountIn / 10 ** fromToken.decimals
    } ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res += `${shiftSub}${i + 1}. ${l.tokenFrom.symbol} ${Math.round(
        l.absolutePortion * 100,
      )}% -> [${poolCodesMap.get(l.uniqueId)?.poolName}] -> ${
        l.tokenTo.symbol
      }\n`
      //console.log(l.poolAddress, l.assumedAmountIn, l.assumedAmountOut)
    })
    const output =
      parseInt(route.amountOutBI.toString()) / 10 ** toToken.decimals
    res += `${shiftPrimary}Output: ${output} ${route.toToken.symbol}`

    return res
  }
}

export function tokenQuantityString(token: Type, amount: bigint) {
  const denominator = 10n ** BigInt(token.decimals)
  const integer = amount / denominator
  const fractional = amount - integer * denominator
  if (fractional === 0n) return `${integer} ${token.symbol}`
  const paddedFractional = fractional.toString().padStart(token.decimals, '0')
  return `${integer}.${paddedFractional} ${token.symbol}`
}
