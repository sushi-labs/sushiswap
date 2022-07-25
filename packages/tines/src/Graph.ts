import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { ASSERT, closeValues, DEBUG, getBigNumber } from './Utils'

// Routing info about each one swap
export interface RouteLeg {
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

export class Edge {
  pool: RPool
  vert0: Vertice
  vert1: Vertice

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
  }

  reserve(v: Vertice): BigNumber {
    return v === this.vert0 ? this.pool.getReserve0() : this.pool.getReserve1()
  }

  calcOutput(v: Vertice, amountIn: number): { out: number; gasSpent: number } {
    let res, gas
    if (v === this.vert1) {
      if (this.direction) {
        if (amountIn < this.amountOutPrevious) {
          const { inp, gasSpent } = this.pool.calcInByOut(this.amountOutPrevious - amountIn, true)
          res = this.amountInPrevious - inp
          gas = gasSpent
        } else {
          const { out, gasSpent } = this.pool.calcOutByIn(amountIn - this.amountOutPrevious, false)
          res = out + this.amountInPrevious
          gas = gasSpent
        }
      } else {
        const { out, gasSpent } = this.pool.calcOutByIn(this.amountOutPrevious + amountIn, false)
        res = out - this.amountInPrevious
        gas = gasSpent
      }
    } else {
      if (this.direction) {
        const { out, gasSpent } = this.pool.calcOutByIn(this.amountInPrevious + amountIn, true)
        res = out - this.amountOutPrevious
        gas = gasSpent
      } else {
        if (amountIn < this.amountInPrevious) {
          const { inp, gasSpent } = this.pool.calcInByOut(this.amountInPrevious - amountIn, false)
          res = this.amountOutPrevious - inp
          gas = gasSpent
        } else {
          const { out, gasSpent } = this.pool.calcOutByIn(amountIn - this.amountInPrevious, true)
          res = out + this.amountOutPrevious
          gas = gasSpent
        }
      }
    }

    // this.testApply(v, amountIn, out);

    return { out: res, gasSpent: gas - this.spentGas }
  }

  calcInput(v: Vertice, amountOut: number): { inp: number; gasSpent: number } {
    let res, gas
    if (v === this.vert1) {
      if (!this.direction) {
        if (amountOut < this.amountOutPrevious) {
          const { out, gasSpent } = this.pool.calcOutByIn(this.amountOutPrevious - amountOut, false)
          res = this.amountInPrevious - out
          gas = gasSpent
        } else {
          const { inp, gasSpent } = this.pool.calcInByOut(amountOut - this.amountOutPrevious, true)
          res = inp + this.amountInPrevious
          gas = gasSpent
        }
      } else {
        const { inp, gasSpent } = this.pool.calcInByOut(this.amountOutPrevious + amountOut, true)
        res = inp - this.amountInPrevious
        gas = gasSpent
      }
    } else {
      if (!this.direction) {
        const { inp, gasSpent } = this.pool.calcInByOut(this.amountInPrevious + amountOut, false)
        res = inp - this.amountOutPrevious
        gas = gasSpent
      } else {
        if (amountOut < this.amountInPrevious) {
          const { out, gasSpent } = this.pool.calcOutByIn(this.amountInPrevious - amountOut, true)
          res = this.amountOutPrevious - out
          gas = gasSpent
        } else {
          const { inp, gasSpent } = this.pool.calcInByOut(amountOut - this.amountInPrevious, false)
          res = inp + this.amountOutPrevious
          gas = gasSpent
        }
      }
    }

    // this.testApply(v, amountIn, out);

    return { inp: res, gasSpent: gas - this.spentGas }
  }

  checkMinimalLiquidityExceededAfterSwap(from: Vertice, amountOut: number): boolean {
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
    const inPrev = this.direction ? this.amountInPrevious : -this.amountInPrevious
    const outPrev = this.direction ? this.amountOutPrevious : -this.amountOutPrevious
    const to = from.getNeibour(this)
    let directionNew,
      amountInNew = 0,
      amountOutNew = 0
    if (to) {
      const inInc = from === this.vert0 ? amountIn : -amountOut
      const outInc = from === this.vert0 ? amountOut : -amountIn
      const inNew = inPrev + inInc
      const outNew = outPrev + outInc
      if (inNew * outNew < 0) console.log('333')
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
      if (!res) console.log('Err 225-1 !!', amountOutNew, calc, Math.abs(calc / amountOutNew - 1))
      return res
    } else {
      const calc = this.pool.calcOutByIn(amountOutNew, false).out
      const res = closeValues(amountInNew, calc, 1e-6)
      if (!res) console.log('Err 225-2!!', amountInNew, calc, Math.abs(calc / amountInNew - 1))
      return res
    }
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
    } else console.error('Error 221')
    this.spentGas = this.spentGasNew

    ASSERT(() => {
      if (this.direction) {
        const granularity = this.pool.granularity1()
        return closeValues(
          this.amountOutPrevious / granularity,
          this.pool.calcOutByIn(this.amountInPrevious, this.direction).out / granularity,
          1e-4
        )
      } else {
        const granularity = this.pool.granularity0()
        return closeValues(
          this.amountInPrevious / granularity,
          this.pool.calcOutByIn(this.amountOutPrevious, this.direction).out / granularity,
          1e-4,
          `"${this.pool.address}" ${inPrev} ${to?.bestIncome} ${from.bestIncome}`
        )
      }
    }, `Error 225`)
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
  bestSource?: Edge // temp data used for findBestPath algorithm
  checkLine: number // debug data

  constructor(t: RToken) {
    this.token = t
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
    if (!e) return
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
  tokens: Map<string, Vertice>

  constructor(pools: RPool[], baseToken: RToken, gasPrice: number) {
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
    const baseVert = this.tokens.get(baseToken.address)
    if (baseVert) {
      this.setPricesStable(baseVert, 1, gasPrice)
    }
  }

  cleanTmpData() {
    this.edges.forEach((e) => e.cleanTmpData())
    this.vertices.forEach((v) => v.cleanTmpData())
  }

  // Set prices using greedy algorithm
  setPricesStable(from: Vertice, price: number, gasPrice: number) {
    this.vertices.forEach((v) => (v.price = 0)) // initialization
    from.price = price
    from.gasPrice = gasPrice

    const edgeValues = new Map<Edge, number>()
    const value = (e: Edge): number => edgeValues.get(e) as number

    function addVertice(v: Vertice) {
      const newEdges = v.edges.filter((e) => v.getNeibour(e)?.price == 0)
      newEdges.forEach((e) => edgeValues.set(e, v.price * parseInt(e.reserve(v).toString())))
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0]) < value(newEdges[0])) res.push(nextEdges.shift() as Edge)
        else res.push(newEdges.shift() as Edge)
      }
      nextEdges = [...res, ...nextEdges, ...newEdges]
    }

    let nextEdges: Edge[] = []
    addVertice(from)
    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as Edge
      const [vFrom, vTo] =
        bestEdge.vert1.price !== 0 ? [bestEdge.vert1, bestEdge.vert0] : [bestEdge.vert0, bestEdge.vert1]
      if (vTo.price !== 0) continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(vFrom === bestEdge.vert1)
      vTo.price = vFrom.price * p
      vTo.gasPrice = vFrom.gasPrice / p
      addVertice(vTo)
    }
  }

  // Set prices by search in depth
  setPrices(from: Vertice, price: number, gasPrice: number) {
    if (from.price !== 0) return
    from.price = price
    from.gasPrice = gasPrice
    const edges = from.edges
      .map((e): [Edge, number] => [e, parseInt(e.reserve(from).toString())])
      .sort(([_1, r1], [_2, r2]) => r2 - r1)
    edges.forEach(([e, _]) => {
      const v = e.vert0 === from ? e.vert1 : e.vert0
      if (v.price !== 0) return
      const p = e.pool.calcCurrentPriceWithoutFee(from === e.vert1)
      this.setPrices(v, price * p, gasPrice / p)
    })
  }

  getOrCreateVertice(token: RToken) {
    let vert = this.tokens.get(token.address)
    if (vert) return vert
    vert = new Vertice(token)
    this.vertices.push(vert)
    this.tokens.set(token.address, vert)
    return vert
  }

  /*exportPath(from: RToken, to: RToken) {

    const fromVert = this.tokens.get(from) as Vertice
    const toVert = this.tokens.get(to) as Vertice
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
    _gasPrice?: number
  ):
    | {
        path: Edge[]
        output: number
        gasSpent: number
        totalOutput: number
      }
    | undefined {
    const start = this.tokens.get(from.address)
    const finish = this.tokens.get(to.address)
    if (!start || !finish) return

    const gasPrice = _gasPrice !== undefined ? _gasPrice : finish.gasPrice

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
          const { out, gasSpent } = e.calcOutput(closestVert as Vertice, (closestVert as Vertice).bestIncome)
          if (!isFinite(out) || !isFinite(gasSpent))
            // Math errors protection
            return

          newIncome = out
          gas = gasSpent
        } catch (e) {
          // Any arithmetic error or out-of-liquidity
          return
        }
        if (e.checkMinimalLiquidityExceededAfterSwap(closestVert as Vertice, newIncome)) {
          e.bestEdgeIncome = -1
          return
        }
        const newGasSpent = (closestVert as Vertice).gasSpent + gas
        const price = v2.price / finish.price
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
    amountOut: number,
    _gasPrice?: number
  ):
    | {
        path: Edge[]
        input: number
        gasSpent: number
        totalInput: number
      }
    | undefined {
    const start = this.tokens.get(to.address)
    const finish = this.tokens.get(from.address)
    if (!start || !finish) return

    const gasPrice = _gasPrice !== undefined ? _gasPrice : finish.gasPrice

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
          const { inp, gasSpent } = e.calcInput(closestVert as Vertice, (closestVert as Vertice).bestIncome)
          if (!isFinite(inp) || !isFinite(gasSpent))
            // Math errors protection
            return
          if (inp < 0) return // No enouph liquidity in the pool
          newIncome = inp
          gas = gasSpent
        } catch (e) {
          // Any arithmetic error or out-of-liquidity
          return
        }
        const newGasSpent = (closestVert as Vertice).gasSpent + gas
        const price = v2.price / finish.price
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
      const edgePrice = edge.pool.calcCurrentPriceWithoutFee(direction)
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
    })
    let output = 0
    let gasSpentInit = 0
    //let totalOutput = 0
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
        //totalOutput += p.totalOutput
        this.addPath(this.tokens.get(from.address), this.tokens.get(to.address), p.path)
        totalrouted += routeValues[step]
        // if (step === 0) {
        //   primaryPrice = this.getPrimaryPriceForPath(this.tokens.get(from.address) as Vertice, p.path)
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

    const fromVert = this.tokens.get(from.address) as Vertice
    const toVert = this.tokens.get(to.address) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(fromVert, toVert)
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged) {
      output = this.calcLegsAmountOut(legs, amountIn)
    }

    let swapPrice, priceImpact
    try {
      swapPrice = output / amountIn
      const priceTo = this.tokens.get(to.address)?.price
      const priceFrom = this.tokens.get(from.address)?.price
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
      totalAmountOut: output - gasSpent * toVert.gasPrice,
      totalAmountOutBN: getBigNumber(output - gasSpent * toVert.gasPrice),
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
    })
    let input = 0
    let gasSpentInit = 0
    //let totalOutput = 0
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
        //totalOutput += p.totalOutput
        this.addPath(this.tokens.get(from.address), this.tokens.get(to.address), p.path)
        totalrouted += routeValues[step]
        // if (step === 0) {
        //   primaryPrice = this.getPrimaryPriceForPath(this.tokens.get(from.address) as Vertice, p.path)
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

    const fromVert = this.tokens.get(from.address) as Vertice
    const toVert = this.tokens.get(to.address) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(fromVert, toVert)
    console.assert(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged) {
      input = this.calcLegsAmountIn(legs, amountOut) ///
    }

    let swapPrice, priceImpact
    try {
      swapPrice = amountOut / input
      const priceTo = this.tokens.get(to.address)?.price
      const priceFrom = this.tokens.get(from.address)?.price
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
      totalAmountOut: amountOut - gasSpent * toVert.gasPrice,
      totalAmountOutBN: getBigNumber(amountOut - gasSpent * toVert.gasPrice),
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
      outEdges.forEach((e, i) => {
        const p = e[2] as number
        const quantity = i + 1 === outEdges.length ? 1 : p / outAmount
        const edge = e[0] as Edge
        legs.push({
          poolAddress: edge.pool.address,
          poolFee: edge.pool.fee,
          tokenFrom: n.token,
          tokenTo: (n.getNeibour(edge) as Vertice).token,
          assumedAmountIn: edge.direction ? edge.amountInPrevious : edge.amountOutPrevious,
          assumedAmountOut: edge.direction ? edge.amountOutPrevious : edge.amountInPrevious,
          swapPortion: quantity,
          absolutePortion: p / total,
        })
        gasSpent += (e[0] as Edge).pool.swapGasCost
        outAmount -= p
      })
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
    amounts.set(legs[0].tokenFrom.address, amountIn)
    legs.forEach((l) => {
      const vert = this.tokens.get(l.tokenFrom.address)
      console.assert(vert !== undefined, 'Internal Error 570')
      const edge = (vert as Vertice).edges.find((e) => e.pool.address === l.poolAddress)
      console.assert(edge !== undefined, 'Internel Error 569')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert0

      const inputTotal = amounts.get(l.tokenFrom.address)
      console.assert(inputTotal !== undefined, 'Internal Error 564')
      const input = (inputTotal as number) * l.swapPortion
      amounts.set(l.tokenFrom.address, (inputTotal as number) - input)
      const output = pool.calcOutByIn(input, direction).out

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.address)
      amounts.set(vertNext.token.address, (prevAmount || 0) + output)
    })
    return amounts.get(legs[legs.length - 1].tokenTo.address) || 0
  }

  // TODO: make full test coverage!
  calcLegsAmountIn(legs: RouteLeg[], amountOut: number) {
    const totalOutputAssumed = new Map<string, number>()
    legs.forEach((l) => {
      const prevValue = totalOutputAssumed.get(l.tokenFrom.address) || 0
      totalOutputAssumed.set(l.tokenFrom.address, prevValue + l.assumedAmountOut)
    })

    const amounts = new Map<string, number>()
    amounts.set(legs[legs.length - 1].tokenTo.address, amountOut)
    for (let i = legs.length - 1; i >= 0; --i) {
      const l = legs[i]
      const vert = this.tokens.get(l.tokenTo.address)
      console.assert(vert !== undefined, 'Internal Error 884')
      const edge = (vert as Vertice).edges.find((e) => e.pool.address === l.poolAddress)
      console.assert(edge !== undefined, 'Internel Error 888')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert1

      const outputTotal = amounts.get(l.tokenTo.address)
      console.assert(outputTotal !== undefined, 'Internal Error 893')
      const totalAssumed = totalOutputAssumed.get(l.tokenFrom.address)
      console.assert(totalAssumed !== undefined, 'Internal Error 903')
      const output = ((outputTotal as number) * l.assumedAmountOut) / (totalAssumed as number)
      const input = pool.calcInByOut(output, direction).inp

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.address)
      amounts.set(vertNext.token.address, (prevAmount || 0) + input)
    }
    return amounts.get(legs[0].tokenFrom.address) || 0
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
    let minVert: Vertice, minVertNext: Vertice
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
    // @ts-ignore
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
