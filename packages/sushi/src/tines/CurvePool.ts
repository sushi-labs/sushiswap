import { Address } from 'viem'
import { abs } from '../math/index.js'
import { PoolType, RPool, RToken } from './RPool.js'
import { getBigInt } from './Utils.js'

export class CurvePool extends RPool {
  readonly A: number
  D: bigint // set it to 0 if reserves are changed !!

  rate0BI: bigint
  rate1BN18: bigint
  rate0: number
  rate1: number
  reserve0Rated: bigint
  reserve1Rated: bigint

  constructor(
    address: Address,
    token0: RToken,
    token1: RToken,
    fee: number,
    A: number,
    reserve0: bigint,
    reserve1: bigint,
    ratio = 1, // is used for some pools with liquid stake tokens - like ankrETH
  ) {
    super(address, token0, token1, fee, reserve0, reserve1, undefined, 90_000)
    this.A = A
    this.D = 0n
    if (address) {
      const decimalsMin = Math.min(this.token0.decimals, this.token1.decimals)
      this.rate0 = 10 ** (this.token1.decimals - decimalsMin)
      this.rate1 = 10 ** (this.token0.decimals - decimalsMin) * ratio
      this.rate0BI = getBigInt(this.rate0)
      this.rate1BN18 = getBigInt(this.rate1 * 1e18) // 18 digits for precision
      this.reserve0Rated = this.reserve0 * this.rate0BI
      this.reserve1Rated = (this.reserve1 * this.rate1BN18) / getBigInt(1e18)
    } else {
      // for deserialization
      this.rate0 = 0
      this.rate1 = 0
      this.rate0BI = undefined as unknown as bigint
      this.rate1BN18 = undefined as unknown as bigint
      this.reserve0Rated = undefined as unknown as bigint
      this.reserve1Rated = undefined as unknown as bigint
    }
  }

  override updateReserves(res0: bigint, res1: bigint) {
    this.D = 0n
    this.reserve0 = res0
    this.reserve1 = res1
    this.reserve0Rated = this.reserve0 * this.rate0BI
    this.reserve1Rated = (this.reserve1 * this.rate1BN18) / getBigInt(1e18)
  }

  override poolType(): PoolType {
    return PoolType.Curve
  }

  computeLiquidity(): bigint {
    if (this.D !== 0n) return this.D // already calculated

    const r0 = this.reserve0Rated
    const r1 = this.reserve1Rated

    if (r0 === 0n && r1 === 0n) {
      return 0n
    }

    const s = r0 + r1

    const nA = BigInt(this.A * 2)

    let prevD

    let D = s
    for (let i = 0; i < 256; i++) {
      const dP = (((D * D) / r0) * D) / r1 / 4n
      prevD = D
      D = ((nA * s + 2n * dP) * D) / ((nA - 1n) * D + 3n * dP)

      if (abs(D - prevD) <= 1) break
    }

    this.D = D
    return D
  }

  computeY(x: bigint): bigint {
    const D = this.computeLiquidity()

    const nA = BigInt(this.A * 2)

    const c = (((D * D) / (x * 2n)) * D) / (nA * 2n)
    const b = D / nA + x

    let yPrev
    let y = D
    for (let i = 0; i < 256; i++) {
      yPrev = y

      y = (y * y + c) / (y * 2n + b - D)
      if (abs(y - yPrev) <= 1) {
        break
      }
    }
    return y
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number } {
    amountIn *= direction ? this.rate0 : this.rate1
    const xBI = direction ? this.reserve0Rated : this.reserve1Rated
    const yBI = direction ? this.reserve1Rated : this.reserve0Rated
    const xNewBI = xBI + getBigInt(amountIn /* * (1 - this.fee)*/)
    const yNewBI = this.computeY(xNewBI)
    const dy =
      parseInt((yBI - yNewBI).toString()) /
      (direction ? this.rate1 : this.rate0)
    if (parseInt(yNewBI.toString()) < this.minLiquidity)
      throw 'Curve pool OutOfLiquidity'
    return { out: dy * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number } {
    amountOut *= direction ? this.rate1 : this.rate0
    const xBI = direction ? this.reserve0Rated : this.reserve1Rated
    const yBI = direction ? this.reserve1Rated : this.reserve0Rated
    let yNewBI = yBI - getBigInt(amountOut / (1 - this.fee))
    if (yNewBI < 1)
      // lack of precision
      yNewBI = 1n

    const xNewBI = this.computeY(yNewBI)
    const input = Math.round(
      parseInt((xNewBI - xBI).toString()) /* / (1 - this.fee)*/ /
        (direction ? this.rate0 : this.rate1),
    )

    //if (input < 1) input = 1
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  calcPrice(
    amountIn: number,
    direction: boolean,
    takeFeeIntoAccount: boolean,
  ): number {
    const xBI = direction ? this.reserve0Rated : this.reserve1Rated
    const x = parseInt(xBI.toString())
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
