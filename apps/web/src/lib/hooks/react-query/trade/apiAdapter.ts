import { Native, Token, type Type } from 'sushi/currency'
import z from 'zod'
import type {
  tokenValidator as tokenValidator01,
  tradeValidator01,
} from './validator01'
import type { tradeValidator02 } from './validator02'

type token1 = z.infer<typeof tokenValidator01>
export type swapApi1 = z.infer<typeof tradeValidator01>
export type swapApi2 = z.infer<typeof tradeValidator02>

export function getApi1Token(token: Token | Native): token1 {
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

function getApi1TokenAddr(token: Token | Native): string {
  return token instanceof Token
    ? token.address
    : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
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
