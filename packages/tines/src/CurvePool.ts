import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { getBigNumber } from './Utils'

export class CurvePool extends RPool {
  readonly A: number
  D: BigNumber // set it to 0 if reserves are changed !!

  rate0BN: BigNumber
  rate1BN18: BigNumber
  rate0: number
  rate1: number
  reserve0Rated: BigNumber
  reserve1Rated: BigNumber

  constructor(
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    A: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    ratio = 1 // is used for some pools with liquid stake tokens - like ankrETH
  ) {
    super(address, token0, token1, fee, reserve0, reserve1, undefined, 90_000)
    this.A = A
    this.D = BigNumber.from(0)
    if (address) {
      const decimalsMin = Math.min(this.token0.decimals, this.token1.decimals)
      this.rate0 = Math.pow(10, this.token1.decimals - decimalsMin)
      this.rate1 = Math.pow(10, this.token0.decimals - decimalsMin) * ratio
      this.rate0BN = getBigNumber(this.rate0)
      this.rate1BN18 = getBigNumber(this.rate1 * 1e18) // 18 digits for precision
      this.reserve0Rated = this.reserve0.mul(this.rate0BN)
      this.reserve1Rated = this.reserve1.mul(this.rate1BN18).div(getBigNumber(1e18))
    } else {
      // for deserialization
      this.rate0 = 0
      this.rate1 = 0
      this.rate0BN = undefined as unknown as BigNumber
      this.rate1BN18 = undefined as unknown as BigNumber
      this.reserve0Rated = undefined as unknown as BigNumber
      this.reserve1Rated = undefined as unknown as BigNumber
    }
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.D = BigNumber.from(0)
    this.reserve0 = res0
    this.reserve1 = res1
    this.reserve0Rated = this.reserve0.mul(this.rate0BN)
    this.reserve1Rated = this.reserve1.mul(this.rate1BN18).div(getBigNumber(1e18))
  }

  computeLiquidity(): BigNumber {
    if (!this.D.isZero()) return this.D // already calculated

    const r0 = this.reserve0Rated
    const r1 = this.reserve1Rated

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
    amountIn *= direction ? this.rate0 : this.rate1
    const xBN = direction ? this.reserve0Rated : this.reserve1Rated
    const yBN = direction ? this.reserve1Rated : this.reserve0Rated
    const xNewBN = xBN.add(getBigNumber(amountIn /* * (1 - this.fee)*/))
    const yNewBN = this.computeY(xNewBN)
    const dy = parseInt(yBN.sub(yNewBN).toString()) / (direction ? this.rate1 : this.rate0)
    if (parseInt(yNewBN.toString()) < this.minLiquidity) throw 'Curve pool OutOfLiquidity'
    return { out: dy * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    amountOut *= direction ? this.rate1 : this.rate0
    const xBN = direction ? this.reserve0Rated : this.reserve1Rated
    const yBN = direction ? this.reserve1Rated : this.reserve0Rated
    let yNewBN = yBN.sub(getBigNumber(amountOut / (1 - this.fee)))
    if (yNewBN.lt(1))
      // lack of precision
      yNewBN = BigNumber.from(1)

    const xNewBN = this.computeY(yNewBN)
    const input = Math.round(
      parseInt(xNewBN.sub(xBN).toString()) /* / (1 - this.fee)*/ / (direction ? this.rate0 : this.rate1)
    )

    //if (input < 1) input = 1
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const xBN = direction ? this.reserve0Rated : this.reserve1Rated
    const x = parseInt(xBN.toString())
    const oneMinusFee = takeFeeIntoAccount ? 1 - this.fee : 1
    const D = parseInt(this.computeLiquidity().toString())
    const A = this.A / 2
    const xI = x + amountIn
    const b = 4 * A * xI + D - 4 * A * D
    const ac4 = (D * D * D) / xI
    const Ds = Math.sqrt(b * b + 4 * A * ac4)
    const price = (0.5 - (2 * b - ac4 / xI) / Ds / 4) * oneMinusFee
    const scale = this.rate0 / this.rate1
    return direction ? price * scale : price / scale
  }
}
