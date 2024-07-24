import { Token } from '../currency/Token.js'
import { MultiRoute, RToken, RouteLeg, RouteStatus } from '../tines/index.js'
import { LiquidityProviders } from './liquidity-providers/LiquidityProvider.js'
import { PoolCode } from './pool-codes/PoolCode.js'
import { RPParams } from './router.js'

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
    tokenFrom: tokens.getTokenIndex(leg.tokenFrom),
    tokenTo: tokens.getTokenIndex(leg.tokenTo),
    share: leg.absolutePortion,
    assumedAmountIn: BigInt(leg.assumedAmountIn).toString(),
    assumedAmountOut: BigInt(leg.assumedAmountOut).toString(),
  }
}

function makeAPI03Leg(
  leg: RouteLeg,
  tokens: TokenConvertor,
  liquidityProviders: LiquidityProviderConvertor,
) {
  return {
    liquidityProvider: liquidityProviders.getLiquidityProviderIndex(
      leg.uniqueId,
    ),
    poolAddress: leg.poolAddress,
    tokenFrom: tokens.getTokenIndex(leg.tokenFrom),
    tokenTo: tokens.getTokenIndex(leg.tokenTo),
    share: leg.absolutePortion,
  }
}

class TokenConvertor {
  tokens: Pick<Token, 'address' |'decimals' | 'symbol' | 'name'|>[] = []
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

class LiquidityProviderConvertor {
  liquidityProviders: LiquidityProviders[] = []
  liquidityProviderMap = new Map<LiquidityProviders, number>()
  idToLiquidityProvider = new Map<string, LiquidityProviders>()

  addLiquidityProvider(id: string, liquidityProvider: LiquidityProviders) {
    if (this.liquidityProviderMap.get(liquidityProvider) === undefined) {
      this.liquidityProviders.push(liquidityProvider)

      this.liquidityProviderMap.set(
        liquidityProvider,
        this.liquidityProviders.length - 1,
      )
    }
    this.idToLiquidityProvider.set(id, liquidityProvider)
  }

  getLiquidityProviderIndex(id: string) {
    return this.liquidityProviderMap.get(this.idToLiquidityProvider.get(id)!)
  }

  geLiquidityProviderList() {
    return this.liquidityProviders
  }
}

export function makeAPI02Object(
  route: MultiRoute,
  rpParams: RPParams | undefined,
  routeProcessorAddr: string,
) {
  if (route.status === RouteStatus.NoWay) return { status: RouteStatus.NoWay }
  const tokens = new TokenConvertor()
  route.legs.forEach((l) => {
    tokens.addToken(l.tokenFrom)
    tokens.addToken(l.tokenTo)
  })
  const APIObj = {
    status: route.status,
    tokens: tokens.getTokenList(),
    tokenFrom: tokens.getTokenIndex(route.fromToken),
    tokenTo: tokens.getTokenIndex(route.toToken),

    primaryPrice: route.primaryPrice,
    swapPrice: route.swapPrice,
    priceImpact: route.priceImpact,

    amountIn: route.amountInBI.toString(),
    assumedAmountOut: route.amountOutBI.toString(),
    gasSpent: route.gasSpent,

    route: route.legs.map((l) => makeAPI02Leg(l, tokens)),
  } as any
  if (rpParams !== undefined) {
    APIObj.routeProcessorAddr = routeProcessorAddr
    APIObj.routeProcessorArgs = {
      tokenIn: rpParams.tokenIn,
      amountIn: rpParams.amountIn.toString(),
      tokenOut: rpParams.tokenOut,
      amountOutMin: rpParams.amountOutMin.toString(),
      to: rpParams.to,
      routeCode: rpParams.routeCode,
      txdata: rpParams.data,
    }
    if (rpParams.value !== undefined)
      APIObj.routeProcessorArgs.value = rpParams.value.toString()
  }

  return APIObj
}

export function makeAPI03Object(
  route: MultiRoute,
  rpParams: RPParams | undefined,
  routeProcessorAddr: string,
  poolCodesMap: Map<string, PoolCode>,
) {
  if (route.status === RouteStatus.NoWay) return { status: RouteStatus.NoWay }
  const tokens = new TokenConvertor()
  const liquidityProviders = new LiquidityProviderConvertor()
  route.legs.forEach((l) => {
    tokens.addToken(l.tokenFrom)
    tokens.addToken(l.tokenTo)
    liquidityProviders.addLiquidityProvider(
      l.uniqueId,
      poolCodesMap.get(l.uniqueId)!.liquidityProvider,
    )
  })

  const APIObj = {
    status: route.status,
    tokens: tokens.getTokenList(),
    liquidityProviders: liquidityProviders.geLiquidityProviderList(),
    tokenFrom: tokens.getTokenIndex(route.fromToken),
    tokenTo: tokens.getTokenIndex(route.toToken),

    primaryPrice: route.primaryPrice,
    swapPrice: route.swapPrice,
    priceImpact: route.priceImpact,

    amountIn: route.amountInBI.toString(),
    assumedAmountOut: route.amountOutBI.toString(),
    gasSpent: route.gasSpent,

    route: route.legs.map((l) => makeAPI03Leg(l, tokens, liquidityProviders)),
  } as any
  if (rpParams !== undefined) {
    APIObj.routeProcessorAddr = routeProcessorAddr
    APIObj.routeProcessorArgs = {
      tokenIn: rpParams.tokenIn,
      amountIn: rpParams.amountIn.toString(),
      tokenOut: rpParams.tokenOut,
      amountOutMin: rpParams.amountOutMin.toString(),
      to: rpParams.to,
      routeCode: rpParams.routeCode,
      txdata: rpParams.data,
    }
    if (rpParams.value !== undefined)
      APIObj.routeProcessorArgs.value = rpParams.value.toString()
  }

  return APIObj
}
