//import { bigint } from '@ethersproject/bignumber'
import { Address } from 'viem'

import { RPool, RToken } from './PrimaryPools'
import { getBigInt } from './Utils'

const ZERO = 0n
const MIN_LIQUIDITY = 1000
const SWAP_GAS_COST = 90_000

export class CurveMultitokenPool extends RPool {
  core: CurveMultitokenCore
  index0: number
  index1: number

  constructor(core: CurveMultitokenCore, index0: number, index1: number) {
    super(
      core.address as Address,
      core.tokens[index0],
      core.tokens[index1],
      core.fee,
      core.reserves[index0],
      core.reserves[index1],
      MIN_LIQUIDITY,
      SWAP_GAS_COST
    )
    this.core = core
    this.index0 = index0
    this.index1 = index1
  }

  updateReserves(res0: bigint, res1: bigint) {
    super.updateReserves(res0, res1)
    this.core.updateReserve(this.index0, res0)
    this.core.updateReserve(this.index1, res1)
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    if (direction) return this.core.calcOutByIn(amountIn, this.index0, this.index1)
    else return this.core.calcOutByIn(amountIn, this.index1, this.index0)
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    if (direction) return this.core.calcInByOut(amountOut, this.index0, this.index1)
    else return this.core.calcInByOut(amountOut, this.index1, this.index0)
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    if (direction) return this.core.calcCurrentPriceWithoutFee(this.index0, this.index1)
    else return this.core.calcCurrentPriceWithoutFee(this.index1, this.index0)
  }
}

const E18 = getBigInt(1e18)

class CurveMultitokenCore {
  address: string
  tokens: RToken[]
  fee: number
  A: number
  reserves: bigint[]
  rates: number[]
  ratesBN18: bigint[]
  reservesRated: bigint[]
  D: bigint

  // For faster calculation
  Ann: bigint
  Annn: bigint
  AnnMinus1: bigint
  nn: bigint
  n: bigint
  nPlus1: bigint

  constructor(address: string, tokens: RToken[], fee: number, A: number, reserves: bigint[], rates?: number[]) {
    this.address = address
    this.tokens = tokens
    this.fee = fee
    this.A = A
    this.reserves = reserves
    const decimalsMax = Math.max(...tokens.map((t) => t.decimals))
    this.rates = tokens.map((t, i) => Math.pow(10, decimalsMax - t.decimals) * (rates?.[i] ?? 1))
    this.ratesBN18 = this.rates.map((r) => getBigInt(r * 1e18)) // precision is 18 digits
    this.reservesRated = this.reserves.map((r, i) => (r * this.ratesBN18[i]) / E18)
    this.D = ZERO

    this.Ann = getBigInt(A * this.tokens.length)
    this.n = BigInt(this.tokens.length)
    this.Annn = this.Ann * this.n
    this.AnnMinus1 = this.Ann - 1n
    this.nn = getBigInt(Math.pow(this.tokens.length, this.tokens.length))
    this.nPlus1 = this.n + 1n
  }

  updateReserve(index: number, res: bigint) {
    this.D = ZERO
    this.reserves[index] = res
    this.reservesRated[index] = (res * this.ratesBN18[index]) / E18 // remove precision 1e18
  }

  computeLiquidity(): bigint {
    if (this.D !== 0n) return this.D // already calculated
    if (this.reservesRated.some((r) => r === 0n)) return ZERO

    const s = this.reservesRated.reduce((a, b) => a + b, ZERO)
    let prevD
    let D = s
    const AnnS = this.Ann * s
    for (let i = 0; i < 256; i++) {
      let dP = D
      this.reservesRated.forEach((r) => (dP = (dP * D) / r))
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
      if (i == xIndex) _x = x
      else if (i != yIndex) _x = this.reservesRated[i]
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

  calcOutByIn(amountIn: number, from: number, to: number): { out: number; gasSpent: number } {
    amountIn *= this.rates[from]
    const xBN = this.reservesRated[from]
    const yBN = this.reservesRated[to]
    const xNewBN = xBN + getBigInt(amountIn)
    const yNewBN = this.computeY(from, xNewBN, to)
    if (yNewBN < MIN_LIQUIDITY) throw 'Curve pool OutOfLiquidity'
    const dy = Number(yBN - yNewBN) / this.rates[to]
    return { out: dy * (1 - this.fee), gasSpent: SWAP_GAS_COST }
  }

  calcInByOut(amountOut: number, from: number, to: number): { inp: number; gasSpent: number } {
    amountOut *= this.rates[to]
    const xBN = this.reservesRated[from]
    const yBN = this.reservesRated[to]
    let yNewBN = yBN - getBigInt(amountOut / (1 - this.fee))
    if (yNewBN < 1)
      // lack of precision
      yNewBN = 1n

    const xNewBN = this.computeY(to, yNewBN, from)
    const input = Math.round(Number(xNewBN - xBN) / this.rates[from])

    //if (input < 1) input = 1
    return { inp: input, gasSpent: SWAP_GAS_COST }
  }

  calcCurrentPriceWithoutFee(from: number, to: number): number {
    const xInp = parseInt(this.reservesRated[from].toString())
    const D = parseInt(this.computeLiquidity().toString())
    let Sx = 0,
      Px = 1
    this.tokens.forEach((_, i) => {
      if (i == to) return
      const x = parseInt(this.reservesRated[i].toString())
      Sx += x
      Px *= x
    })
    const n = this.tokens.length
    const b = Sx + D / this.A / n - D
    const c = Math.pow(D / n, n + 1) / Px / this.A
    const Ds = Math.sqrt(b * b + 4 * c)
    const dD = 2 * b - (4 * c) / xInp
    const price = 0.5 - dD / Ds / 4
    const scale = this.rates[from] / this.rates[to]
    return price * scale
  }
}

export function createCurvePoolsForMultipool(
  address: string,
  tokens: RToken[],
  fee: number,
  A: number,
  reserves: bigint[],
  rates?: number[]
) {
  const core = new CurveMultitokenCore(address, tokens, fee, A, reserves, rates)
  const pools: CurveMultitokenPool[] = []
  for (let i = 0; i < tokens.length; ++i)
    for (let j = i + 1; j < tokens.length; ++j) pools.push(new CurveMultitokenPool(core, i, j))
  return pools
}
