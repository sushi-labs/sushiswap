import { BigNumber } from '@ethersproject/bignumber'

import { ConstantProductRPool, PoolState, RPool, RToken, setTokenId } from './PrimaryPools'
import { StableSwapRPool } from './StableSwapPool'
import { ASSERT, closeValues, DEBUG, getBigNumber } from './Utils'

// Routing info about each one swap
export interface RouteLeg {
  poolType: 'Stable' | 'Classic' | 'Unknown'
  poolAddress: string // which pool use for swap
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
  primaryPrice?: number
  swapPrice?: number
  priceImpact?: number
  amountIn: number
  amountInBN: BigNumber
  amountOut: number
  amountOutBN: BigNumber
  legs: RouteLeg[]
  gasSpent: number
  totalAmountOut: number
  totalAmountOutBN: BigNumber
}

// Tines input info about blockchains
export interface NetworkInfo {
  chainId?: number | string
  baseToken: RToken // native coin of the blockchain, or its wrapper, for example: WETH, MATIC
  //baseTokenPrice: number // price of baseToke, in $ for example
  gasPrice: number // current gas price, in baseToken. For example, if gas costs 17Gwei then gasPrice is 17*1e9
}

export class Edge {
  pool: RPool
  vert0: Vertice
  vert1: Vertice
  vertices: Vertice[]

  poolState?: PoolState
  canBeUsed: boolean
  direction: boolean
  amountInPrevious: number // How many liquidity were passed from vert0 to vert1
  amountOutPrevious: number // How many liquidity were passed from vert0 to vert1
  spentGas: number // How much gas was spent for this edge
  spentGasNew: number //  How much gas was will be spent for this edge
  bestEdgeIncome: number // debug data

  constructor(p: RPool, v0: Vertice, v1: Vertice) {
    this.pool = p
    this.vert0 = v0
    this.vert1 = v1
    this.vertices = [v0, v1]
    v0.addEdge(this, 0)
    v1.addEdge(this, 1)
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
    this.poolState = undefined
  }

  reserve(v: Vertice): BigNumber {
    return v === this.vert0 ? this.pool.getReserve(0) : this.pool.getReserve(1)
  }

  calcOutput(v: Vertice, amountIn: number): { diff: number; gasSpent: number } {
    return this.pool.calcDiff(v === this.vert0 ? 0 : 1, v === this.vert0 ? 1 : 0, amountIn, this.poolState)
  }

  calcInput(v: Vertice, amountOut: number): { diff: number; gasSpent: number } {
    return this.pool.calcDiff(v === this.vert0 ? 0 : 1, v === this.vert0 ? 1 : 0, amountOut, this.poolState)
  }

  applySwap(from: Vertice) {
    console.assert(this.amountInPrevious * this.amountOutPrevious >= 0)
    const inPrev = this.direction ? this.amountInPrevious : -this.amountInPrevious
    const outPrev = this.direction ? this.amountOutPrevious : -this.amountOutPrevious
    const to = from.getNeibour(this)
    if (to) {
      const inInc = from === this.vert0 ? from.bestIncome : -to.bestIncome
      const outInc = from === this.vert0 ? to.bestIncome : -from.bestIncome
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

      if (from == this.vert0)
        this.poolState = this.pool.applyChanges(0, from.bestIncome, 1, -to.bestIncome, this.spentGasNew, this.poolState)
      else
        this.poolState = this.pool.applyChanges(0, -to.bestIncome, 1, from.bestIncome, this.spentGasNew, this.poolState)
    } else console.error('Error 221')
    this.spentGas = this.spentGasNew

    ASSERT(() => {
      if (this.direction) {
        const granularity = this.pool.granularity1()
        return closeValues(
          this.amountOutPrevious / granularity,
          this.pool.calcOutByIn2(this.amountInPrevious, this.direction).out / granularity,
          1e-9
        )
      } else {
        const granularity = this.pool.granularity0()
        return closeValues(
          this.amountInPrevious / granularity,
          this.pool.calcOutByIn2(this.amountOutPrevious, this.direction).out / granularity,
          1e-9,
          `"${this.pool.address}" ${inPrev} ${to?.bestIncome} ${from.bestIncome}`
        )
      }
    }, `Error 225`)
  }

  getFlow(vertice: number) {
    return this.pool.getFlow(vertice, this.poolState)
  }
}

export class Vertice {
  token: RToken
  edges: Edge[]
  placeInEdge: number[]

  price: number
  gasPrice: number

  bestIncome: number // temp data used for findBestPath algorithm
  gasSpent: number // temp data used for findBestPath algorithm
  bestTotal: number // temp data used for findBestPath algorithm
  bestSource?: Edge // temp data used for findBestPath algorithm
  checkLine: number // debug data

  constructor(t: RToken) {
    this.token = t
    setTokenId(this.token)
    this.edges = []
    this.placeInEdge = []
    this.price = 0
    this.gasPrice = 0
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  addEdge(e: Edge, place: number) {
    this.edges.push(e)
    this.placeInEdge.push(place)
  }

  cleanTmpData() {
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  getNeibour(e?: Edge) {
    if (!e) return
    return e.vert0 === this ? e.vert1 : e.vert0
  }

  getOutputEdges(): Edge[] {
    return this.edges.filter((e, i) => e.canBeUsed && e.getFlow(this.placeInEdge[i]) > 0)
  }

  getInputEdges(): Edge[] {
    return this.edges.filter((e, i) => e.canBeUsed && e.getFlow(this.placeInEdge[i]) < 0)
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
    minPriceLiquidity = 0
  ) {
    const networks: NetworkInfo[] =
      baseTokenOrNetworks instanceof Array
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
      const v0 = this.getOrCreateVertice(p.tokens[0])
      const v1 = this.getOrCreateVertice(p.tokens[1])
      const edge = new Edge(p, v0, v1)
      this.edges.push(edge)
    })
    const startV = this.getVert(start)
    if (startV !== undefined) this.setPricesStable(startV, 1, networks, minPriceLiquidity)
  }

  getVert(t: RToken): Vertice | undefined {
    return this.tokens.get(t.tokenId as string)
  }

  cleanTmpData() {
    this.edges.forEach((e) => e.cleanTmpData())
    this.vertices.forEach((v) => v.cleanTmpData())
  }

  // Set prices using greedy algorithm
  setPricesStable(from: Vertice, price: number, networks: NetworkInfo[], minLiquidity = 0) {
    const processedVert = new Set<Vertice>()
    let nextEdges: Edge[] = []
    const edgeValues = new Map<Edge, number>()
    const value = (e: Edge): number => edgeValues.get(e) as number

    function addVertice(v: Vertice, price: number) {
      v.price = price
      const newEdges = v.edges.filter((e) => {
        if (processedVert.has(v.getNeibour(e) as Vertice)) return false
        if (e.pool.alwaysAppropriateForPricing()) return true
        const liquidity = price * parseInt(e.reserve(v).toString())
        if (liquidity < minLiquidity) return false
        edgeValues.set(e, liquidity)
        return true
      })
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0]) < value(newEdges[0])) res.push(nextEdges.shift() as Edge)
        else res.push(newEdges.shift() as Edge)
      }
      nextEdges = [...res, ...nextEdges, ...newEdges]
      processedVert.add(v)
    }

    addVertice(from, price)
    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as Edge
      const [vFrom, vTo] = processedVert.has(bestEdge.vert1)
        ? [bestEdge.vert1, bestEdge.vert0]
        : [bestEdge.vert0, bestEdge.vert1]
      if (processedVert.has(vTo)) continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee2(vFrom === bestEdge.vert1)
      addVertice(vTo, vFrom.price * p) //, vFrom.gasPrice / p)
    }

    const gasPrice = new Map<number | string | undefined, number>()
    networks.forEach((n) => {
      const vPrice = this.getVert(n.baseToken)?.price || 0
      gasPrice.set(n.chainId, n.gasPrice * vPrice)
    })
    processedVert.forEach((v) => {
      const gasPriceChainId = gasPrice.get(v.token.chainId) as number
      console.assert(gasPriceChainId !== undefined, 'Error 427')
      console.assert(v.price !== 0, 'Error 428')
      v.gasPrice = gasPriceChainId / v.price
    })
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
        return newV?.token.chainId === v.token.chainId && !processedVert.has(v.getNeibour(e) as Vertice)
      })
      newEdges.forEach((e) => edgeValues.set(e, price * parseInt(e.reserve(v).toString())))
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0]) < value(newEdges[0])) res.push(nextEdges.shift() as Edge)
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
      const p = bestEdge.pool.calcCurrentPriceWithoutFee2(vFrom === bestEdge.vert1)
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
      .sort((r1, r2) => r2[1] - r1[1])
    edges.forEach((ed) => {
      const e = ed[0]
      const v = e.vert0 === from ? e.vert1 : e.vert0
      if (v.price !== 0) return
      const p = e.pool.calcCurrentPriceWithoutFee2(from === e.vert1)
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

  findBestPathExactIn(
    from: RToken,
    to: RToken,
    amountIn: number
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
    if (!start || !finish) return

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

    let debug_info = ``
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

      if (!closestVert) return

      closestVert.checkLine = checkLine++

      if (closestVert === finish) {
        const bestPath = []
        for (let v: Vertice | undefined = finish; v?.bestSource; v = v.getNeibour(v.bestSource)) {
          bestPath.unshift(v.bestSource)
        }
        DEBUG(() => console.log(debug_info))
        if (Number.isNaN(finish.bestTotal)) {
          // eslint-disable-next-line no-debugger
          debugger
        }
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
        let newIncome: number, gas
        try {
          const { diff, gasSpent } = e.calcOutput(closestVert as Vertice, (closestVert as Vertice).bestIncome)
          if (!isFinite(diff) || !isFinite(gasSpent))
            // Math errors protection
            return

          newIncome = -diff
          gas = gasSpent
        } catch (err) {
          // Any arithmetic error or out-of-liquidity
          e.bestEdgeIncome = -1
          return
        }
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
            const st = closestVert?.token == from ? '*' : ''
            const fn = v2?.token == to ? '*' : ''
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
    amountOut: number
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
    if (!start || !finish) return

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

      if (!closestVert) return

      closestVert.checkLine = checkLine++

      if (closestVert === finish) {
        const bestPath = []
        for (let v: Vertice | undefined = finish; v?.bestSource; v = v.getNeibour(v.bestSource)) {
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
        let newIncome: number, gas
        try {
          const { diff, gasSpent } = e.calcInput(closestVert as Vertice, -(closestVert as Vertice).bestIncome)
          if (!isFinite(diff) || !isFinite(gasSpent))
            // Math errors protection
            return
          if (diff < 0) return // No enouph liquidity in the pool
          newIncome = diff
          gas = gasSpent
        } catch (e) {
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
            const st = v2?.token == from ? '*' : ''
            const fn = closestVert?.token == to ? '*' : ''
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
      const edgePrice = edge.pool.calcCurrentPriceWithoutFee2(direction)
      p *= edgePrice
      prevToken = prevToken.getNeibour(edge) as Vertice
    })
    return p
  }

  findBestRouteExactIn(from: RToken, to: RToken, amountIn: BigNumber | number, mode: number | number[]): MultiRoute {
    let amountInBN: BigNumber
    if (amountIn instanceof BigNumber) {
      amountInBN = amountIn
      amountIn = parseInt(amountIn.toString())
    } else {
      amountInBN = getBigNumber(amountIn)
    }

    let routeValues = []
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
      e.poolState = undefined
    })
    let output = 0
    let gasSpentInit = 0
    let totalOutput = 0
    let totalrouted = 0
    let primaryPrice
    let step
    for (step = 0; step < routeValues.length; ++step) {
      const p = this.findBestPathExactIn(from, to, amountIn * routeValues[step])
      if (!p) {
        break
      } else {
        output += p.output
        gasSpentInit += p.gasSpent
        totalOutput += p.totalOutput
        this.addPath(this.getVert(from), this.getVert(to), p.path)
        totalrouted += routeValues[step]
        // if (step === 0) {
        //   primaryPrice = this.getPrimaryPriceForPath(this.getVert(from) as Vertice, p.path)
        // }
      }
    }
    if (step == 0 || output == 0)
      return {
        status: RouteStatus.NoWay,
        fromToken: from,
        toToken: to,
        amountIn: 0,
        amountInBN: BigNumber.from(0),
        amountOut: 0,
        amountOutBN: BigNumber.from(0),
        legs: [],
        gasSpent: 0,
        totalAmountOut: 0,
        totalAmountOutBN: BigNumber.from(0),
      }
    let status
    if (step < routeValues.length) status = RouteStatus.Partial
    else status = RouteStatus.Success

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(fromVert, toVert)
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged) {
      output = this.calcLegsAmountOut(legs, amountIn)
    }

    let swapPrice, priceImpact
    try {
      swapPrice = output / amountIn
      const priceTo = this.getVert(to)?.price
      const priceFrom = this.getVert(from)?.price
      primaryPrice = priceTo && priceFrom ? priceFrom / priceTo : undefined
      priceImpact = primaryPrice !== undefined ? 1 - swapPrice / primaryPrice : undefined
    } catch (e) {
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
      amountInBN: status == RouteStatus.Success ? amountInBN : getBigNumber(amountIn * totalrouted),
      amountOut: output,
      amountOutBN: getBigNumber(output),
      legs,
      gasSpent,
      totalAmountOut: totalOutput, // TODO: should be recalculated if topologyWasChanged
      totalAmountOutBN: getBigNumber(totalOutput),
    }
  }

  findBestRouteExactOut(from: RToken, to: RToken, amountOut: number, mode: number | number[]): MultiRoute {
    let routeValues = []
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
      e.poolState = undefined
    })
    let input = 0
    let gasSpentInit = 0
    //let totalInput = 0
    let totalrouted = 0
    let primaryPrice
    let step
    for (step = 0; step < routeValues.length; ++step) {
      const p = this.findBestPathExactOut(from, to, amountOut * routeValues[step])
      if (!p) {
        break
      } else {
        input += p.input
        gasSpentInit += p.gasSpent
        //totalInput += p.totalInput
        this.addPath(this.getVert(from), this.getVert(to), p.path)
        totalrouted += routeValues[step]
        // if (step === 0) {
        //   primaryPrice = this.getPrimaryPriceForPath(this.getVert(from) as Vertice, p.path)
        // }
      }
    }
    if (step == 0)
      return {
        status: RouteStatus.NoWay,
        fromToken: from,
        toToken: to,
        amountIn: 0,
        amountInBN: BigNumber.from(0),
        amountOut: 0,
        amountOutBN: BigNumber.from(0),
        legs: [],
        gasSpent: 0,
        totalAmountOut: 0,
        totalAmountOutBN: BigNumber.from(0),
      }
    let status
    if (step < routeValues.length) status = RouteStatus.Partial
    else status = RouteStatus.Success

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(fromVert, toVert)
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged) {
      input = this.calcLegsAmountIn(legs, amountOut) ///
    }

    let swapPrice, priceImpact
    try {
      swapPrice = amountOut / input
      const priceTo = this.getVert(to)?.price
      const priceFrom = this.getVert(from)?.price
      primaryPrice = priceTo && priceFrom ? priceFrom / priceTo : undefined
      priceImpact = primaryPrice !== undefined ? 1 - swapPrice / primaryPrice : undefined
    } catch (e) {
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
      amountInBN: getBigNumber(input),
      amountOut: amountOut * totalrouted,
      amountOutBN: getBigNumber(amountOut * totalrouted),
      legs,
      gasSpent,
      totalAmountOut: amountOut - gasSpent * toVert.gasPrice, // TODO: should be totalAmountIn instead !!!!
      totalAmountOutBN: getBigNumber(amountOut - gasSpent * toVert.gasPrice), // TODO: should be totalAmountInBN instead !!!!
    }
  }

  getRouteLegs(
    from: Vertice,
    to: Vertice
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

      // console.debug('BEFORE', { outAmount, total, totalTest })

      outEdges.forEach((e, i) => {
        const p = e[2] as number
        const quantity = i + 1 === outEdges.length ? 1 : p / outAmount
        const edge = e[0] as Edge

        // console.debug(`edge iter ${0}`, { e, p })

        const poolType =
          edge.pool instanceof StableSwapRPool
            ? 'Stable'
            : edge.pool instanceof ConstantProductRPool
            ? 'Classic'
            : 'Unknown'

        legs.push({
          poolAddress: edge.pool.address,
          poolType,
          poolFee: edge.pool.fee,
          tokenFrom: n.token,
          tokenTo: (n.getNeibour(edge) as Vertice).token,
          assumedAmountIn: edge.direction ? edge.amountInPrevious : edge.amountOutPrevious,
          assumedAmountOut: edge.direction ? edge.amountOutPrevious : edge.amountInPrevious,
          swapPortion: quantity,
          absolutePortion: p / total,
        })
        gasSpent += (e[0] as Edge).pool.swapGasCost
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
    return e.direction ? { vert: e.vert0, amount: e.amountInPrevious } : { vert: e.vert1, amount: e.amountOutPrevious }
  }

  // TODO: make full test coverage!
  calcLegsAmountOut(legs: RouteLeg[], amountIn: number) {
    const amounts = new Map<string, number>()
    amounts.set(legs[0].tokenFrom.tokenId as string, amountIn)
    legs.forEach((l) => {
      const vert = this.getVert(l.tokenFrom)
      console.assert(vert !== undefined, 'Internal Error 570')
      const edge = (vert as Vertice).edges.find((e) => e.pool.address === l.poolAddress)
      console.assert(edge !== undefined, 'Internel Error 569')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert0

      const inputTotal = amounts.get(l.tokenFrom.tokenId as string)
      console.assert(inputTotal !== undefined, 'Internal Error 564')
      const input = (inputTotal as number) * l.swapPortion
      amounts.set(l.tokenFrom.tokenId as string, (inputTotal as number) - input)
      const output = pool.calcOutByIn2(input, direction).out

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.tokenId as string)
      amounts.set(vertNext.token.tokenId as string, (prevAmount || 0) + output)
    })
    return amounts.get(legs[legs.length - 1].tokenTo.tokenId as string) || 0
  }

  // TODO: make full test coverage!
  calcLegsAmountIn(legs: RouteLeg[], amountOut: number) {
    const totalOutputAssumed = new Map<string, number>()
    legs.forEach((l) => {
      const prevValue = totalOutputAssumed.get(l.tokenFrom.tokenId as string) || 0
      totalOutputAssumed.set(l.tokenFrom.tokenId as string, prevValue + l.assumedAmountOut)
    })

    const amounts = new Map<string, number>()
    amounts.set(legs[legs.length - 1].tokenTo.tokenId as string, amountOut)
    for (let i = legs.length - 1; i >= 0; --i) {
      const l = legs[i]
      const vert = this.getVert(l.tokenTo)
      console.assert(vert !== undefined, 'Internal Error 884')
      const edge = (vert as Vertice).edges.find((e) => e.pool.address === l.poolAddress)
      console.assert(edge !== undefined, 'Internel Error 888')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert1

      const outputTotal = amounts.get(l.tokenTo.tokenId as string)
      console.assert(outputTotal !== undefined, 'Internal Error 893')
      const totalAssumed = totalOutputAssumed.get(l.tokenFrom.tokenId as string)
      console.assert(totalAssumed !== undefined, 'Internal Error 903')
      const output = ((outputTotal as number) * l.assumedAmountOut) / (totalAssumed as number)
      const input = pool.calcInByOut2(output, direction).inp

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.tokenId as string)
      amounts.set(vertNext.token.tokenId as string, (prevAmount || 0) + input)
    }
    return amounts.get(legs[0].tokenFrom.tokenId as string) || 0
  }

  // removes all cycles if there are any, then removes all dead end could appear after cycle removing
  // Returns clean result topologically sorted
  cleanTopology(from: Vertice, to: Vertice): { vertices: Vertice[]; topologyWasChanged: boolean } {
    let topologyWasChanged = false
    let result = this.topologySort(from, to)
    if (result.status !== 2) {
      topologyWasChanged = true
      console.assert(result.status === 0, 'Internal Error 554')
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
    let minVert: Vertice = verts[0],
      minVertNext: Vertice
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
        minVertNext = v2
        minOutput = out
      }
    })

    minVert.getOutputEdges().forEach((e) => {
      if (minVert.getNeibour(e) !== minVertNext) return
      e.canBeUsed = false
    })
  }

  // topological sort
  // if there is a cycle - returns [0, <List of envolved vertices in the cycle>]
  // if there are no cycles but deadends- returns [3, <List of all envolved deadend vertices>]
  // if there are no cycles or deadends- returns [2, <List of all envolved vertices topologically sorted>]
  topologySort(from: Vertice, to: Vertice): { status: number; vertices: Vertice[] } {
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
        console.assert(foundCycle.length == 0, 'Internal Error 566')
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
    if (foundDeadEndVerts.length) return { status: 3, vertices: foundDeadEndVerts }
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
