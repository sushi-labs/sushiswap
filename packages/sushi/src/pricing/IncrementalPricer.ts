import { Address } from 'viem'
import { Token } from '../currency'
import { RPool } from '../tines'
import { PoolEdge, TokenVert, makePoolTokenGraph } from './PoolTokenGraph'

class TokenInfo {
  address: Address
  parent: TokenInfo | undefined
  children: TokenInfo[] = []
  direction: boolean
  poolPrice: number
  changedPoolIndex?: number

  constructor(
    address: Address,
    direction: boolean,
    poolPrice: number,
    parent?: TokenInfo,
  ) {
    this.address = address
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

  isFullPricesRecalcNeeded() {}

  _fullPricesRecalculation(
    baseToken: Token,
    price: number,
    pools: RPool[],
    logging = false,
  ) {
    this.poolTokenMap.clear()
    this.tokenMap.clear()
    this.prices = {}

    this.baseToken = new TokenInfo(baseToken.address, true, 1)
    const baseVert = makePoolTokenGraph(pools, baseToken.address)
    if (baseVert === undefined) return

    const nextEdges: PoolEdge[] = []

    if (logging)
      console.log(`Pricing: Initial token ${baseToken.symbol} price=${price}`)
    baseVert.obj = this.baseToken
    this._addVertice(nextEdges, baseVert, price)

    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as PoolEdge
      let vFrom = bestEdge.token0
      let vTo = bestEdge.token1
      let direction = true
      if (vTo.price !== undefined) {
        if (vFrom.price !== undefined) continue // token already priced
        const tmp = vFrom
        vFrom = vTo
        vTo = tmp
        direction = false
      }
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(!direction)
      if (logging)
        console.log(
          `Pricing: + Token ${vTo.token} price=${(vFrom.price as number) * p}` +
            ` from ${vFrom.token} pool=${bestEdge.pool.address} liquidity=${bestEdge.poolLiquidity}`,
        )
      vTo.obj = new TokenInfo(vTo.token, direction, p, vFrom.obj as TokenInfo)
      this.poolTokenMap.set(bestEdge.pool.uniqueID(), vTo.obj as TokenInfo)
      this._addVertice(nextEdges, vTo, (vFrom.price as number) * p)
    }
  }

  private _addVertice(nextEdges: PoolEdge[], v: TokenVert, price: number) {
    v.price = price
    this.tokenMap.set(v.token, v.obj as TokenInfo)
    this.prices[v.token] = price
    for (let i = v.pools.length - 1; i >= 0; --i) {
      const edge = v.pools[i] as PoolEdge
      if (v.getNeibour(edge).price !== undefined) continue // token already priced
      const liquidity = price * Number(edge.reserve(v))
      edge.poolLiquidity = liquidity
      if (
        liquidity >= this.minLiquidity ||
        edge.pool.alwaysAppropriateForPricing()
      ) {
        let low = 0
        let up = nextEdges.length
        while (low < up) {
          const middle = (low + up) >> 1
          const diff = (nextEdges[middle]?.poolLiquidity as number) - liquidity
          if (diff > 0) up = middle
          else if (diff < 0) low = middle + 1
          else {
            low = middle
            break
          }
        }
        nextEdges.splice(low, 0, edge)
      }
    }
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
