import { abs } from '@sushiswap/math'
import { Address } from 'viem'

import { computeHybridLiquidity } from './functions'
import { getBigInt, revertPositive } from './Utils'

export const TYPICAL_SWAP_GAS_COST = 60_000
export const TYPICAL_MINIMAL_LIQUIDITY = 1000

export interface RToken {
  name: string
  symbol: string
  address: string
  decimals: number
  chainId?: number | string
  tokenId?: string // if tokens' ids are equal then tokens are the same
}

export function setTokenId(...tokens: RToken[]) {
  tokens.forEach((t) => {
    if (!t.tokenId) t.tokenId = `${t.address || ''}_${t.chainId}`
  })
}

export abstract class RPool {
  readonly address: Address
  token0: RToken
  token1: RToken
  readonly fee: number
  reserve0: bigint
  reserve1: bigint
  readonly minLiquidity: number
  readonly swapGasCost: number

  constructor(
    address: Address,
    token0: RToken,
    token1: RToken,
    fee: number,
    reserve0: bigint,
    reserve1: bigint,
    minLiquidity = TYPICAL_MINIMAL_LIQUIDITY,
    swapGasCost = TYPICAL_SWAP_GAS_COST
  ) {
    this.address = address || ''
    this.token0 = token0
    this.token1 = token1
    if (token0 && token1) {
      // exception just for deserialization - tokenId should be set after
      setTokenId(this.token0, this.token1)
    }
    this.fee = fee
    this.minLiquidity = minLiquidity
    this.swapGasCost = swapGasCost
    this.reserve0 = reserve0
    this.reserve1 = reserve1
  }

  updateReserves(res0: bigint, res1: bigint) {
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
  // Should throw if the rest of liquidity is lesser than minLiquidity
  abstract calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number }
  abstract calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number }
  abstract calcCurrentPriceWithoutFee(direction: boolean): number

  // Should return real output, as close to the pool as possible. With rounding. No exceptions
  calcOutByInReal(amountIn: number, direction: boolean): number {
    return this.calcOutByIn(amountIn, direction).out
  }

  // precision of calcOutByIn
  granularity0() {
    return 1
  }
  granularity1() {
    return 1
  }

  alwaysAppropriateForPricing(): boolean {
    return false
  }
}

export class ConstantProductRPool extends RPool {
  reserve0Number: number
  reserve1Number: number

  constructor(address: Address, token0: RToken, token1: RToken, fee: number, reserve0: bigint, reserve1: bigint) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.reserve0Number = Number(reserve0 || '0')
    this.reserve1Number = Number(reserve1 || '0')
  }

  updateReserves(res0: bigint, res1: bigint) {
    this.reserve0 = res0
    this.reserve0Number = Number(res0)
    this.reserve1 = res1
    this.reserve1Number = Number(res1)
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const out = (y * amountIn) / (x / (1 - this.fee) + amountIn)
    if (y - out < this.minLiquidity) throw 'CP OutOfLiquidity'
    return { out, gasSpent: this.swapGasCost }
  }

  calcOutByInReal(amountIn: number, direction: boolean): number {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const amountInWithoutFee = Math.floor(amountIn * (1 - this.fee) * 1000) // rounding of amount without fee
    const out = (y * amountInWithoutFee) / (x * 1000 + amountInWithoutFee)
    return Math.floor(out) // rounding of output
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
  D: bigint // set it to 0 if reserves are changed !!

  constructor(
    address: Address,
    token0: RToken,
    token1: RToken,
    fee: number,
    A: number,
    reserve0: bigint,
    reserve1: bigint
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.A = A
    this.D = 0n
  }

  updateReserves(res0: bigint, res1: bigint) {
    this.D = 0n
    this.reserve0 = res0
    this.reserve1 = res1
  }

  computeLiquidity(): bigint {
    if (this.D !== 0n) return this.D // already calculated

    const r0 = this.reserve0
    const r1 = this.reserve1

    return computeHybridLiquidity(r0, r1, this.A)
    // if (r0 === 0n && r1 === 0n) return 0n

    // const s = r0 + r1
    // const nA = BigInt(this.A * 2)
    // let prevD
    // let D = s

    // for (let i = 0; i < 256; i++) {
    //   const dP = D.mul(D).div(r0).mul(D).div(r1).div(4)
    //   prevD = D
    //   D = nA
    //     .mul(s)
    //     .div(this.A_PRECISION)
    //     .add(dP.mul(2))
    //     .mul(D)
    //     .div(nA.div(this.A_PRECISION).sub(1).mul(D).add(dP.mul(3)))
    //   if (D.sub(prevD).abs().lte(1)) {
    //     break
    //   }
    // }
    // this.D = D
    // return D
  }

  computeY(x: bigint): bigint {
    const D = this.computeLiquidity()

    const nA = BigInt(this.A * 2)

    const c = (((D * D) / (x * 2n)) * D) / ((nA * 2n) / BigInt(this.A_PRECISION))
    const b = (D * BigInt(this.A_PRECISION)) / nA + x

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

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    const xBI = direction ? this.reserve0 : this.reserve1
    const yBI = direction ? this.reserve1 : this.reserve0
    const xNewBI = xBI + getBigInt(amountIn * (1 - this.fee))
    const yNewBI = this.computeY(xNewBI)
    const dy = parseInt((yBI - yNewBI).toString())
    if (parseInt(yNewBI.toString()) < this.minLiquidity) throw 'Hybrid OutOfLiquidity'
    return { out: dy, gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    const xBI = direction ? this.reserve0 : this.reserve1
    const yBI = direction ? this.reserve1 : this.reserve0
    let yNewBI = yBI - getBigInt(amountOut)
    if (yNewBI < 1n)
      // lack of precision
      yNewBI = 1n

    const xNewBI = this.computeY(yNewBI)
    const input = Math.round(parseInt((xNewBI - xBI).toString()) / (1 - this.fee))

    //if (input < 1) input = 1
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    return this.calcPrice(0, direction, false)
  }

  calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number {
    const xBI = direction ? this.reserve0 : this.reserve1
    const x = parseInt(xBI.toString())
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
