import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { getBigNumber } from './Utils'

const ZERO = BigNumber.from(0)
const MIN_LIQUIDITY = 1000
const MIN_LIQUIDITY_BN = BigNumber.from(MIN_LIQUIDITY)
const SWAP_GAS_COST = 90_000

export class CurveMultitokenPool extends RPool {
  core: CurveMultitokenCore
  index0: number
  index1: number

  constructor(core: CurveMultitokenCore, index0: number, index1: number) {
    super(
      core.address,
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

  updateReserves(res0: BigNumber, res1: BigNumber) {
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

class CurveMultitokenCore {
  address: string
  tokens: RToken[]
  fee: number
  A: number
  reserves: BigNumber[]
  rates: number[]
  ratesBN: BigNumber[]
  reservesRated: BigNumber[]
  D: BigNumber

  // For faster calculation
  Ann: BigNumber
  AnnMinus1: BigNumber
  nn: BigNumber
  n: BigNumber
  nPlus1: BigNumber

  constructor(address: string, tokens: RToken[], fee: number, A: number, reserves: BigNumber[], rates?: number[]) {
    this.address = address
    this.tokens = tokens
    this.fee = fee
    this.A = A
    this.reserves = reserves
    this.rates = rates || reserves.map((_) => 1)
    this.ratesBN = this.rates.map(getBigNumber)
    this.reservesRated = this.reserves.map((r, i) => r.mul(this.ratesBN[i]))
    this.D = ZERO

    this.Ann = getBigNumber(A * this.tokens.length)
    this.AnnMinus1 = this.Ann.sub(1)
    this.nn = getBigNumber(Math.pow(this.tokens.length, this.tokens.length))
    this.n = BigNumber.from(this.tokens.length)
    this.nPlus1 = this.n.add(1)
  }

  updateReserve(index: number, res: BigNumber) {
    this.D = ZERO
    this.reserves[index] = res
    this.reservesRated[index] = res.mul(this.ratesBN[index])
  }

  computeLiquidity(): BigNumber {
    if (!this.D.isZero()) return this.D // already calculated
    if (this.reservesRated.some((r) => r.isZero())) return ZERO

    const s = this.reservesRated.reduce((a, b) => a.add(b), ZERO)
    let prevD
    let D = s
    const AnnS = this.Ann.mul(s)
    for (let i = 0; i < 256; i++) {
      let dP = D
      this.reservesRated.forEach((r) => (dP = dP.mul(D).div(r)))
      dP = dP.div(this.nn)
      prevD = D
      // D = (Ann * S + D_P * N_COINS) * D / ((Ann - 1) * D + (N_COINS + 1) * D_P)
      D = AnnS.add(dP.mul(this.n))
        .mul(D)
        .div(this.AnnMinus1.mul(D).add(dP.mul(this.nPlus1)))
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

  calcOutByIn(amountIn: number, from: number, to: number): { out: number; gasSpent: number } {
    amountIn *= this.rates[from]
    const xBN = this.reservesRated[from]
    const yBN = this.reservesRated[to]
    const xNewBN = xBN.add(getBigNumber(amountIn))
    const yNewBN = this.computeY(xNewBN)
    if (yNewBN.lt(MIN_LIQUIDITY)) throw 'Curve pool OutOfLiquidity'
    const dy = parseInt(yBN.sub(yNewBN).toString()) / this.rates[to]
    return { out: dy * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, from: number, to: number): { inp: number; gasSpent: number } {
    amountOut *= this.rates[to]
    const xBN = this.reservesRated[from]
    const yBN = this.reservesRated[to]
    let yNewBN = yBN.sub(getBigNumber(amountOut / (1 - this.fee)))
    if (yNewBN.lt(1))
      // lack of precision
      yNewBN = BigNumber.from(1)

    const xNewBN = this.computeY(yNewBN)
    const input = Math.round(parseInt(xNewBN.sub(xBN).toString()) / this.rates[from])

    //if (input < 1) input = 1
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(from: number, to: number): number {
    const xBN = this.reservesRated[from]
    const x = parseInt(xBN.toString())
    const D = parseInt(this.computeLiquidity().toString())
    const A = this.A / 2 //// TODO !!!!
    const b = 4 * A * x + D - 4 * A * D
    const ac4 = (D * D * D) / x
    const Ds = Math.sqrt(b * b + 4 * A * ac4)
    const price = 0.5 - (2 * b - ac4 / x) / Ds / 4
    const scale = this.rates[from] / this.rates[to]
    return direction ? price * scale : price / scale
  }
}
