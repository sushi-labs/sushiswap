import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { getBigNumber } from './Utils'

export class CurvePool extends RPool {
  readonly A: number
  D: BigNumber // set it to 0 if reserves are changed !!

  constructor(
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    A: number,
    reserve0: BigNumber,
    reserve1: BigNumber
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.A = A
    this.D = BigNumber.from(0)
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.D = BigNumber.from(0)
    this.reserve0 = res0
    this.reserve1 = res1
  }

  computeLiquidity(): BigNumber {
    if (!this.D.eq(0)) return this.D // already calculated

    const r0 = this.reserve0
    const r1 = this.reserve1

    if (r0.isZero() && r1.isZero()) return BigNumber.from(0)

    const s = r0.add(r1)
    const nA = BigNumber.from(this.A * 2)
    let prevD
    let D = s
    for (let i = 0; i < 256; i++) {
      const dP = D.mul(D).div(r0).mul(D).div(r1).div(4)
      prevD = D
      D = nA
        .mul(s)
        .add(dP.mul(2))
        .mul(D)
        .div(nA.sub(1).mul(D).add(dP.mul(3)))
      if (D.sub(prevD).abs().lte(1)) {
        break
      }
    }
    this.D = D
    return D
  }

  computeY(x: BigNumber): BigNumber {
    const D = this.computeLiquidity()

    const nA = this.A * 2

    const c = D.mul(D)
      .div(x.mul(2))
      .mul(D)
      .div(nA * 2)
    const b = D.div(nA).add(x)

    let yPrev
    let y = D
    for (let i = 0; i < 256; i++) {
      yPrev = y

      y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D))
      if (y.sub(yPrev).abs().lte(1)) {
        break
      }
    }
    return y
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    const xBN = direction ? this.reserve0 : this.reserve1
    const yBN = direction ? this.reserve1 : this.reserve0
    const xNewBN = xBN.add(getBigNumber(amountIn * (1 - this.fee)))
    const yNewBN = this.computeY(xNewBN)
    const dy = parseInt(yBN.sub(yNewBN).toString())
    if (parseInt(yNewBN.toString()) < this.minLiquidity) throw 'Hybrid OutOfLiquidity'
    return { out: dy, gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    const xBN = direction ? this.reserve0 : this.reserve1
    const yBN = direction ? this.reserve1 : this.reserve0
    let yNewBN = yBN.sub(getBigNumber(amountOut))
    if (yNewBN.lt(1))
      // lack of precision
      yNewBN = BigNumber.from(1)

    const xNewBN = this.computeY(yNewBN)
    const input = Math.round(parseInt(xNewBN.sub(xBN).toString()) / (1 - this.fee))

    //if (input < 1) input = 1
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const xBN = direction ? this.reserve0 : this.reserve1
    const x = parseInt(xBN.toString())
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const D = parseInt(this.computeLiquidity().toString())
    const A = this.A / 2
    const xI = x + amountIn
    const b = 4 * A * xI + D - 4 * A * D
    const ac4 = (D * D * D) / xI
    const Ds = Math.sqrt(b * b + 4 * A * ac4)
    const res = (0.5 - (2 * b - ac4 / xI) / Ds / 4) * oneMinusFee
    return res
  }
}
