import { BigNumber } from '@ethersproject/bignumber'

import { getBigNumber, revertPositive } from './Utils'

export const TYPICAL_SWAP_GAS_COST = 60_000
export const TYPICAL_MINIMAL_LIQUIDITY = 1000

export interface RToken {
  name: string
  symbol: string
  address: string
}

export abstract class RPool {
  readonly address: string
  readonly token0: RToken
  readonly token1: RToken
  readonly fee: number
  reserve0: BigNumber
  reserve1: BigNumber
  readonly minLiquidity: number
  readonly swapGasCost: number

  constructor(
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    minLiquidity = TYPICAL_MINIMAL_LIQUIDITY,
    swapGasCost = TYPICAL_SWAP_GAS_COST
  ) {
    this.address = address
    ;(this.token0 = token0), (this.token1 = token1)
    this.fee = fee
    this.minLiquidity = minLiquidity
    this.swapGasCost = swapGasCost
    this.reserve0 = reserve0
    this.reserve1 = reserve1
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.reserve0 = res0
    this.reserve1 = res1
  }
  getReserve0() {
    return this.reserve0
  }
  getReserve1() {
    return this.reserve1
  }

  // Returns [<output amount>, <gas consumption estimation>]
  abstract calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number }
  abstract calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number }
  abstract calcCurrentPriceWithoutFee(direction: boolean): number

  // precision of calcOutByIn
  granularity0() {
    return 1
  }
  granularity1() {
    return 1
  }
}

export class ConstantProductRPool extends RPool {
  reserve0Number: number
  reserve1Number: number

  constructor(address: string, token0: RToken, token1: RToken, fee: number, reserve0: BigNumber, reserve1: BigNumber) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.reserve0Number = parseInt(reserve0.toString())
    this.reserve1Number = parseInt(reserve1.toString())
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.reserve0 = res0
    this.reserve0Number = parseInt(res0.toString())
    this.reserve1 = res1
    this.reserve1Number = parseInt(res1.toString())
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    return { out: (y * amountIn) / (x / (1 - this.fee) + amountIn), gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    if (y - amountOut < this.minLiquidity)
      // not possible swap
      return { inp: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    const input = (x * amountOut) / (1 - this.fee) / (y - amountOut)
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const xf = x / oneMinusFee
    return (y * xf) / (xf + amountIn) / (xf + amountIn)
  }

  calcInputByPrice(price: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const xf = x / oneMinusFee
    return Math.sqrt(y * xf * price) - xf // TODO: or y*xf/price ???
  }

  getLiquidity() {
    return Math.sqrt(this.reserve0Number * this.reserve1Number)
  }
}

export class HybridRPool extends RPool {
  readonly A: number
  readonly A_PRECISION = 100
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
        .div(this.A_PRECISION)
        .add(dP.mul(2))
        .mul(D)
        .div(nA.div(this.A_PRECISION).sub(1).mul(D).add(dP.mul(3)))
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
      .div((nA * 2) / this.A_PRECISION)
    const b = D.mul(this.A_PRECISION).div(nA).add(x)

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
    const A = this.A / this.A_PRECISION
    const xI = x + amountIn
    const b = 4 * A * xI + D - 4 * A * D
    const ac4 = (D * D * D) / xI
    const Ds = Math.sqrt(b * b + 4 * A * ac4)
    const res = (0.5 - (2 * b - ac4 / xI) / Ds / 4) * oneMinusFee
    return res
  }

  calcInputByPrice(price: number, direction: boolean, takeFeeIntoAccount: boolean, hint = 1): number {
    // TODO:  (x:number) => this.calcPrice(x, !direction, takeFeeIntoAccount)  ???
    return revertPositive((x: number) => 1 / this.calcPrice(x, direction, takeFeeIntoAccount), price, hint)
  }
}
