import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { getBigNumber } from './Utils'

export interface Rebase {
  elastic: BigNumber
  base: BigNumber
}

function toAmountBN(share: BigNumber, total: Rebase) {
  if (total.base.isZero() || total.elastic.isZero()) return share
  return share.mul(total.elastic).div(total.base)
}

function toShareBN(elastic: BigNumber, total: Rebase) {
  if (total.base.isZero() || total.elastic.isZero()) return elastic
  return elastic.mul(total.base).div(total.elastic)
}

class RebaseInternal {
  elastic2Base: number
  rebaseBN: Rebase

  constructor(rebase: Rebase) {
    this.rebaseBN = rebase
    if (rebase.base.isZero() || rebase.elastic.isZero()) this.elastic2Base = 1
    else this.elastic2Base = parseInt(rebase.elastic.toString()) / parseInt(rebase.base.toString())
  }

  toAmount(share: number) {
    return share * this.elastic2Base
  }

  toShare(amount: number) {
    return amount / this.elastic2Base
  }

  toAmountBN(share: BigNumber) {
    return toAmountBN(share, this.rebaseBN)
  }
}

export function realReservesToAdjusted(reserve: BigNumber, total: Rebase, decimals: number) {
  const amount = toAmountBN(reserve, total)
  return amount.mul(1e12).div(getBigNumber(Math.pow(10, decimals)))
}

export function adjustedReservesToReal(reserve: BigNumber, total: Rebase, decimals: number) {
  const amount = reserve.mul(getBigNumber(Math.pow(10, decimals))).div(1e12)
  return toShareBN(amount, total)
}

// xy(xx+yy) = k
export class StableSwapRPool extends RPool {
  k: BigNumber // set it to 0 if reserves are changed !!
  decimals0: number
  decimals1: number
  decimalsCompensation0: number
  decimalsCompensation1: number
  total0: RebaseInternal
  total1: RebaseInternal

  constructor(
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    decimals0: number,
    decimals1: number,
    total0: Rebase,
    total1: Rebase
  ) {
    super(
      address,
      token0,
      token1,
      fee,
      realReservesToAdjusted(reserve0, total0, decimals0),
      realReservesToAdjusted(reserve1, total1, decimals1)
    )
    this.k = BigNumber.from(0)
    this.decimals0 = decimals0
    this.decimals1 = decimals1
    this.decimalsCompensation0 = Math.pow(10, 12 - decimals0)
    this.decimalsCompensation1 = Math.pow(10, 12 - decimals1)
    this.total0 = new RebaseInternal(total0)
    this.total1 = new RebaseInternal(total1)
  }

  getReserve0() {
    return adjustedReservesToReal(this.reserve0, this.total0.rebaseBN, this.decimals0)
  }
  getReserve1() {
    return adjustedReservesToReal(this.reserve1, this.total1.rebaseBN, this.decimals1)
  }
  granularity0(): number {
    return Math.max(1 / this.decimalsCompensation0, 1)
  }
  granularity1(): number {
    return Math.max(1 / this.decimalsCompensation1, 1)
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.k = BigNumber.from(0)
    this.reserve0 = realReservesToAdjusted(res0, this.total0.rebaseBN, this.decimals0)
    this.reserve1 = realReservesToAdjusted(res1, this.total1.rebaseBN, this.decimals1)
  }

  computeK(): BigNumber {
    if (this.k.isZero()) {
      const x = this.reserve0
      const y = this.reserve1
      this.k = x.mul(y).mul(x.mul(x).add(y.mul(y)))
    }
    return this.k
  }

  computeY(x: BigNumber, yHint: BigNumber): BigNumber {
    const k = this.computeK()
    const x2 = x.shl(1)
    const x3 = x.mul(3)
    const xCube = x.mul(x).mul(x)
    let yPrev = yHint,
      y = yHint
    for (let i = 0; i < 255; ++i) {
      const ySquare = y.mul(y)
      const yCube = ySquare.mul(y)
      y = yCube.mul(x2).add(k).div(ySquare.mul(x3).add(xCube))
      if (y.sub(yPrev).abs().lte(1)) break
      yPrev = y
    }
    return y
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    amountIn = direction ? this.total0.toAmount(amountIn) : this.total1.toAmount(amountIn)
    amountIn *= direction ? this.decimalsCompensation0 : this.decimalsCompensation1
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    const xNew = x.add(getBigNumber(Math.floor(amountIn * (1 - this.fee))))
    const yNew = this.computeY(xNew, y)
    const outA = parseInt(y.sub(yNew).toString()) - 1 // with precision loss compensation
    const outB = Math.max(outA, 0)
    const outC = direction ? this.total1.toShare(outB) : this.total0.toShare(outB)
    const out = outC / (direction ? this.decimalsCompensation1 : this.decimalsCompensation0)
    return { out, gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    amountOut = direction ? this.total0.toAmount(amountOut) : this.total1.toAmount(amountOut)
    amountOut *= direction ? this.decimalsCompensation1 : this.decimalsCompensation0
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    const yNew = y.sub(getBigNumber(Math.ceil(amountOut)))
    if (yNew.lt(this.minLiquidity)) {
      // not possible swap
      return { inp: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
    }

    const xNew = this.computeY(yNew, x)
    const inp0 = parseInt(xNew.sub(x).toString()) / (1 - this.fee)
    const inp1 = direction ? this.total1.toShare(inp0) : this.total0.toShare(inp0)
    const inp2 = inp1 / (direction ? this.decimalsCompensation0 : this.decimalsCompensation1)
    const inp = Math.round(inp2) + 1 // with precision loss compensation
    // const inp0 = parseInt(xNew.sub(x).toString()) / (1 - this.fee)
    // const inp1 = Math.round(inp0) + 1 // with precision loss compensation
    // const inp2 = direction ? this.total1.toShare(inp1) : this.total0.toShare(inp1)
    // const inp = inp2 / (direction ? this.decimalsCompensation0 : this.decimalsCompensation1)
    return { inp, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    const calcDirection = this.reserve0.gt(this.reserve1)
    const xBN = calcDirection ? this.reserve0 : this.reserve1
    const x = parseInt(xBN.toString())
    const k = parseInt(this.computeK().toString())
    const q = k / x / 2
    const qD = -q / x // devivative of q
    const Q = Math.pow(x, 6) / 27 + q * q
    const QD = (6 * Math.pow(x, 5)) / 27 + 2 * q * qD // derivative of Q
    const sqrtQ = Math.sqrt(Q)
    const sqrtQD = (1 / 2 / sqrtQ) * QD // derivative of sqrtQ
    const a = sqrtQ + q
    const aD = sqrtQD + qD
    const b = sqrtQ - q
    const bD = sqrtQD - qD
    const a3 = Math.pow(a, 1 / 3)
    const a3D = (((1 / 3) * a3) / a) * aD
    const b3 = Math.pow(b, 1 / 3)
    const b3D = (((1 / 3) * b3) / b) * bD
    const yD = a3D - b3D
    const yDShares = calcDirection
      ? this.total1.toShare(this.total0.toAmount(yD))
      : this.total0.toShare(this.total1.toAmount(yD))
    const price = calcDirection == direction ? -yDShares : -1 / yDShares
    const scale = this.decimalsCompensation0 / this.decimalsCompensation1
    return direction ? price * scale : price / scale
  }
}
