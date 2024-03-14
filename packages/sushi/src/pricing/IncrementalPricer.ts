import { Address } from 'viem'
import { Token } from '../currency'
import { RPool } from '../tines'

class TokenInfo {
  address: Address
  parent: TokenInfo | undefined
  children: TokenInfo[]
  direction: boolean
  poolPrice: number
  changedPoolIndex?: number

  constructor(
    address: Address,
    children: TokenInfo[],
    direction: boolean,
    poolPrice: number,
    parent?: TokenInfo,
  ) {
    this.address = address
    this.children = children
    this.direction = direction
    this.poolPrice = poolPrice
    this.parent = parent
  }
}

export class IncrementalPricer {
  baseToken?: TokenInfo
  poolTokenMap: Map<string, TokenInfo> = new Map() // indexed by pool.uniqueID()
  tokenMap: Map<Address, TokenInfo> = new Map()
  prices: Record<string, number> = {}
  minLiquidity: number

  constructor(minLiquidity: number) {
    this.minLiquidity = minLiquidity
  }

  _recreatePricesFromScratch(baseToken: Token, _pools: RPool[]) {
    this.poolTokenMap.clear()
    this.tokenMap.clear()
    this.prices = {}

    this.baseToken = new TokenInfo(baseToken.address, [], true, 1)

    /*const processedVert = new Set<string>()
    type ValuedEdge = [number, Edge]
    let nextEdges: ValuedEdge[] = []

    function addVertice(v: Vertice, price: number) {
      v.price = price
      const newEdges = v.edges
        .filter((e) => !processedVert.has(v.getNeibour(e) as Vertice))
        .map((e) => {
          const liquidity = price * Number(e.reserve(v))
          return [liquidity, e] as ValuedEdge
        })
        .filter(
          ([liquidity, e]) =>
            liquidity >= minLiquidity || e.pool.alwaysAppropriateForPricing(),
        )
      nextEdges = fastArrayMerge(nextEdges, newEdges)
      processedVert.add(v)
    }

    if (logging)
      console.log(`Pricing: Initial token ${from.token.symbol} price=${price}`)
    addVertice(from, price)
    while (nextEdges.length > 0) {
      const [liquidity, bestEdge] = nextEdges.pop() as ValuedEdge
      const [vFrom, vTo] = processedVert.has(bestEdge.vert1)
        ? [bestEdge.vert1, bestEdge.vert0]
        : [bestEdge.vert0, bestEdge.vert1]
      if (processedVert.has(vTo)) continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(
        vFrom === bestEdge.vert1,
      )
      if (logging)
        console.log(
          `Pricing: + Token ${vTo.token.symbol} price=${vFrom.price * p}` +
            ` from ${vFrom.token.symbol} pool=${bestEdge.pool.address} liquidity=${liquidity}`,
        )
      addVertice(vTo, vFrom.price * p)
    }

    const gasPrice = new Map<number | string | undefined, number>()
    networks.forEach((n) => {
      const vPrice = this.getVert(n.baseToken)?.price || 0
      gasPrice.set(n.chainId, n.gasPrice * vPrice)
    })

    processedVert.forEach((v) => {
      const gasPriceChainId = gasPrice.get(v.token.chainId) as number
      if (gasPriceChainId === undefined)
        console.error(
          `Error 427: token {${v.token.address} ${v.token.symbol}}` +
            ` has unknown chainId ${v.token.chainId} (${typeof v.token
              .chainId}).` +
            `Known chainIds: ${Array.from(gasPrice.keys()).map(
              (k) => `"${k}"(${typeof k})`,
            )}`,
        )
      if (v.price === 0)
        console.error(
          `Error 428: token {${v.token.address} ${v.token.symbol} ${v.token.chainId}} was not priced`,
        )
      v.gasPrice = gasPriceChainId / v.price
    })*/
  }

  _updatePricesForPools(pools: RPool[]) {
    // Auxiliary
    const tokens: (TokenInfo | undefined)[] = new Array(pools.length)

    // set changedPoolIndex for all tokens with changed price + create new priced tokens
    for (let i = pools.length - 1; i >= 0; --i) {
      const token =
        this.poolTokenMap.get(pools[i]?.uniqueID() as Address) ??
        this._checkAndAddNewToken(pools[i] as RPool) // maybe create new priced token
      if (token && token.changedPoolIndex === undefined) {
        tokens[i] = token
        token.changedPoolIndex = i
      } else tokens[i] = undefined // not price-making pool or duplicated pool
    }

    for (let i = pools.length - 1; i >= 0; --i) {
      if (tokens[i] === undefined) continue // just for optimization

      // finding firstChangedToken
      let firstChangedToken: TokenInfo | undefined = undefined
      for (
        let token: TokenInfo | undefined = tokens[i];
        token !== undefined;
        token = token.parent
      ) {
        if (token?.changedPoolIndex !== undefined) firstChangedToken = token
      }

      // update price for firstChangedToken and all dependent tokens
      if (firstChangedToken)
        this._updatePrices(firstChangedToken, 1, pools, tokens)
    }
  }

  // recursive function for token and subtokens prices updating
  private _updatePrices(
    token: TokenInfo,
    priceMultiplicator: number,
    pools: RPool[],
    tokens: (TokenInfo | undefined)[],
  ) {
    const poolIndex = token.changedPoolIndex
    if (poolIndex !== undefined) {
      // update priceMultiplicator and poolPrice
      const newPoolPrice = pools[poolIndex]?.calcCurrentPriceWithoutFee(
        token.direction,
      ) as number
      priceMultiplicator = (priceMultiplicator / token.poolPrice) * newPoolPrice
      tokens[poolIndex] = undefined
      // @ts-ignore
      token.changedPoolIndex = undefined
      token.poolPrice = newPoolPrice
    }

    // update price
    this.prices[token.address] *= priceMultiplicator

    for (let i = token.children.length - 1; i >= 0; --i)
      this._updatePrices(
        token.children[i] as TokenInfo,
        priceMultiplicator,
        pools,
        tokens,
      )
  }

  private _checkAndAddNewToken(pool: RPool): TokenInfo | undefined {
    const price0 = this.prices[pool.token0.address]
    const price1 = this.prices[pool.token1.address]
    if (price1 === undefined) {
      if (price0 === undefined) return // both tokens are unpriced
      const liquidity =
        (Number(pool.reserve0) * price0) / 10 ** pool.token0.decimals
      if (liquidity < this.minLiquidity) return // too low liquidity for pricing
      return this._addNewToken(pool, true, price0)
    } else {
      if (price0 !== undefined) return // both tokens are priced
      const liquidity =
        (Number(pool.reserve1) * price1) / 10 ** pool.token1.decimals
      if (liquidity < this.minLiquidity) return // too low liquidity for pricing
      return this._addNewToken(pool, false, price1)
    }
  }

  private _addNewToken(
    pool: RPool,
    direction: boolean,
    priceFrom: number,
  ): TokenInfo {
    let addrFrom = pool.token0.address as Address
    let addrTo = pool.token1.address as Address
    if (direction === false) {
      const tmp = addrFrom
      addrFrom = addrTo
      addrTo = tmp
    }
    const tokenInfo: TokenInfo = new TokenInfo(
      addrTo,
      [],
      direction,
      pool.calcCurrentPriceWithoutFee(direction),
      this.tokenMap.get(addrFrom) as TokenInfo,
    )
    tokenInfo.parent?.children?.push(tokenInfo)
    this.poolTokenMap.set(pool.uniqueID(), tokenInfo)
    this.tokenMap.set(addrTo, tokenInfo)
    this.prices[addrTo] = priceFrom * tokenInfo.poolPrice
    return tokenInfo
  }
}
