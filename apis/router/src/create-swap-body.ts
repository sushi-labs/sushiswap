import type { LiquidityProviders, RPParams } from 'sushi/router'
import {
  type MultiRoute,
  type RToken,
  type RouteLeg,
  RouteStatus,
} from 'sushi/tines'

function makeAPI02Token(token: RToken) {
  return {
    address: token.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
  }
}

function makeAPI02Leg(leg: RouteLeg, tokens: TokenConvertor) {
  return {
    poolAddress: leg.poolAddress,
    poolType: leg.poolType,
    // @ts-ignore
    poolName: leg.poolName as string, // Don't know how, but it exists. Too long to recreate it from poolCodes
    poolFee: leg.poolFee,
    // @ts-ignore
    liquidityProvider: leg.liquidityProvider as LiquidityProviders,
    tokenFrom: tokens.getTokenIndex(leg.tokenFrom),
    tokenTo: tokens.getTokenIndex(leg.tokenTo),
    share: leg.absolutePortion,
    assumedAmountIn: BigInt(leg.assumedAmountIn).toString(),
    assumedAmountOut: BigInt(leg.assumedAmountOut).toString(),
  }
}

class TokenConvertor {
  tokens: RToken[] = []
  tokenMap = new Map<string, number>()

  _tokenId(t: RToken) {
    return t.tokenId ?? t.symbol
  }

  addToken(t: RToken) {
    if (this.tokenMap.get(this._tokenId(t)) === undefined) {
      this.tokens.push(makeAPI02Token(t))
      this.tokenMap.set(this._tokenId(t), this.tokens.length - 1)
    }
  }

  getTokenIndex(t: RToken) {
    return this.tokenMap.get(this._tokenId(t))
  }

  getTokenList() {
    return this.tokens
  }
}

// export function makeAPI02Object(
//   route: MultiRoute,
//   rpParams: RPParams | undefined,
//   routeProcessorAddr: string,
// ) {
//   if (route.status === RouteStatus.NoWay) return { status: RouteStatus.NoWay }
//   const tokens = new TokenConvertor()
//   route.legs.forEach((l) => {
//     tokens.addToken(l.tokenFrom)
//     tokens.addToken(l.tokenTo)
//   })
//   const APIObj = {
//     status: route.status,
//     tokens: tokens.getTokenList(),
//     tokenFrom: tokens.getTokenIndex(route.fromToken),
//     tokenTo: tokens.getTokenIndex(route.toToken),

//     primaryPrice: route.primaryPrice,
//     swapPrice: route.swapPrice,
//     priceImpact: route.priceImpact,

//     amountIn: route.amountInBI.toString(),
//     assumedAmountOut: route.amountOutBI.toString(),
//     gasSpent: route.gasSpent,

//     route: route.legs.map((l) => makeAPI02Leg(l, tokens)),
//   } as any
//   if (rpParams !== undefined) {
//     APIObj.routeProcessorAddr = routeProcessorAddr
//     APIObj.routeProcessorArgs = {
//       tokenIn: rpParams.tokenIn,
//       amountIn: rpParams.amountIn.toString(),
//       tokenOut: rpParams.tokenOut,
//       amountOutMin: rpParams.amountOutMin.toString(),
//       to: rpParams.to,
//       routeCode: rpParams.routeCode,
//       txdata: rpParams.data,
//     }
//     if (rpParams.value !== undefined)
//       APIObj.routeProcessorArgs.value = rpParams.value.toString()
//   }

//   return APIObj
// }

export function createSwapBody(
  route: MultiRoute,
  rpParams?: RPParams | undefined,
  routeProcessorAddress?: string | undefined,
  includeRouteProcessorParams?: boolean,
  includeTransaction?: boolean,
  includeRoute?: boolean,
  debug?: boolean,
) {
  if (route.status === RouteStatus.NoWay) return { status: RouteStatus.NoWay }
  const tokens = new TokenConvertor()
  route.legs.forEach((l) => {
    tokens.addToken(l.tokenFrom)
    tokens.addToken(l.tokenTo)
  })

  const _debug = typeof debug === 'boolean' && debug
  const _includeRouteProcessorParams =
    typeof includeRouteProcessorParams === 'boolean' &&
    includeRouteProcessorParams
  const _includeTransaction =
    typeof includeTransaction === 'boolean' && includeTransaction
  const _includeRoute = typeof includeRoute === 'boolean' && includeRoute

  return {
    status: route.status,
    tokens: tokens.getTokenList(),
    tokenFrom: tokens.getTokenIndex(route.fromToken),
    tokenTo: tokens.getTokenIndex(route.toToken),

    primaryPrice: _debug ? route.primaryPrice : undefined,
    swapPrice: route.swapPrice,
    priceImpact: route.priceImpact,

    amountIn: route.amountInBI.toString(),
    assumedAmountOut: route.amountOutBI.toString(),
    gasSpent: route.gasSpent,

    route: _includeRoute
      ? route.legs.map((l) => makeAPI02Leg(l, tokens))
      : undefined,

    // we want to return { route, tx: { from, to, gas, gasPrice, data, value, } }

    // for backwards compatibility in the meantime
    routeProcessorAddr:
      routeProcessorAddress !== undefined ? routeProcessorAddress : undefined,
    routeProcessorArgs:
      _includeRouteProcessorParams && rpParams !== undefined
        ? {
            tokenIn: rpParams.tokenIn,
            amountIn: rpParams.amountIn.toString(),
            tokenOut: rpParams.tokenOut,
            amountOutMin: rpParams.amountOutMin.toString(),
            to: rpParams.to,
            routeCode: rpParams.routeCode,
            txdata: rpParams.data,
            value:
              rpParams.value !== undefined
                ? rpParams.value.toString()
                : undefined,
          }
        : undefined,

    tx:
      _includeTransaction && rpParams !== undefined
        ? {
            from: rpParams.to,
            to: routeProcessorAddress,
            // we could include a simulation of gas usage
            // gas: rpParams.gas,
            // we could include a gas price estimatation
            // gasPrice: rpParams.gasPrice,
            data: rpParams.data,
            value:
              rpParams.value !== undefined
                ? rpParams.value.toString()
                : undefined,
          }
        : undefined,
  }
}
