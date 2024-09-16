// @ts-nocheck

import type { Address } from 'viem'
import { PoolType, RPool, type RToken } from './RPool.js'
import { getBigInt } from './Utils.js'

const ZERO = 0n
const MIN_LIQUIDITY = 1000
const SWAP_GAS_COST = 90_000

export class CurveMultitokenPool extends RPool {
  core: CurveMultitokenCore
  index0: number
  index1: number
  flow0 = 0
  flow1 = 0

  constructor(core: CurveMultitokenCore, index0: number, index1: number) {
    //if (core) {
    super(
      core?.address as Address,
      core?.tokens[index0] as RToken,
      core?.tokens[index1] as RToken,
      core?.fee,
      core?.reserves[index0] as bigint,
      core?.reserves[index1] as bigint,
      MIN_LIQUIDITY,
      SWAP_GAS_COST,
    )
    console.assert(index0 < index1, 'Wrong CurveMultitokenPool indexes')
    this.core = core
    this.index0 = index0
    this.index1 = index1
    /*} else {
      // for deserealization
      super(
        undefined as unknown as Address,
        undefined as unknown as RToken,
        undefined as unknown as RToken,
        undefined as unknown as number,
        undefined as unknown as bigint,
        undefined as unknown as bigint,
        MIN_LIQUIDITY,
        SWAP_GAS_COST,
      )
    }*/
  }

  override updateReserves(_res0: bigint, _res1: bigint) {
    console.error('CurveMultitokenPool.updateReserves not expected to be used')
    // super.updateReserves(res0, res1)
    // this.core.updateReserve(this.index0, res0)
    // this.core.updateReserve(this.index1, res1)
  }

  override poolType(): PoolType {
    return PoolType.Curve
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number } {
    if (direction) {
      console.assert(
        amountIn - this.flow0 >= 0,
        `CurveMultitokenPool.calcOutByIn Unexpected input value 0 ${JSON.stringify(
          {
            pool: this.core.address,
            index0: this.index0,
            index1: this.index1,
            flow0: this.flow0,
            flow1: this.flow1,
            direction,
            amountIn,
            out:
              -this.flow1 -
              this.core.calcOutDiff(
                amountIn - this.flow0,
                this.index0,
                this.index1,
              ),
            currentFlow: this.core.currentFlow,
          },
        )}`,
      )
      const out =
        -this.flow1 -
        this.core.calcOutDiff(amountIn - this.flow0, this.index0, this.index1)
      // console.assert(
      //   out >= 0,
      //   'CurveMultitokenPool.calcOutByIn Unexpected output value 0',
      // )
      return { out, gasSpent: SWAP_GAS_COST }
    } else {
      console.assert(
        amountIn - this.flow1 >= 0,
        'CurveMultitokenPool.calcOutByIn Unexpected input value 1',
      )
      const out =
        -this.flow0 -
        this.core.calcOutDiff(amountIn - this.flow1, this.index1, this.index0)
      // console.assert(
      //   out >= 0,
      //   'CurveMultitokenPool.calcOutByIn Unexpected output value 1',
      // )
      return { out, gasSpent: SWAP_GAS_COST }
    }
  }

  calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number } {
    if (direction) {
      const inp =
        this.core.calcOutDiff(
          -amountOut - this.flow1,
          this.index1,
          this.index0,
        ) + this.flow0
      // console.assert(
      //   inp >= 0,
      //   'CurveMultitokenPool.calcInByOut Unexpected output value 0',
      // )
      return { inp, gasSpent: SWAP_GAS_COST }
    } else {
      const inp =
        this.core.calcOutDiff(
          -amountOut - this.flow0,
          this.index0,
          this.index1,
        ) + this.flow1
      // console.assert(
      //   inp >= 0,
      //   'CurveMultitokenPool.calcInByOut Unexpected output value 1',
      // )
      return { inp, gasSpent: SWAP_GAS_COST }
    }
  }

  override calcOutByInReal(amountIn: number, direction: boolean): number {
    const amountOut = Math.round(this.calcOutByIn(amountIn, direction).out)
    const [flow0, flow1] = direction
      ? [amountIn, -amountOut]
      : [-amountOut, amountIn]
    this.setCurrentFlow(flow0, flow1)
    return amountOut
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    if (direction)
      return this.core.calcCurrentPriceWithoutFee(this.index0, this.index1)
    else return this.core.calcCurrentPriceWithoutFee(this.index1, this.index0)
  }

  override setCurrentFlow(flow0: number, flow1: number) {
    this.core.applyReserveChange(this.index0, flow0 - this.flow0)
    this.core.applyReserveChange(this.index1, flow1 - this.flow1)
    this.flow0 = flow0
    this.flow1 = flow1
  }

  override cleanTmpData() {
    this.flow0 = 0
    this.flow1 = 0
    this.core.cleanTmpData()
  }

  override uniqueID(): string {
    return `${this.address}_${this.index0}_${this.index1}`
  }
}

const E18 = getBigInt(1e18)

export class CurveMultitokenCore {
  address: string
  tokens: RToken[]
  fee: number
  A: number
  reserves: bigint[]
  reservesRated: bigint[]
  rates: number[]
  ratesBN18: bigint[]
  currentFlow: number[]
  D: bigint

  // For faster calculation
  Ann: bigint
  Annn: bigint
  AnnMinus1: bigint
  nn: bigint
  n: bigint
  nPlus1: bigint

  constructor(
    address: string,
    tokens: RToken[],
    fee: number,
    A: number,
    reserves: bigint[],
    rates?: number[],
  ) {
    if (address) {
      this.address = address
      this.tokens = tokens
      this.fee = fee
      this.A = A
      this.reserves = reserves
      const decimalsMax = Math.max(...tokens.map((t) => t.decimals))
      this.rates = tokens.map(
        (t, i) => 10 ** (decimalsMax - t.decimals) * (rates?.[i] ?? 1),
      )
      this.ratesBN18 = this.rates.map((r) => getBigInt(r * 1e18)) // precision is 18 digits
      this.reservesRated = this.reserves.map(
        (r, i) => (r * this.ratesBN18[i]) / E18,
      )
      this.currentFlow = this.reserves.map(() => 0)
      this.D = 0n

      this.Ann = getBigInt(A * this.tokens.length)
      this.n = BigInt(this.tokens.length)
      this.Annn = this.Ann * this.n
      this.AnnMinus1 = this.Ann - 1n
      this.nn = getBigInt(this.tokens.length ** this.tokens.length)
      this.nPlus1 = this.n + 1n
    } else {
      // for deserialization
    }
  }

  updateReserve(index: number, res: bigint) {
    this.D = 0n
    this.reserves[index] = res
    this.reservesRated[index] = (res * this.ratesBN18[index]) / E18
    this.currentFlow[index] = 0
  }

  applyReserveDiff(index: number, diff: bigint) {
    this.updateReserve(index, this.reserves[index] + diff)
  }

  computeLiquidity(): bigint {
    if (this.D !== 0n) return this.D // already calculated
    if (this.reserves.some((r) => r === 0n)) return 0n

    const s = this.reservesRated.reduce((a, b) => a + b, 0n)
    let prevD
    let D = s
    const AnnS = this.Ann * s
    for (let i = 0; i < 256; i++) {
      let dP = D
      this.reservesRated.forEach((r) => {
        dP = (dP * D) / r
      })
      dP = dP / this.nn
      prevD = D
      // D = (Ann * S + D_P * N_COINS) * D / ((Ann - 1) * D + (N_COINS + 1) * D_P)
      D = ((AnnS + dP * this.n) * D) / (this.AnnMinus1 * D + dP * this.nPlus1)
      if (Math.abs(Number(D - prevD)) <= 1) {
        break
      }
    }
    this.D = D
    return D
  }

  computeY(xIndex: number, x: bigint, yIndex: number): bigint {
    const D = this.computeLiquidity()
    let c = D
    let S_ = ZERO
    for (let i = 0; i < this.tokens.length; ++i) {
      let _x = ZERO
      if (i === xIndex) _x = x
      else if (i !== yIndex) _x = this.diffToAbsolute(0, i) as bigint
      else continue
      S_ = S_ + _x
      c = (c * D) / _x / this.n
    }
    c = (c * D) / this.Annn
    const b = D / this.Ann + S_

    let y_prev = ZERO
    let y = D
    for (let i = 0; i < 256; i++) {
      y_prev = y
      y = (y * y + c) / (y * 2n + b - D)
      if (Math.abs(Number(y - y_prev)) <= 1) {
        break
      }
    }
    return y
  }

  flowIntToExt(flowInt: number): number {
    return flowInt >= 0 ? flowInt : flowInt * (1 - this.fee)
  }
  flowExtToInt(flowExt: number): number {
    return flowExt >= 0 ? flowExt : flowExt / (1 - this.fee)
  }

  diffToAbsolute(diff: number, i: number): bigint {
    return (
      BigInt(
        Math.round(
          this.flowExtToInt(diff + this.currentFlow[i]) * this.rates[i],
        ),
      ) +
      (this.reserves[i] * this.ratesBN18[i]) / E18
    )
  }
  absoluteToDiff(abs: bigint, i: number): number {
    return (
      this.flowIntToExt(
        Number((abs * E18) / this.ratesBN18[i] - this.reserves[i]),
      ) - this.currentFlow[i]
    )
  }

  calcOutDiff(inpDiff: number, from: number, to: number) {
    const xAbs = this.diffToAbsolute(inpDiff, from)
    const yAbs = this.computeY(from, xAbs, to)
    if (yAbs < MIN_LIQUIDITY) throw new Error('Curve pool OutOfLiquidity')
    return this.absoluteToDiff(yAbs, to)
  }

  calcCurrentPriceWithoutFee(from: number, to: number): number {
    const xInp = Number(this.reservesRated[from])
    const D = Number(this.computeLiquidity())
    let Sx = 0
    let Px = 1
    this.tokens.forEach((_, i) => {
      if (i === to) return
      const x = Number(this.reservesRated[i])
      Sx += x
      Px *= x
    })
    const n = this.tokens.length
    const b = Sx + D / this.A / n - D
    const c = (D / n) ** (n + 1) / Px / this.A
    const Ds = Math.sqrt(b * b + 4 * c)
    const dD = 2 * b - (4 * c) / xInp
    const price = 0.5 - dD / Ds / 4
    const scale = (this.rates[from] as number) / (this.rates[to] as number)
    return price * scale
  }

  applyReserveChange(index: number, diff: number) {
    this.currentFlow[index] += diff
  }

  cleanTmpData() {
    this.currentFlow = this.reserves.map(() => 0)
  }

  getOriginalRates(): number[] {
    const decimalsMax = Math.max(...this.tokens.map((t) => t.decimals))
    return this.rates.map(
      (r, i) => r / 10 ** (decimalsMax - this.tokens[i].decimals),
    )
  }
}

export function createCurvePoolsForMultipool(
  address: string,
  tokens: RToken[],
  fee: number,
  A: number,
  reserves: bigint[],
  rates?: number[],
) {
  const core = new CurveMultitokenCore(address, tokens, fee, A, reserves, rates)
  const pools: CurveMultitokenPool[] = []
  for (let i = 0; i < tokens.length; ++i)
    for (let j = i + 1; j < tokens.length; ++j)
      pools.push(new CurveMultitokenPool(core, i, j))
  return pools
}
