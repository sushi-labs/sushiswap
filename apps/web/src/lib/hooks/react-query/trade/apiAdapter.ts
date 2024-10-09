import { Native, Token, type Type } from 'sushi/currency'
import { PoolType } from 'sushi/router'
import z from 'zod'
import type {
  legValidator as legValidator01,
  tokenValidator as tokenValidator01,
  tradeValidator01,
} from './validator01'
import type {
  legValidator as legValidator02,
  tokenValidator as tokenValidator02,
  tradeValidator02,
} from './validator02'

type token1 = z.infer<typeof tokenValidator01>
type token2 = z.infer<typeof tokenValidator02>
type leg1 = z.infer<typeof legValidator01>
type leg2 = z.infer<typeof legValidator02>
export type swapApi1 = z.infer<typeof tradeValidator01>
export type swapApi2 = z.infer<typeof tradeValidator02>

function getApi1Token(token: Token | Native): token1 {
  if (token instanceof Token)
    return {
      chainId: token.chainId,
      decimals: token.decimals,
      symbol: token.symbol as string,
      name: token.name as string,
      isNative: token.isNative,
      isToken: token.isToken,
      address: token.address,
      tokenId: token.id,
    }
  else
    return {
      chainId: token.chainId,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
      isNative: token.isNative,
      isToken: token.isToken,
      tokenId: token.id,
    }
}
function getApi1TokenFromToken2(token: token2, chainId: number): token1 {
  const isNative =
    token.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  return {
    chainId,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    isNative,
    isToken: !isNative,
    address: token.address,
    tokenId: `${token.address}_${chainId}`,
  }
}

function getApi1TokenAddr(token: Token | Native): string {
  return token instanceof Token
    ? token.address
    : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
}

function getApi1PoolType(pt: PoolType) {
  if (pt === PoolType.Classic || pt === PoolType.Stable) return pt
  return 'Unknown'
}

function getApi1Leg(leg: leg2, tokens: token2[], chainId: number): leg1 {
  return {
    poolAddress: leg.poolAddress,
    poolType: getApi1PoolType(leg.poolType),
    poolFee: leg.poolFee,
    tokenFrom: getApi1TokenFromToken2(tokens[leg.tokenFrom] as token2, chainId),
    tokenTo: getApi1TokenFromToken2(tokens[leg.tokenTo] as token2, chainId),
    assumedAmountIn: Number(leg.assumedAmountIn),
    assumedAmountOut: Number(leg.assumedAmountOut),
    swapPortion: 0,
    absolutePortion: leg.share,
    poolName: leg.poolName,
    liquidityProvider: leg.liquidityProvider,
  }
}

// converts API 2 to API 1 response
export function apiAdapter02To01(
  res: swapApi2,
  fromToken: Type,
  toToken: Type,
  to: string | undefined,
): swapApi1 {
  if (res.status === 'NoWay') {
    const route = {
      status: res.status,
      fromToken: getApi1Token(fromToken),
      toToken: getApi1Token(toToken),
      amountIn: 0,
      amountInBI: 0n,
      amountOut: 0,
      amountOutBI: 0n,
      legs: [],
      gasSpent: 0,
      totalAmountOut: 0,
      totalAmountOutBI: 0n,
    }
    if (to !== undefined) {
      return {
        route,
        args: {
          amountIn: 0n,
          amountOutMin: 0n,
          to,
          tokenIn: getApi1TokenAddr(fromToken),
          tokenOut: getApi1TokenAddr(toToken),
          routeCode: '',
        },
      }
    } else {
      return { route }
    }
  } else {
    const route = {
      status: res.status,
      fromToken: getApi1Token(fromToken),
      toToken: getApi1Token(toToken),
      primaryPrice: res.primaryPrice,
      swapPrice: res.swapPrice,
      priceImpact: res.priceImpact,
      amountIn: Number(res.amountIn),
      amountInBI: BigInt(res.amountIn),
      amountOut: Number(res.assumedAmountOut),
      amountOutBI: BigInt(res.assumedAmountOut),
      legs: res.route.map((l) => getApi1Leg(l, res.tokens, fromToken.chainId)),
      gasSpent: res.gasSpent,
      totalAmountOut: Number(res.assumedAmountOut),
      totalAmountOutBI: BigInt(res.assumedAmountOut),
    }

    return {
      route,
      args: res.routeProcessorArgs
        ? {
            amountIn: BigInt(res.routeProcessorArgs.amountIn),
            amountOutMin: BigInt(res.routeProcessorArgs.amountOutMin),
            to: res.routeProcessorArgs.to,
            tokenIn: res.routeProcessorArgs.tokenIn,
            tokenOut: res.routeProcessorArgs.tokenOut,
            routeCode: res.routeProcessorArgs.routeCode,
          }
        : undefined,
      tx: res.tx ? res.tx : undefined,
    }
  }
}
