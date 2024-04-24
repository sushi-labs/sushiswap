import { Address } from 'viem'
import { PoolType, RPool, RToken, setTokenId } from './RPool.js'
import { StableSwapRPool } from './StableSwapPool.js'
import {
  ASSERT,
  DEBUG,
  closeValues,
  fastArrayMerge,
  getBigInt,
} from './Utils.js'

const ROUTER_DISTRIBUTION_PORTION = 65535

// Routing info about each one swap
export interface RouteLeg {
  poolType: PoolType
  poolAddress: Address // which pool use for swap
  uniqueId: string // pool.uniqueId
  poolFee: number

  tokenFrom: RToken // from what token to swap
  tokenTo: RToken // to what token

  assumedAmountIn: number // assumed number of input token for swapping
  assumedAmountOut: number // assumed number of output token after swapping

  swapPortion: number // for router contract
  absolutePortion: number // to depict at webpage for user
}

export enum RouteStatus {
  Success = 'Success',
  NoWay = 'NoWay',
  Partial = 'Partial',
}

export interface MultiRoute {
  status: RouteStatus
  fromToken: RToken
  toToken: RToken
  primaryPrice: number | undefined
  swapPrice: number | undefined
  priceImpact: number | undefined
  amountIn: number
  amountInBI: bigint
  amountOut: number
  amountOutBI: bigint
  legs: RouteLeg[]
  gasSpent: number
  totalAmountOut: number
  totalAmountOutBI: bigint
}

export function NoWayMultiRoute(from: RToken, to: RToken) {
  return {
    status: RouteStatus.NoWay,
    fromToken: from,
    toToken: to,
    amountIn: 0,
    amountInBI: 0n,
    amountOut: 0,
    amountOutBI: 0n,
    legs: [],
    gasSpent: 0,
    totalAmountOut: 0,
    totalAmountOutBI: 0n,
    primaryPrice: undefined,
    swapPrice: undefined,
    priceImpact: undefined,
  } as MultiRoute
}

// Tines input info about blockchains
export interface NetworkInfo {
  chainId: number | string | undefined
  baseToken: RToken // native coin of the blockchain, or its wrapper, for example: WETH, MATIC
  //baseTokenPrice: number // price of baseToke, in $ for example
  gasPrice: number // current gas price, in baseToken. For example, if gas costs 17Gwei then gasPrice is 17*1e9
}

export class Edge {
  pool: RPool
  vert0: Vertice
  vert1: Vertice

  canBeUsed: boolean
  direction: boolean
  amountInPrevious: number // How many liquidity were passed from vert0 to vert1
  amountOutPrevious: number // How many liquidity were passed from vert0 to vert1
  spentGas: number // How much gas was spent for this edge
  spentGasNew: number //  How much gas will be spent for this edge
  bestEdgeIncome: number // debug data

  constructor(p: RPool, v0: Vertice, v1: Vertice) {
    this.pool = p
    this.vert0 = v0
    this.vert1 = v1
    this.amountInPrevious = 0
    this.amountOutPrevious = 0
    this.canBeUsed = true
    this.direction = true
    this.spentGas = 0
    this.spentGasNew = 0
    this.bestEdgeIncome = 0
  }

  cleanTmpData() {
    this.amountInPrevious = 0
    this.amountOutPrevious = 0
    this.canBeUsed = true
    this.direction = true
    this.spentGas = 0
    this.spentGasNew = 0
    this.bestEdgeIncome = 0
    this.pool.cleanTmpData()
  }

  reserve(v: Vertice): bigint {
    return v === this.vert0 ? this.pool.getReserve0() : this.pool.getReserve1()
  }

  calcOutput(v: Vertice, amountIn: number): { out: number; gasSpent: number } {
    let res
    let gas
    if (v === this.vert1) {
      if (this.direction) {
        if (amountIn < this.amountOutPrevious) {
          const { inp, gasSpent } = this.pool.calcInByOut(
            this.amountOutPrevious - amountIn,
            true,
          )
          res = this.amountInPrevious - inp
          gas = gasSpent
        } else {
          const { out, gasSpent } = this.pool.calcOutByIn(
            amountIn - this.amountOutPrevious,
            false,
          )
          res = out + this.amountInPrevious
          gas = gasSpent
        }
      } else {
        const { out, gasSpent } = this.pool.calcOutByIn(
          this.amountOutPrevious + amountIn,
          false,
        )
        res = out - this.amountInPrevious
        gas = gasSpent
      }
    } else {
      if (this.direction) {
        const { out, gasSpent } = this.pool.calcOutByIn(
          this.amountInPrevious + amountIn,
          true,
        )
        res = out - this.amountOutPrevious
        gas = gasSpent
      } else {
        if (amountIn < this.amountInPrevious) {
          const { inp, gasSpent } = this.pool.calcInByOut(
            this.amountInPrevious - amountIn,
            false,
          )
          res = this.amountOutPrevious - inp
          gas = gasSpent
        } else {
          const { out, gasSpent } = this.pool.calcOutByIn(
            amountIn - this.amountInPrevious,
            true,
          )
          res = out + this.amountOutPrevious
          gas = gasSpent
        }
      }
    }

    // this.testApply(v, amountIn, out);

    return { out: res, gasSpent: gas - this.spentGas }
  }

  calcInput(v: Vertice, amountOut: number): { inp: number; gasSpent: number } {
    let res
    let gas
    if (v === this.vert1) {
      if (!this.direction) {
        if (amountOut < this.amountOutPrevious) {
          const { out, gasSpent } = this.pool.calcOutByIn(
            this.amountOutPrevious - amountOut,
            false,
          )
          res = this.amountInPrevious - out
          gas = gasSpent
        } else {
          const { inp, gasSpent } = this.pool.calcInByOut(
            amountOut - this.amountOutPrevious,
            true,
          )
          res = inp + this.amountInPrevious
          gas = gasSpent
        }
      } else {
        const { inp, gasSpent } = this.pool.calcInByOut(
          this.amountOutPrevious + amountOut,
          true,
        )
        res = inp - this.amountInPrevious
        gas = gasSpent
      }
    } else {
      if (!this.direction) {
        const { inp, gasSpent } = this.pool.calcInByOut(
          this.amountInPrevious + amountOut,
          false,
        )
        res = inp - this.amountOutPrevious
        gas = gasSpent
      } else {
        if (amountOut < this.amountInPrevious) {
          const { out, gasSpent } = this.pool.calcOutByIn(
            this.amountInPrevious - amountOut,
            true,
          )
          res = this.amountOutPrevious - out
          gas = gasSpent
        } else {
          const { inp, gasSpent } = this.pool.calcInByOut(
            amountOut - this.amountInPrevious,
            false,
          )
          res = inp + this.amountOutPrevious
          gas = gasSpent
        }
      }
    }

    // this.testApply(v, amountIn, out);

    return { inp: res, gasSpent: gas - this.spentGas }
  }

  checkMinimalLiquidityExceededAfterSwap(
    from: Vertice,
    amountOut: number,
  ): boolean {
    if (from === this.vert0) {
      const r1 = parseInt(this.pool.getReserve1().toString())
      if (this.direction) {
        return r1 - amountOut - this.amountOutPrevious < this.pool.minLiquidity
      } else {
        return r1 - amountOut + this.amountOutPrevious < this.pool.minLiquidity
      }
    } else {
      const r0 = parseInt(this.pool.getReserve0().toString())
      if (this.direction) {
        return r0 - amountOut + this.amountInPrevious < this.pool.minLiquidity
      } else {
        return r0 - amountOut - this.amountInPrevious < this.pool.minLiquidity
      }
    }
  }

  // doesn't used in production - just for testing
  testApply(from: Vertice, amountIn: number, amountOut: number) {
    console.assert(this.amountInPrevious * this.amountOutPrevious >= 0)
    const inPrev = this.direction
      ? this.amountInPrevious
      : -this.amountInPrevious
    const outPrev = this.direction
      ? this.amountOutPrevious
      : -this.amountOutPrevious
    const to = from.getNeibour(this)
    let directionNew
    let amountInNew = 0
    let amountOutNew = 0
    if (to) {
      const inInc = from === this.vert0 ? amountIn : -amountOut
      const outInc = from === this.vert0 ? amountOut : -amountIn
      const inNew = inPrev + inInc
      const outNew = outPrev + outInc
      console.assert(inNew * outNew >= 0)
      if (inNew >= 0) {
        directionNew = true
        amountInNew = inNew
        amountOutNew = outNew
      } else {
        directionNew = false
        amountInNew = -inNew
        amountOutNew = -outNew
      }
    } else console.error('Error 221')

    if (directionNew) {
      const calc = this.pool.calcOutByIn(amountInNew, true).out
      const res = closeValues(amountOutNew, calc, 1e-6)
      if (!res)
        console.log(
          'Err 225-1 !!',
          amountOutNew,
          calc,
          Math.abs(calc / amountOutNew - 1),
        )
      return res
    } else {
      const calc = this.pool.calcOutByIn(amountOutNew, false).out
      const res = closeValues(amountInNew, calc, 1e-6)
      if (!res)
        console.log(
          'Err 225-2!!',
          amountInNew,
          calc,
          Math.abs(calc / amountInNew - 1),
        )
      return res
    }
  }

  applySwap(from: Vertice) {
    console.assert(this.amountInPrevious * this.amountOutPrevious >= 0)
    const inPrev = this.direction
      ? this.amountInPrevious
      : -this.amountInPrevious
    const outPrev = this.direction
      ? this.amountOutPrevious
      : -this.amountOutPrevious
    const to = from.getNeibour(this)
    const inInc =
      from === this.vert0 ? from.bestIncome : -(to as Vertice).bestIncome
    const outInc =
      from === this.vert0 ? (to as Vertice).bestIncome : -from.bestIncome
    const inNew = inPrev + inInc
    const outNew = outPrev + outInc
    console.assert(inNew * outNew >= 0)
    if (inNew >= 0) {
      this.direction = true
      this.amountInPrevious = inNew
      this.amountOutPrevious = outNew
    } else {
      this.direction = false
      this.amountInPrevious = -inNew
      this.amountOutPrevious = -outNew
    }
    this.pool.setCurrentFlow(inNew, -outNew, this.spentGasNew)
    this.spentGas = this.spentGasNew

    ASSERT(() => {
      let precision = Math.max(
        1 / this.amountOutPrevious,
        1 / this.amountInPrevious,
        1e-9,
      )
      if (precision === Infinity) precision = 1e-9
      if (this.pool instanceof StableSwapRPool) {
        let price = this.pool.calcCurrentPriceWithoutFee(true)
        if (price < 1) price = 1 / price
        if (price > 1e8) {
          // precision degradation for extreme conditions. Almost impossible situation in production
          precision = 2e-3
        }
      }
      // if (this.pool instanceof CurveMultitokenPool)
      //   console.log(this.amountInPrevious, this.amountOutPrevious, this.direction, this.pool.flow0, this.pool.flow1)
      if (this.direction) {
        const granularity = this.pool.granularity1()
        return closeValues(
          this.amountOutPrevious / granularity,
          this.pool.calcOutByIn(this.amountInPrevious, this.direction).out /
            granularity,
          precision,
        )
      } else {
        const granularity = this.pool.granularity0()
        return closeValues(
          this.amountInPrevious / granularity,
          this.pool.calcOutByIn(this.amountOutPrevious, this.direction).out /
            granularity,
          precision,
        )
      }
    }, 'Error 225')
  }
}

export class Vertice {
  token: RToken
  edges: Edge[]

  price: number
  gasPrice: number

  bestIncome: number // temp data used for findBestPath algorithm
  gasSpent: number // temp data used for findBestPath algorithm
  bestTotal: number // temp data used for findBestPath algorithm
  bestSource: Edge | undefined // temp data used for findBestPath algorithm
  checkLine: number // debug data

  constructor(t: RToken) {
    this.token = t
    setTokenId(this.token)
    this.edges = []
    this.price = 0
    this.gasPrice = 0
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  cleanTmpData() {
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  getNeibour(e?: Edge) {
    if (!e) return undefined
    return e.vert0 === this ? e.vert1 : e.vert0
  }

  getOutputEdges(): Edge[] {
    return this.edges.filter((e) => {
      if (!e.canBeUsed) return false
      if (e.amountInPrevious === 0) return false
      if (e.direction !== (e.vert0 === this)) return false
      return true
    })
  }

  getInputEdges(): Edge[] {
    return this.edges.filter((e) => {
      if (!e.canBeUsed) return false
      if (e.amountInPrevious === 0) return false
      if (e.direction === (e.vert0 === this)) return false
      return true
    })
  }
}

export class Graph {
  vertices: Vertice[]
  edges: Edge[]
  private tokens: Map<string, Vertice>

  // Single network usage: (pools, baseToken, gasPrice)
  // Multiple Network usage: (pools, networks)
  constructor(
    pools: RPool[],
    start: RToken,
    baseTokenOrNetworks: RToken | NetworkInfo[],
    gasPriceSingleNetwork?: number,
    minPriceLiquidity = 0,
    priceLogging = false,
  ) {
    const networks: NetworkInfo[] = Array.isArray(baseTokenOrNetworks)
      ? baseTokenOrNetworks
      : [
          {
            chainId: baseTokenOrNetworks.chainId,
            baseToken: baseTokenOrNetworks,
            //baseTokenPrice: 1,
            gasPrice: gasPriceSingleNetwork || 0,
          },
        ]

    setTokenId(...networks.map((n) => n.baseToken))
    this.vertices = []
    this.edges = []
    this.tokens = new Map()
    pools.forEach((p) => {
      const v0 = this.getOrCreateVertice(p.token0)
      const v1 = this.getOrCreateVertice(p.token1)
      const edge = new Edge(p, v0, v1)
      v0.edges.push(edge)
      v1.edges.push(edge)
      this.edges.push(edge)
    })
    // networks.forEach((n) => {
    //   const baseVert = this.getVert(n.baseToken)
    //   if (baseVert) {
    //     this.setPricesStable(baseVert, n.baseTokenPrice, n.gasPrice, true)
    //   }
    // })
    const startV = this.getVert(start)
    if (startV !== undefined)
      this.setPricesStable(startV, 1, networks, minPriceLiquidity, priceLogging)
  }

  getVert(t: RToken): Vertice | undefined {
    return this.tokens.get(t.tokenId as string)
  }

  cleanTmpData() {
    this.edges.forEach((e) => e.cleanTmpData())
    this.vertices.forEach((v) => v.cleanTmpData())
  }

  // Set prices using greedy algorithm
  /*setPricesStable(
    from: Vertice,
    price: number,
    networks: NetworkInfo[],
    minLiquidity = 0,
    logging = false,
  ) {
    const processedVert = new Set<Vertice>()
    let nextEdges: Edge[] = []
    const edgeValues = new Map<Edge, number>()
    const value = (e: Edge): number => edgeValues.get(e) as number

    function addVertice(v: Vertice, price: number) {
      v.price = price
      const newEdges = v.edges.filter((e) => {
        if (processedVert.has(v.getNeibour(e) as Vertice)) return false
        const liquidity = price * Number(e.reserve(v))
        if (!e.pool.alwaysAppropriateForPricing() && liquidity < minLiquidity)
          return false
        edgeValues.set(e, liquidity)
        return true
      })
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0] as Edge) < value(newEdges[0] as Edge))
          res.push(nextEdges.shift() as Edge)
        else res.push(newEdges.shift() as Edge)
      }
      nextEdges = [...res, ...nextEdges, ...newEdges]
      processedVert.add(v)
    }

    if (logging)
      console.log(`Pricing: Initial token ${from.token.symbol} price=${price}`)
    addVertice(from, price)
    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as Edge
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
            ` from ${vFrom.token.symbol} pool=${
              bestEdge.pool.address
            } liquidity=${edgeValues.get(bestEdge)}`,
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
      console.assert(
        gasPriceChainId !== undefined,
        `Error 427: token {${v.token.address} ${v.token.symbol}}` +
          ` has unknown chainId ${v.token.chainId} (${typeof v.token
            .chainId}).` +
          `Known chainIds: ${Array.from(gasPrice.keys()).map(
            (k) => `"${k}"(${typeof k})`,
          )}`,
      )
      console.assert(
        v.price !== 0,
        `Error 428: token {${v.token.address} ${v.token.symbol} ${v.token.chainId}} was not priced`,
      )
      v.gasPrice = gasPriceChainId / v.price
    })
  }*/

  // Set prices using greedy algorithm
  setPricesStable(
    from: Vertice,
    price: number,
    networks: NetworkInfo[],
    minLiquidity = 0,
    logging = false,
  ) {
    const processedVert = new Set<Vertice>()
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
    })
  }

  getPriceReasoning(
    from: RToken,
    price: number,
    token: Address,
    minLiquidity = 0,
  ): string[] {
    type PricingStepInfo = {
      parent: PricingStepInfo | undefined
      vert: Vertice
      price: number
      poolPrice: number
      liquidity: number
      edge: Edge | undefined
    }

    const processedVert = new Set<Vertice>()
    const vertToPricingInfo = new Map<Vertice | undefined, PricingStepInfo>()
    type ValuedEdge = [number, Edge]
    let nextEdges: ValuedEdge[] = []

    function addVertice(
      parent: Vertice | undefined,
      v: Vertice,
      price: number,
      poolPrice: number,
      liquidity: number,
      edge: Edge | undefined,
    ) {
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
      vertToPricingInfo.set(v, {
        parent: vertToPricingInfo.get(parent),
        vert: v,
        price,
        poolPrice,
        liquidity,
        edge,
      })
    }

    setTokenId(from)
    addVertice(
      undefined,
      this.tokens.get(from.tokenId as string) as Vertice,
      price / 10 ** from.decimals,
      1,
      0,
      undefined,
    )
    while (nextEdges.length > 0) {
      const [liquidity, bestEdge] = nextEdges.pop() as ValuedEdge
      const [vFrom, vTo] = processedVert.has(bestEdge.vert1)
        ? [bestEdge.vert1, bestEdge.vert0]
        : [bestEdge.vert0, bestEdge.vert1]
      if (processedVert.has(vTo)) continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(
        vFrom === bestEdge.vert1,
      )
      const pPrice = vertToPricingInfo.get(vFrom)?.price as number
      addVertice(vFrom, vTo, pPrice * p, p, liquidity, bestEdge)
      if (vTo.token.address === token) {
        const lines: string[] = []
        let t = vertToPricingInfo.get(vTo)
        while (t !== undefined) {
          const dec = t.vert.token.decimals
          const parentDecExp = t.parent?.vert.token.decimals ?? dec
          lines.push(
            `Token ${t.vert.token.symbol} (${t.vert.token.address}) price is ${
              t.price * 10 ** dec
            }$`,
          )
          if (t.edge !== undefined) {
            lines.push(
              `Pool ${t.edge.pool.address} liquidity ${Math.round(
                t.liquidity,
              )}$ price ${(t.poolPrice / 10 ** parentDecExp) * 10 ** dec}`,
            )
          }
          t = t.parent
        }
        return lines.reverse()
      }
    }

    return ['Token is not priced']
  }

  // Set prices using greedy algorithm
  setPricesStableInsideChain(from: Vertice, price: number, gasPrice: number) {
    const processedVert = new Set()
    let nextEdges: Edge[] = []
    const edgeValues = new Map<Edge, number>()
    const value = (e: Edge): number => edgeValues.get(e) as number

    function addVertice(v: Vertice, price: number, gasPrice: number) {
      v.price = price
      v.gasPrice = gasPrice
      const newEdges = v.edges.filter((e) => {
        const newV = v.getNeibour(e)
        return (
          newV?.token.chainId === v.token.chainId &&
          !processedVert.has(v.getNeibour(e) as Vertice)
        )
      })
      newEdges.forEach((e) =>
        edgeValues.set(e, price * parseInt(e.reserve(v).toString())),
      )
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0] as Edge) < value(newEdges[0] as Edge))
          res.push(nextEdges.shift() as Edge)
        else res.push(newEdges.shift() as Edge)
      }
      nextEdges = [...res, ...nextEdges, ...newEdges]
      processedVert.add(v)
    }

    addVertice(from, price, gasPrice)
    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as Edge
      const [vFrom, vTo] = processedVert.has(bestEdge.vert1)
        ? [bestEdge.vert1, bestEdge.vert0]
        : [bestEdge.vert0, bestEdge.vert1]
      if (processedVert.has(vTo)) continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(
        vFrom === bestEdge.vert1,
      )
      addVertice(vTo, vFrom.price * p, vFrom.gasPrice / p)
    }
  }

  // Set prices by search in depth
  setPrices(from: Vertice, price: number, gasPrice: number) {
    if (from.price !== 0) return
    from.price = price
    from.gasPrice = gasPrice
    const edges = from.edges
      .map((e): [Edge, number] => [e, parseInt(e.reserve(from).toString())])
      .sort(([, r1], [, r2]) => r2 - r1)
    edges.forEach(([e]) => {
      const v = e.vert0 === from ? e.vert1 : e.vert0
      if (v.price !== 0) return
      const p = e.pool.calcCurrentPriceWithoutFee(from === e.vert1)
      this.setPrices(v, price * p, gasPrice / p)
    })
  }

  getOrCreateVertice(token: RToken) {
    let vert = this.getVert(token)
    if (vert) return vert
    vert = new Vertice(token)
    this.vertices.push(vert)
    this.tokens.set(token.tokenId as string, vert)
    return vert
  }

  /*exportPath(from: RToken, to: RToken) {

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const initValue = (fromVert.bestIncome * fromVert.price) / toVert.price

    const route = new Set<Edge>()
    for (let v = toVert; v !== fromVert; v = v.getNeibour(v.bestSource) as Vertice) {
      if (v.bestSource) route.add(v.bestSource)
    }

    function edgeStyle(e: Edge) {
      const finish = e.vert1.bestSource === e
      const start = e.vert0.bestSource === e
      let label
      if (e.bestEdgeIncome === -1) label = 'label: "low_liq"'
      if (e.bestEdgeIncome !== 0) label = `label: "${print((e.bestEdgeIncome / initValue - 1) * 100, 3)}%"`
      const edgeValue = route.has(e) ? 'value: 2' : undefined
      let arrow
      if (finish && start) arrow = 'arrows: "from,to"'
      if (finish) arrow = 'arrows: "to"'
      if (start) arrow = 'arrows: "from"'
      return ['', label, edgeValue, arrow].filter((a) => a !== undefined).join(', ')
    }

    function print(n: number, digits: number) {
      let out
      if (n === 0) out = '0'
      else {
        const n0 = n > 0 ? n : -n
        const shift = digits - Math.ceil(Math.log(n0) / Math.LN10)
        if (shift <= 0) out = `${Math.round(n0)}`
        else {
          const mult = Math.pow(10, shift)
          out = `${Math.round(n0 * mult) / mult}`
        }
        if (n < 0) out = -out
      }
      return out
    }

    function nodeLabel(v: Vertice) {
      const value = (v.bestIncome * v.price) / toVert.price
      const income = `${print(value, 3)}`
      const total = `${print(v.bestTotal, 3)}`
      // const income = `${print((value/initValue-1)*100, 3)}%`
      // const total = `${print((v.bestTotal/initValue-1)*100, 3)}%`
      const checkLine = v.checkLine === -1 ? undefined : `${v.checkLine}`
      return [checkLine, income, total].filter((a) => a !== undefined).join(':')
    }

    const nodes = `var nodes = new vis.DataSet([
      ${this.vertices.map((t) => `{ id: ${t.token.name}, label: "${nodeLabel(t)}"}`).join(',\n\t\t')}
    ]);\n`
    const edges = `var edges = new vis.DataSet([
      ${this.edges
        .map((p) => `{ from: ${p.vert0.token.name}, to: ${p.vert1.token.name}${edgeStyle(p)}}`)
        .join(',\n\t\t')}
    ]);\n`
    const data = `var data = {
        nodes: nodes,
        edges: edges,
    };\n`

    // TODO: This should be removed, this pacakge will not be installable on a client while this remains.
    const fs = require("fs");
    fs.writeFileSync(
      "D:/Info/Notes/GraphVisualization/data.js",
      nodes + edges + data
    );
  }*/

  findBestPathExactIn(
    from: RToken,
    to: RToken,
    amountIn: number,
  ):
    | {
        path: Edge[]
        output: number
        gasSpent: number
        totalOutput: number
      }
    | undefined {
    const start = this.getVert(from)
    const finish = this.getVert(to)
    if (!start || !finish || Number.isNaN(finish.price)) return undefined

    this.edges.forEach((e) => {
      e.bestEdgeIncome = 0
      e.spentGasNew = 0
    })
    this.vertices.forEach((v) => {
      v.bestIncome = 0
      v.gasSpent = 0
      v.bestTotal = 0
      v.bestSource = undefined
      v.checkLine = -1
    })
    start.bestIncome = amountIn
    start.bestTotal = amountIn
    const processedVert = new Set<Vertice>()
    const nextVertList = [start] // TODO: Use sorted Set!

    let debug_info = ''
    let checkLine = 0
    for (;;) {
      let closestVert: Vertice | undefined
      let closestTotal: number | undefined
      let closestPosition = 0
      nextVertList.forEach((v, i) => {
        if (closestTotal === undefined || v.bestTotal > closestTotal) {
          closestTotal = v.bestTotal
          closestVert = v
          closestPosition = i
        }
      })

      if (!closestVert) return undefined

      closestVert.checkLine = checkLine++

      if (closestVert === finish) {
        const bestPath: Edge[] = []
        for (
          let v: Vertice | undefined = finish;
          v?.bestSource;
          v = v.getNeibour(v.bestSource)
        ) {
          bestPath.unshift(v.bestSource)
        }
        DEBUG(() => console.log(debug_info))
        return {
          path: bestPath,
          output: finish.bestIncome,
          gasSpent: finish.gasSpent,
          totalOutput: finish.bestTotal,
        }
      }
      nextVertList.splice(closestPosition, 1)

      closestVert.edges.forEach((e) => {
        const v2 = closestVert === e.vert0 ? e.vert1 : e.vert0
        if (processedVert.has(v2)) return
        // multitoken pool protection. Don't use two pools from one multipool in one path (but is possible in
        // different paths => in one route). It is not better then use one pool (For curve at least)
        // and it is calculated wrong (with no flow applying)
        if (
          e.pool.address === (closestVert as Vertice).bestSource?.pool.address
        )
          return

        let newIncome: number
        let gas
        try {
          const { out, gasSpent } = e.calcOutput(
            closestVert as Vertice,
            (closestVert as Vertice).bestIncome,
          )
          if (!Number.isFinite(out) || !Number.isFinite(gasSpent))
            // Math errors protection
            return

          newIncome = out
          gas = gasSpent
        } catch (_err) {
          // Any arithmetic error or out-of-liquidity
          e.bestEdgeIncome = -1
          return
        }
        // if (e.checkMinimalLiquidityExceededAfterSwap(closestVert as Vertice, newIncome)) {
        //   e.bestEdgeIncome = -1
        //   return
        // }
        const newGasSpent = (closestVert as Vertice).gasSpent + gas
        const price = v2.price / finish.price
        const gasPrice = v2.gasPrice * price
        const newTotal = newIncome * price - newGasSpent * gasPrice

        console.assert(e.bestEdgeIncome === 0, 'Error 373')
        e.bestEdgeIncome = newIncome * price
        e.spentGasNew = e.spentGas + gas

        if (!v2.bestSource) nextVertList.push(v2)
        if (!v2.bestSource || newTotal > v2.bestTotal) {
          DEBUG(() => {
            const st = closestVert?.token === from ? '*' : ''
            const fn = v2?.token === to ? '*' : ''
            debug_info += `${st}${closestVert?.token.name}->${v2.token.name}${fn} ${v2.bestIncome} -> ${newIncome}\n`
          })
          v2.bestIncome = newIncome
          v2.gasSpent = newGasSpent
          v2.bestTotal = newTotal
          v2.bestSource = e
        }
      })
      processedVert.add(closestVert)
    }
  }

  findBestPathExactOut(
    from: RToken,
    to: RToken,
    amountOut: number,
  ):
    | {
        path: Edge[]
        input: number
        gasSpent: number
        totalInput: number
      }
    | undefined {
    const start = this.getVert(to)
    const finish = this.getVert(from)
    if (!start || !finish) return undefined

    this.edges.forEach((e) => {
      e.bestEdgeIncome = 0
      e.spentGasNew = 0
    })
    this.vertices.forEach((v) => {
      v.bestIncome = 0
      v.gasSpent = 0
      v.bestTotal = 0
      v.bestSource = undefined
      v.checkLine = -1
    })
    start.bestIncome = amountOut
    start.bestTotal = amountOut
    const processedVert = new Set<Vertice>()
    const nextVertList = [start] // TODO: Use sorted Set!

    let debug_info = ''
    let checkLine = 0
    for (;;) {
      let closestVert: Vertice | undefined
      let closestTotal: number | undefined
      let closestPosition = 0
      nextVertList.forEach((v, i) => {
        if (closestTotal === undefined || v.bestTotal < closestTotal) {
          closestTotal = v.bestTotal
          closestVert = v
          closestPosition = i
        }
      })

      if (!closestVert) return undefined

      closestVert.checkLine = checkLine++

      if (closestVert === finish) {
        const bestPath: Edge[] = []
        for (
          let v: Vertice | undefined = finish;
          v?.bestSource;
          v = v.getNeibour(v.bestSource)
        ) {
          bestPath.push(v.bestSource)
        }
        DEBUG(() => console.log(debug_info))
        return {
          path: bestPath,
          input: finish.bestIncome,
          gasSpent: finish.gasSpent,
          totalInput: finish.bestTotal,
        }
      }
      nextVertList.splice(closestPosition, 1)

      closestVert.edges.forEach((e) => {
        const v2 = closestVert === e.vert0 ? e.vert1 : e.vert0
        if (processedVert.has(v2)) return
        let newIncome: number
        let gas
        try {
          const { inp, gasSpent } = e.calcInput(
            closestVert as Vertice,
            (closestVert as Vertice).bestIncome,
          )
          if (!Number.isFinite(inp) || !Number.isFinite(gasSpent))
            // Math errors protection
            return
          if (inp < 0) return // No enouph liquidity in the pool
          newIncome = inp
          gas = gasSpent
        } catch (_e) {
          // Any arithmetic error or out-of-liquidity
          return
        }
        const newGasSpent = (closestVert as Vertice).gasSpent + gas
        const price = v2.price / finish.price
        const gasPrice = v2.gasPrice * price
        const newTotal = newIncome * price + newGasSpent * gasPrice

        console.assert(e.bestEdgeIncome === 0, 'Error 373')
        e.bestEdgeIncome = newIncome * price
        e.spentGasNew = e.spentGas + gas

        if (!v2.bestSource) nextVertList.push(v2)
        if (!v2.bestSource || newTotal < v2.bestTotal) {
          DEBUG(() => {
            const st = v2?.token === from ? '*' : ''
            const fn = closestVert?.token === to ? '*' : ''
            debug_info += `${st}${closestVert?.token.name}<-${v2.token.name}${fn} ${v2.bestIncome} -> ${newIncome}\n`
          })
          v2.bestIncome = newIncome
          v2.gasSpent = newGasSpent
          v2.bestTotal = newTotal
          v2.bestSource = e
        }
      })
      processedVert.add(closestVert)
    }
  }

  addPath(from: Vertice | undefined, to: Vertice | undefined, path: Edge[]) {
    let _from = from
    path.forEach((e) => {
      if (_from) {
        e.applySwap(_from)
        _from = _from.getNeibour(e)
      } else {
        console.error('Unexpected 315')
      }
    })

    ASSERT(() => {
      const res = this.vertices.every((v) => {
        let total = 0
        let totalModule = 0
        v.edges.forEach((e) => {
          if (e.vert0 === v) {
            if (e.direction) {
              total -= e.amountInPrevious
            } else {
              total += e.amountInPrevious
            }
            totalModule += e.amountInPrevious
          } else {
            if (e.direction) {
              total += e.amountOutPrevious
            } else {
              total -= e.amountOutPrevious
            }
            totalModule += e.amountOutPrevious
          }
        })
        if (v === from) return total <= 0
        if (v === to) return total >= 0
        if (totalModule === 0) return total === 0
        return Math.abs(total / totalModule) < 1e10
      })
      return res
    }, 'Error 290')
  }

  getPrimaryPriceForPath(from: Vertice, path: Edge[]): number {
    let p = 1
    let prevToken = from
    path.forEach((edge) => {
      const direction = edge.vert0 === prevToken
      const edgePrice = edge.pool.calcCurrentPriceWithoutFee(direction)
      p *= edgePrice
      prevToken = prevToken.getNeibour(edge) as Vertice
    })
    return p
  }

  findBestRouteExactIn(
    from: RToken,
    to: RToken,
    amountIn: bigint | number,
    mode: number | number[],
  ): MultiRoute {
    let amountInBI: bigint
    if (typeof amountIn === 'bigint') {
      amountInBI = amountIn
      amountIn = Number(amountIn)
    } else {
      amountInBI = getBigInt(amountIn)
    }

    let routeValues: number[] = []
    if (Array.isArray(mode)) {
      const sum = mode.reduce((a, b) => a + b, 0)
      routeValues = mode.map((e) => e / sum)
    } else {
      for (let i = 0; i < mode; ++i) routeValues.push(1 / mode)
    }

    this.edges.forEach((e) => {
      e.amountInPrevious = 0
      e.amountOutPrevious = 0
      e.direction = true
      e.pool.cleanTmpData()
    })
    let output = 0
    let gasSpentInit = 0
    let totalOutput = 0
    let totalrouted = 0
    let primaryPrice
    let step
    for (step = 0; step < routeValues.length; ++step) {
      const routeValue = routeValues[step] as number
      const p = this.findBestPathExactIn(from, to, amountIn * routeValue)
      if (!p) {
        break
      } else {
        output += p.output
        gasSpentInit += p.gasSpent
        totalOutput += p.totalOutput
        this.addPath(this.getVert(from), this.getVert(to), p.path)
        totalrouted += routeValue
      }
    }
    if (step === 0 || output === 0) return NoWayMultiRoute(from, to)
    let status
    if (step < routeValues.length) status = RouteStatus.Partial
    else status = RouteStatus.Success

    this.removeEdgesWithLowFlow(0.001)

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const { legs, gasSpent } = this.getRouteLegs(fromVert, toVert)
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    //if (topologyWasChanged || removedEdgesNumber > 0) {
    this.edges.forEach((e) => e.pool.cleanTmpData())
    // const initialOutput = output
    // const assumeZero = legs.some(l => l.assumedAmountOut < 1)
    // if (Math.abs(output - 17947093338.87304) < 1e-3) {
    //   debugger
    // }
    output = this.updateLegsAmountOut(legs, amountIn * totalrouted)
    // const diff = (output - initialOutput)/initialOutput
    // if (Math.abs(diff) > 1e-4 && !assumeZero) console.log(`        Output recalc: ${diff} ${initialOutput}=>${output}`)
    totalOutput = output - toVert.gasPrice * gasSpent
    if (output === 0) {
      status = RouteStatus.NoWay
      totalOutput = 0
    }
    //}

    let swapPrice
    let priceImpact
    try {
      swapPrice = output / amountIn / totalrouted
      const priceTo = this.getVert(to)?.price
      const priceFrom = this.getVert(from)?.price
      primaryPrice = priceTo && priceFrom ? priceFrom / priceTo : undefined
      priceImpact =
        primaryPrice !== undefined ? 1 - swapPrice / primaryPrice : undefined
    } catch (_e) {
      /* skip division by 0 errors*/
    }

    return {
      status,
      fromToken: from,
      toToken: to,
      primaryPrice,
      swapPrice,
      priceImpact,
      amountIn: amountIn * totalrouted,
      amountInBI:
        status === RouteStatus.Success
          ? amountInBI
          : getBigInt(amountIn * totalrouted),
      amountOut: output,
      amountOutBI: getBigInt(output),
      legs,
      gasSpent,
      totalAmountOut: totalOutput,
      totalAmountOutBI: getBigInt(totalOutput),
    }
  }

  findBestRouteExactOut(
    from: RToken,
    to: RToken,
    amountOut: number,
    mode: number | number[],
  ): MultiRoute {
    let routeValues: number[] = []
    if (Array.isArray(mode)) {
      const sum = mode.reduce((a, b) => a + b, 0)
      routeValues = mode.map((e) => e / sum)
    } else {
      for (let i = 0; i < mode; ++i) routeValues.push(1 / mode)
    }

    this.edges.forEach((e) => {
      e.amountInPrevious = 0
      e.amountOutPrevious = 0
      e.direction = true
    })
    let input = 0
    let gasSpentInit = 0
    //let totalInput = 0
    let totalrouted = 0
    let primaryPrice
    let step
    for (step = 0; step < routeValues.length; ++step) {
      const routeValue = routeValues[step] as number
      const p = this.findBestPathExactOut(from, to, amountOut * routeValue)
      if (!p) {
        break
      } else {
        input += p.input
        gasSpentInit += p.gasSpent
        //totalInput += p.totalInput
        this.addPath(this.getVert(from), this.getVert(to), p.path)
        totalrouted += routeValue
        // if (step === 0) {
        //   primaryPrice = this.getPrimaryPriceForPath(this.getVert(from) as Vertice, p.path)
        // }
      }
    }
    if (step === 0) return NoWayMultiRoute(from, to)
    let status
    if (step < routeValues.length) status = RouteStatus.Partial
    else status = RouteStatus.Success

    const removedEdgesNumber = this.removeEdgesWithLowFlow(0.001)

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(
      fromVert,
      toVert,
    )
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged || removedEdgesNumber > 0) {
      input = this.calcLegsAmountIn(legs, amountOut)
    }

    let swapPrice
    let priceImpact
    try {
      swapPrice = amountOut / input
      const priceTo = this.getVert(to)?.price
      const priceFrom = this.getVert(from)?.price
      primaryPrice = priceTo && priceFrom ? priceFrom / priceTo : undefined
      priceImpact =
        primaryPrice !== undefined ? 1 - swapPrice / primaryPrice : undefined
    } catch (_e) {
      /* skip division by 0 errors*/
    }

    return {
      status,
      fromToken: from,
      toToken: to,
      primaryPrice,
      swapPrice,
      priceImpact,
      amountIn: input,
      amountInBI: getBigInt(input),
      amountOut: amountOut * totalrouted,
      amountOutBI: getBigInt(amountOut * totalrouted),
      legs,
      gasSpent,
      totalAmountOut: amountOut - gasSpent * toVert.gasPrice, // TODO: should be totalAmountIn instead !!!!
      totalAmountOutBI: getBigInt(amountOut - gasSpent * toVert.gasPrice), // TODO: should be totalAmountInBI instead !!!!
    }
  }

  getRouteLegs(
    from: Vertice,
    to: Vertice,
  ): {
    legs: RouteLeg[]
    gasSpent: number
    topologyWasChanged: boolean
  } {
    const { vertices, topologyWasChanged } = this.cleanTopology(from, to)
    const legs: RouteLeg[] = []
    let gasSpent = 0
    vertices.forEach((n) => {
      const outEdges = n.getOutputEdges().map((e) => {
        const from = this.edgeFrom(e)
        return from ? [e, from.vert, from.amount] : [e]
      })

      let outAmount = outEdges.reduce((a, b) => a + (b[2] as number), 0)
      if (outAmount <= 0) return

      const total = outAmount

      // IMPORTANT: Casting to Number to avoid compiler bug which for some reason
      // keeps reference to outAmount which is mutated later
      // const total = Number(outAmount)
      // const totalTest = outAmount

      outEdges.forEach((e, i) => {
        const p = e[2] as number
        const quantity = i + 1 === outEdges.length ? 1 : p / outAmount
        const edge = e[0] as Edge
        legs.push({
          poolAddress: edge.pool.address,
          uniqueId: edge.pool.uniqueID(),
          poolType: edge.pool.poolType(),
          poolFee: edge.pool.fee,
          tokenFrom: n.token,
          tokenTo: (n.getNeibour(edge) as Vertice).token,
          assumedAmountIn: edge.direction
            ? edge.amountInPrevious
            : edge.amountOutPrevious,
          assumedAmountOut: edge.direction
            ? edge.amountOutPrevious
            : edge.amountInPrevious,
          swapPortion: quantity,
          absolutePortion: p / total,
        })
        gasSpent += edge.pool.calcOutByIn(
          edge.direction ? edge.amountInPrevious : edge.amountOutPrevious,
          edge.direction,
        ).gasSpent
        // console.debug('before amountOut mutation', { total, outAmount })
        outAmount -= p
        // console.debug('after amountOut mutation', { total, outAmount })
      })
      // console.debug('AFTER', { outAmount, total, totalTest }, outAmount / total)
      console.assert(outAmount / total < 1e-12, 'Error 281')
    })
    return { legs, gasSpent, topologyWasChanged }
  }

  edgeFrom(e: Edge): { vert: Vertice; amount: number } | undefined {
    if (e.amountInPrevious === 0) return undefined
    return e.direction
      ? { vert: e.vert0, amount: e.amountInPrevious }
      : { vert: e.vert1, amount: e.amountOutPrevious }
  }

  // Removes all edges that have lesser than minFraction portion of vertex output liquidity
  // Such edges can appear as an accumulation of forward and backward streams
  // They spend more gas than provide slippage reduction
  // They confuse users
  // Also, route processor can fail trying to process them
  removeEdgesWithLowFlow(minFraction: number): number {
    const weakEdgeList: Edge[] = []
    this.vertices.forEach((v) => {
      const outEdges = v.getOutputEdges()
      if (outEdges.length <= 1) return
      const amounts = outEdges.map((e) => {
        const data = this.edgeFrom(e)
        if (data !== undefined) return data.amount
        console.error('Tines: Internal Error 1123')
        return undefined
      }) as number[]
      const totalOut = amounts.reduce((a, b) => {
        a += b
        return a
      }, 0)
      outEdges.forEach((e, i) => {
        if ((amounts[i] as number) / totalOut < minFraction)
          weakEdgeList.push(e)
      })
    })
    weakEdgeList.forEach((e) => {
      e.canBeUsed = false
    })
    return weakEdgeList.length
  }

  // returns route output
  updateLegsAmountOut(legs: RouteLeg[], amountIn: number): number {
    if (legs.length === 0) return 0
    const amounts = new Map<string, number>()
    amounts.set((legs[0] as RouteLeg).tokenFrom.tokenId as string, amountIn)
    legs.forEach((l) => {
      const vert = this.getVert(l.tokenFrom)
      console.assert(vert !== undefined, 'Internal Error 570')
      const edge = (vert as Vertice).edges.find(
        (e) => e.pool.uniqueID() === l.uniqueId,
      )
      console.assert(edge !== undefined, 'Internel Error 569')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert0

      const inputTotal = amounts.get(l.tokenFrom.tokenId as string)
      console.assert(inputTotal !== undefined, 'Internal Error 564')
      const routerPortion =
        Math.round(l.swapPortion * ROUTER_DISTRIBUTION_PORTION) /
        ROUTER_DISTRIBUTION_PORTION
      const input = Math.floor((inputTotal as number) * routerPortion)
      amounts.set(l.tokenFrom.tokenId as string, (inputTotal as number) - input)
      const output = pool.calcOutByInReal(input, direction)

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.tokenId as string)
      amounts.set(vertNext.token.tokenId as string, (prevAmount || 0) + output)

      l.assumedAmountIn = input
      l.assumedAmountOut = output
    })
    return (
      amounts.get(
        (legs[legs.length - 1] as RouteLeg).tokenTo.tokenId as string,
      ) || 0
    )
  }

  // TODO: make full test coverage!
  calcLegsAmountIn(legs: RouteLeg[], amountOut: number) {
    const totalOutputAssumed = new Map<string, number>()
    legs.forEach((l) => {
      const prevValue =
        totalOutputAssumed.get(l.tokenFrom.tokenId as string) || 0
      totalOutputAssumed.set(
        l.tokenFrom.tokenId as string,
        prevValue + l.assumedAmountOut,
      )
    })

    const amounts = new Map<string, number>()
    amounts.set(
      (legs[legs.length - 1] as RouteLeg).tokenTo.tokenId as string,
      amountOut,
    )
    for (let i = legs.length - 1; i >= 0; --i) {
      const l = legs[i] as RouteLeg
      const vert = this.getVert(l.tokenTo)
      console.assert(vert !== undefined, 'Internal Error 884')
      const edge = (vert as Vertice).edges.find(
        (e) => e.pool.uniqueID() === l.uniqueId,
      )
      console.assert(edge !== undefined, 'Internel Error 888')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert1

      const outputTotal = amounts.get(l.tokenTo.tokenId as string)
      console.assert(outputTotal !== undefined, 'Internal Error 893')
      const totalAssumed = totalOutputAssumed.get(l.tokenFrom.tokenId as string)
      console.assert(totalAssumed !== undefined, 'Internal Error 903')
      const output =
        ((outputTotal as number) * l.assumedAmountOut) /
        (totalAssumed as number)
      const input = pool.calcInByOut(output, direction).inp

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.tokenId as string)
      amounts.set(vertNext.token.tokenId as string, (prevAmount || 0) + input)
    }
    return amounts.get((legs[0] as RouteLeg).tokenFrom.tokenId as string) || 0
  }

  // removes all cycles if there are any, then removes all dead end could appear after cycle removing
  // Returns clean result topologically sorted
  cleanTopology(
    from: Vertice,
    to: Vertice,
  ): { vertices: Vertice[]; topologyWasChanged: boolean } {
    let topologyWasChanged = false
    let result = this.topologySort(from, to)
    if (result.status !== 2) {
      topologyWasChanged = true
      // it can be 3, because we make this.removeEdgesWithLowFlow(0.005) before
      // console.assert(result.status === 0, 'Internal Error 554')
      while (result.status === 0) {
        this.removeWeakestEdge(result.vertices)
        result = this.topologySort(from, to)
      }
      if (result.status === 3) {
        this.removeDeadEnds(result.vertices)
        result = this.topologySort(from, to)
      }
      console.assert(result.status === 2, 'Internal Error 563')
      if (result.status !== 2) return { vertices: [], topologyWasChanged }
    }
    return { vertices: result.vertices, topologyWasChanged }
  }

  removeDeadEnds(verts: Vertice[]) {
    verts.forEach((v) => {
      v.getInputEdges().forEach((e) => {
        e.canBeUsed = false
      })
    })
  }

  removeWeakestEdge(verts: Vertice[]) {
    let minVert: Vertice | undefined = undefined
    let minVertNext: Vertice
    let minOutput = Number.MAX_VALUE
    verts.forEach((v1, i) => {
      const v2 = i === 0 ? verts[verts.length - 1] : verts[i - 1]
      let out = 0
      v1.getOutputEdges().forEach((e) => {
        if (v1.getNeibour(e) !== v2) return
        out += e.direction ? e.amountOutPrevious : e.amountInPrevious
      })
      if (out < minOutput) {
        minVert = v1
        minVertNext = v2 as Vertice
        minOutput = out
      }
    })

    if (minVert !== undefined)
      (minVert as Vertice).getOutputEdges().forEach((e) => {
        if ((minVert as Vertice).getNeibour(e) !== minVertNext) return
        e.canBeUsed = false
      })
  }

  // topological sort
  // if there is a cycle - returns [0, <List of envolved vertices in the cycle>]
  // if there are no cycles but deadends- returns [3, <List of all envolved deadend vertices>]
  // if there are no cycles or deadends- returns [2, <List of all envolved vertices topologically sorted>]
  topologySort(
    from: Vertice,
    to: Vertice,
  ): { status: number; vertices: Vertice[] } {
    // undefined or 0 - not processed, 1 - in process, 2 - finished, 3 - dedend
    const vertState = new Map<Vertice, number>()
    const vertsFinished: Vertice[] = []
    const foundCycle: Vertice[] = []
    const foundDeadEndVerts: Vertice[] = []

    // 0 - cycle was found and created, return
    // 1 - during cycle creating
    // 2 - vertex is processed ok
    // 3 - dead end vertex
    function topSortRecursive(current: Vertice): number {
      const state = vertState.get(current)
      if (state === 2 || state === 3) return state
      if (state === 1) {
        console.assert(foundCycle.length === 0, 'Internal Error 566')
        foundCycle.push(current)
        return 1
      }
      vertState.set(current, 1)

      let successors2Exist = false
      const outEdges = current.getOutputEdges()
      for (let i = 0; i < outEdges.length; ++i) {
        const e = outEdges[i]
        const res = topSortRecursive(current.getNeibour(e) as Vertice)
        if (res === 0) return 0
        if (res === 1) {
          if (foundCycle[0] === current) return 0
          else {
            foundCycle.push(current)
            return 1
          }
        }
        if (res === 2) successors2Exist = true // Ok successors
      }
      if (successors2Exist) {
        console.assert(current !== to, 'Internal Error 589')
        vertsFinished.push(current)
        vertState.set(current, 2)
        return 2
      } else {
        if (current !== to) {
          foundDeadEndVerts.push(current)
          vertState.set(current, 3)
          return 3
        }
        vertsFinished.push(current)
        vertState.set(current, 2)
        return 2
      }
    }

    const res = topSortRecursive(from)
    if (res === 0) return { status: 0, vertices: foundCycle }
    if (foundDeadEndVerts.length)
      return { status: 3, vertices: foundDeadEndVerts }
    ASSERT(() => {
      if (vertsFinished[0] !== to) return false
      if (vertsFinished[vertsFinished.length - 1] !== from) return false
      return true
    }, 'Internal Error 614')
    if (res === 2) return { status: 2, vertices: vertsFinished.reverse() }
    console.assert(true, 'Internal Error 612')
    return { status: 1, vertices: [] }
  }
}
