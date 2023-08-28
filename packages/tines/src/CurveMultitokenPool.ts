/*import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { getBigNumber } from './Utils'

const ZERO = BigNumber.from(0)
const MIN_LIQUIDITY = 1000
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

const E18 = getBigNumber(1e18)

class CurveMultitokenCore {
  address: string
  tokens: RToken[]
  fee: number
  A: number
  reserves: BigNumber[]
  rates: number[]
  ratesBN18: BigNumber[]
  reservesRated: BigNumber[]
  D: BigNumber

  // For faster calculation
  Ann: BigNumber
  Annn: BigNumber
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
    const decimalsMax = Math.max(...tokens.map((t) => t.decimals))
    this.rates = tokens.map((t, i) => Math.pow(10, decimalsMax - t.decimals) * (rates?.[i] ?? 1))
    this.ratesBN18 = this.rates.map((r) => getBigNumber(r * 1e18)) // precision is 18 digits
    this.reservesRated = this.reserves.map((r, i) => r.mul(this.ratesBN18[i]).div(E18))
    this.D = ZERO

    this.Ann = getBigNumber(A * this.tokens.length)
    this.Annn = this.Ann.mul(this.tokens.length)
    this.AnnMinus1 = this.Ann.sub(1)
    this.nn = getBigNumber(Math.pow(this.tokens.length, this.tokens.length))
    this.n = BigNumber.from(this.tokens.length)
    this.nPlus1 = this.n.add(1)
  }

  updateReserve(index: number, res: BigNumber) {
    this.D = ZERO
    this.reserves[index] = res
    this.reservesRated[index] = res.mul(this.ratesBN18[index]).div(E18) // remove precision 1e18
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

  computeY(xIndex: number, x: BigNumber, yIndex: number): BigNumber {
    const D = this.computeLiquidity()
    let c = D
    let S_ = ZERO
    for (let i = 0; i < this.tokens.length; ++i) {
      let _x = ZERO
      if (i == xIndex) _x = x
      else if (i != yIndex) _x = this.reservesRated[i]
      else continue
      S_ = S_.add(_x)
      c = c.mul(D).div(_x).div(this.tokens.length)
    }
    c = c.mul(D).div(this.Annn)
    const b = D.div(this.Ann).add(S_)

    let y_prev = ZERO
    let y = D
    for (let i = 0; i < 256; i++) {
      y_prev = y
      y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D))
      if (y.sub(y_prev).abs().lte(1)) {
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
    const yNewBN = this.computeY(from, xNewBN, to)
    if (yNewBN.lt(MIN_LIQUIDITY)) throw 'Curve pool OutOfLiquidity'
    const dy = parseInt(yBN.sub(yNewBN).toString()) / this.rates[to]
    return { out: dy * (1 - this.fee), gasSpent: SWAP_GAS_COST }
  }

  calcInByOut(amountOut: number, from: number, to: number): { inp: number; gasSpent: number } {
    amountOut *= this.rates[to]
    const xBN = this.reservesRated[from]
    const yBN = this.reservesRated[to]
    let yNewBN = yBN.sub(getBigNumber(amountOut / (1 - this.fee)))
    if (yNewBN.lt(1))
      // lack of precision
      yNewBN = BigNumber.from(1)

    const xNewBN = this.computeY(to, yNewBN, from)
    const input = Math.round(parseInt(xNewBN.sub(xBN).toString()) / this.rates[from])

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
  reserves: BigNumber[],
  rates?: number[]
) {
  const core = new CurveMultitokenCore(address, tokens, fee, A, reserves, rates)
  const pools: CurveMultitokenPool[] = []
  for (let i = 0; i < tokens.length; ++i)
    for (let j = i + 1; j < tokens.length; ++j) pools.push(new CurveMultitokenPool(core, i, j))
  return pools
}
*/
