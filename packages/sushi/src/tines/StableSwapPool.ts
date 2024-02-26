import { Address } from 'viem'
import { abs } from '../math/index.js'
import { PoolType, RPool, RToken } from './RPool.js'
import { getBigInt } from './Utils.js'

export interface Rebase {
  elastic: bigint
  base: bigint
}

export function toAmountBI(share: bigint, total: Rebase) {
  if (total.base === 0n || total.elastic === 0n) return share
  return (share * total.elastic) / total.base
}

export function toShareBI(elastic: bigint, total: Rebase) {
  if (total.base === 0n || total.elastic === 0n) return elastic
  return (elastic * total.base) / total.elastic
}

export class RebaseInternal {
  elastic2Base: number
  rebaseBI: Rebase

  constructor(rebase: Rebase) {
    this.rebaseBI = rebase
    if (rebase !== undefined) {
      if (rebase.base === 0n || rebase.elastic === 0n) this.elastic2Base = 1
      else
        this.elastic2Base =
          parseInt(rebase.elastic.toString()) / parseInt(rebase.base.toString())
    } else {
      // for deserialization
      this.elastic2Base = 1
    }
  }

  toAmount(share: number) {
    return share * this.elastic2Base
  }

  toShare(amount: number) {
    return amount / this.elastic2Base
  }

  toAmountBI(share: bigint) {
    return toAmountBI(share, this.rebaseBI)
  }
}

export function realReservesToAdjusted(
  reserve: bigint,
  total: Rebase,
  decimals: number,
) {
  const amount = toAmountBI(reserve, total)
  return (amount * getBigInt(1e12)) / getBigInt(10 ** decimals)
}

export function adjustedReservesToReal(
  reserve: bigint,
  total: Rebase,
  decimals: number,
) {
  const amount = (reserve * getBigInt(10 ** decimals)) / getBigInt(1e12)
  return toShareBI(amount, total)
}

// xy(xx+yy) = k
export class StableSwapRPool extends RPool {
  k: bigint // set it to 0 if reserves are changed !!
  decimals0: number
  decimals1: number
  decimalsCompensation0: number
  decimalsCompensation1: number
  total0: RebaseInternal
  total1: RebaseInternal

  constructor(
    address: Address,
    token0: RToken,
    token1: RToken,
    fee: number,
    reserve0: bigint,
    reserve1: bigint,
    decimals0: number,
    decimals1: number,
    total0: Rebase,
    total1: Rebase,
  ) {
    super(
      address,
      token0,
      token1,
      fee,
      reserve0 === undefined
        ? (undefined as unknown as bigint) // for deserialization
        : realReservesToAdjusted(reserve0, total0, decimals0),
      reserve1 === undefined
        ? (undefined as unknown as bigint) // for deserialization
        : realReservesToAdjusted(reserve1, total1, decimals1),
    )
    this.k = 0n
    this.decimals0 = decimals0
    this.decimals1 = decimals1
    if (address) {
      this.decimalsCompensation0 = 10 ** (12 - decimals0)
      this.decimalsCompensation1 = 10 ** (12 - decimals1)
      this.total0 = new RebaseInternal(total0)
      this.total1 = new RebaseInternal(total1)
    } else {
      // for deserialization
      this.decimalsCompensation0 = 0
      this.decimalsCompensation1 = 0
      this.total0 = undefined as unknown as RebaseInternal
      this.total1 = undefined as unknown as RebaseInternal
    }
  }

  override getReserve0() {
    return adjustedReservesToReal(
      this.reserve0,
      this.total0.rebaseBI,
      this.decimals0,
    )
  }
  override getReserve1() {
    return adjustedReservesToReal(
      this.reserve1,
      this.total1.rebaseBI,
      this.decimals1,
    )
  }
  override granularity0(): number {
    return Math.max(1 / this.decimalsCompensation0, 1)
  }
  override granularity1(): number {
    return Math.max(1 / this.decimalsCompensation1, 1)
  }

  override updateReserves(res0: bigint, res1: bigint) {
    this.k = 0n
    this.reserve0 = realReservesToAdjusted(
      res0,
      this.total0.rebaseBI,
      this.decimals0,
    )
    this.reserve1 = realReservesToAdjusted(
      res1,
      this.total1.rebaseBI,
      this.decimals1,
    )
  }

  override poolType(): PoolType {
    return PoolType.Stable
  }

  updateReservesAmounts(res0: bigint, res1: bigint) {
    this.k = 0n
    this.reserve0 = (res0 * getBigInt(1e12)) / getBigInt(10 ** this.decimals0)
    this.reserve1 = (res1 * getBigInt(1e12)) / getBigInt(10 ** this.decimals1)
  }

  getTotal0() {
    return this.total0.rebaseBI
  }

  getTotal1() {
    return this.total1.rebaseBI
  }

  updateTotals(total0: Rebase, total1: Rebase) {
    this.total0 = new RebaseInternal(total0)
    this.total1 = new RebaseInternal(total1)
  }

  updateTotal0(total0: Rebase) {
    this.total0 = new RebaseInternal(total0)
  }

  updateTotal1(total1: Rebase) {
    this.total1 = new RebaseInternal(total1)
  }

  computeK(): bigint {
    if (this.k === 0n) {
      const x = this.reserve0
      const y = this.reserve1
      this.k = x * y * (x * x + y * y)
    }
    return this.k
  }

  computeY(x: bigint, yHint: bigint): bigint {
    const k = this.computeK()
    const x2 = x << 1n
    const x3 = x * 3n
    const xCube = x * x * x
    let yPrev = yHint
    let y = yHint
    for (let i = 0; i < 255; ++i) {
      const ySquare = y * y
      const yCube = ySquare * y
      y = (yCube * x2 + k) / (ySquare * x3 + xCube)
      if (abs(y - yPrev) <= 1) break
      yPrev = y
    }
    return y
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
    throwIfOutOfLiquidity = true,
  ): { out: number; gasSpent: number } {
    amountIn = direction
      ? this.total0.toAmount(amountIn)
      : this.total1.toAmount(amountIn)
    amountIn *= direction
      ? this.decimalsCompensation0
      : this.decimalsCompensation1
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    const xNew = x + getBigInt(Math.floor(amountIn * (1 - this.fee)))
    const yNew = this.computeY(xNew, y)
    const outA = parseInt((y - yNew).toString()) - 1 // with precision loss compensation
    const outB = Math.max(outA, 0)
    const outC = direction
      ? this.total1.toShare(outB)
      : this.total0.toShare(outB)
    const out =
      outC /
      (direction ? this.decimalsCompensation1 : this.decimalsCompensation0)

    const initialReserve = direction ? this.getReserve1() : this.getReserve0()
    if (
      throwIfOutOfLiquidity &&
      initialReserve - getBigInt(out) < this.minLiquidity
    )
      throw new Error('StableSwap OutOfLiquidity')

    return { out, gasSpent: this.swapGasCost }
  }

  override calcOutByInReal(amountIn: number, direction: boolean): number {
    return Math.floor(this.calcOutByIn(amountIn, direction, false).out)
  }

  calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number } {
    amountOut = direction
      ? this.total1.toAmount(amountOut)
      : this.total0.toAmount(amountOut)
    amountOut *= direction
      ? this.decimalsCompensation1
      : this.decimalsCompensation0
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    const yNew = y - getBigInt(Math.ceil(amountOut))
    if (yNew < this.minLiquidity) {
      // not possible swap
      return { inp: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
    }

    const xNew = this.computeY(yNew, x)
    const inp0 = parseInt((xNew - x).toString()) / (1 - this.fee)
    const inp1 = direction
      ? this.total0.toShare(inp0)
      : this.total1.toShare(inp0)
    const inp2 =
      inp1 /
      (direction ? this.decimalsCompensation0 : this.decimalsCompensation1)
    const inp = Math.max(inp2, 1)
    return { inp, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    const calcDirection = this.reserve0 > this.reserve1
    const xBI = calcDirection ? this.reserve0 : this.reserve1
    const x = parseInt(xBI.toString())
    const k = parseInt(this.computeK().toString())
    const q = k / x / 2
    const qD = -q / x // devivative of q
    const Q = x ** 6 / 27 + q * q
    const QD = (6 * x ** 5) / 27 + 2 * q * qD // derivative of Q
    const sqrtQ = Math.sqrt(Q)
    const sqrtQD = (1 / 2 / sqrtQ) * QD // derivative of sqrtQ
    const a = sqrtQ + q
    const aD = sqrtQD + qD
    const b = sqrtQ - q
    const bD = sqrtQD - qD
    const a3 = a ** (1 / 3)
    const a3D = (((1 / 3) * a3) / a) * aD
    const b3 = b ** (1 / 3)
    const b3D = (((1 / 3) * b3) / b) * bD
    const yD = a3D - b3D
    const yDShares = calcDirection
      ? this.total1.toShare(this.total0.toAmount(yD))
      : this.total0.toShare(this.total1.toAmount(yD))
    const price = calcDirection === direction ? -yDShares : -1 / yDShares
    const scale = this.decimalsCompensation0 / this.decimalsCompensation1
    return direction ? price * scale : price / scale
  }
}
