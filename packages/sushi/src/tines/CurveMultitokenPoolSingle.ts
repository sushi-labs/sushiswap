//import { bigint } from '@ethersproject/bignumber'
import { Address } from 'viem'
import { PoolType, RPool, RToken } from './RPool.js'
import { getBigInt } from './Utils.js'

const ZERO = 0n
const MIN_LIQUIDITY = 1000
const SWAP_GAS_COST = 90_000

// Only one pair osf  the pool can be used - the first one
export class CurveMultitokenPoolSingle extends RPool {
  core: CurveMultitokenCoreSingle
  index0: number
  index1: number

  constructor(core: CurveMultitokenCoreSingle, index0: number, index1: number) {
    super(
      core.address as Address,
      core.tokens[index0] as RToken,
      core.tokens[index1] as RToken,
      core.fee,
      core.reserves[index0] as bigint,
      core.reserves[index1] as bigint,
      MIN_LIQUIDITY,
      SWAP_GAS_COST,
    )
    this.core = core
    this.index0 = index0
    this.index1 = index1
  }

  override updateReserves(res0: bigint, res1: bigint) {
    super.updateReserves(res0, res1)
    this.core.updateReserve(this.index0, res0)
    this.core.updateReserve(this.index1, res1)
  }

  override poolType(): PoolType {
    return PoolType.Curve
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number } {
    if (direction)
      return this.core.calcOutByIn(amountIn, this.index0, this.index1)
    else return this.core.calcOutByIn(amountIn, this.index1, this.index0)
  }

  calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number } {
    if (direction)
      return this.core.calcInByOut(amountOut, this.index0, this.index1)
    else return this.core.calcInByOut(amountOut, this.index1, this.index0)
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    if (direction)
      return this.core.calcCurrentPriceWithoutFee(this.index0, this.index1)
    else return this.core.calcCurrentPriceWithoutFee(this.index1, this.index0)
  }

  override setCurrentFlow(flow0: number, flow1: number, gas: number) {
    this.core.setCurrentFlow(this.index1, this.index0, flow0, flow1, gas)
  }
}

const E18 = getBigInt(1e18)

class CurveMultitokenCoreSingle {
  address: string
  tokens: RToken[]
  fee: number
  A: number
  reserves: bigint[]
  rates: number[]
  ratesBN18: bigint[]
  reservesRated: bigint[]
  singlePairUsed?: [number, number] | undefined
  D: bigint

  // For faster calculation
  Ann: bigint
  Annn: bigint
  AnnMinus1: bigint
  nn: bigint
  n: bigint
  nPlus1: bigint

  constructor(
    address: string,
    tokens: RToken[],
    fee: number,
    A: number,
    reserves: bigint[],
    rates?: number[],
  ) {
    this.address = address
    this.tokens = tokens
    this.fee = fee
    this.A = A
    this.reserves = reserves
    const decimalsMax = Math.max(...tokens.map((t) => t.decimals))
    this.rates = tokens.map(
      (t, i) => 10 ** (decimalsMax - t.decimals) * (rates?.[i] ?? 1),
    )
    this.ratesBN18 = this.rates.map((r) => getBigInt(r * 1e18)) // precision is 18 digits
    this.reservesRated = this.reserves.map(
      (r, i) => (r * (this.ratesBN18[i] as bigint)) / E18,
    )
    this.D = ZERO

    this.Ann = getBigInt(A * this.tokens.length)
    this.n = BigInt(this.tokens.length)
    this.Annn = this.Ann * this.n
    this.AnnMinus1 = this.Ann - 1n
    this.nn = getBigInt(this.tokens.length ** this.tokens.length)
    this.nPlus1 = this.n + 1n
  }

  updateReserve(index: number, res: bigint) {
    this.D = ZERO
    this.reserves[index] = res
    this.reservesRated[index] = (res * (this.ratesBN18[index] as bigint)) / E18 // remove precision 1e18
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
      this.reservesRated.forEach((r) => {
        dP = (dP * D) / r
      })
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
      if (i === xIndex) _x = x
      else if (i !== yIndex) _x = this.reservesRated[i] as bigint
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

  calcOutByIn(
    amountIn: number,
    from: number,
    to: number,
  ): { out: number; gasSpent: number } {
    if (this.singlePairUsed)
      if (this.singlePairUsed[0] !== from || this.singlePairUsed[1] !== to)
        throw 'Curve pool unused pair'
    amountIn *= this.rates[from] as number
    const xBN = this.reservesRated[from] as bigint
    const yBN = this.reservesRated[to] as bigint
    const xNewBN = xBN + getBigInt(amountIn)
    const yNewBN = this.computeY(from, xNewBN, to)
    if (yNewBN < MIN_LIQUIDITY) throw 'Curve pool OutOfLiquidity'
    const dy = Number(yBN - yNewBN) / (this.rates[to] as number)
    return { out: dy * (1 - this.fee), gasSpent: SWAP_GAS_COST }
  }

  calcInByOut(
    amountOut: number,
    from: number,
    to: number,
  ): { inp: number; gasSpent: number } {
    if (this.singlePairUsed)
      if (this.singlePairUsed[0] !== from || this.singlePairUsed[1] !== to)
        return { inp: Number.POSITIVE_INFINITY, gasSpent: 0 }
    amountOut *= this.rates[to] as number
    const xBN = this.reservesRated[from] as bigint
    const yBN = this.reservesRated[to] as bigint
    let yNewBN = yBN - getBigInt(amountOut / (1 - this.fee))
    if (yNewBN < 1)
      // lack of precision
      yNewBN = 1n

    const xNewBN = this.computeY(to, yNewBN, from)
    const input = Math.round(
      Number(xNewBN - xBN) / (this.rates[from] as number),
    )

    //if (input < 1) input = 1
    return { inp: input, gasSpent: SWAP_GAS_COST }
  }

  calcCurrentPriceWithoutFee(from: number, to: number): number {
    const xInp = Number(this.reservesRated[from])
    const D = Number(this.computeLiquidity())
    let Sx = 0
    let Px = 1
    this.tokens.forEach((_, i) => {
      if (i === to) return
      const x = Number(this.reservesRated[i])
      Sx += x
      Px *= x
    })
    const n = this.tokens.length
    const b = Sx + D / this.A / n - D
    const c = (D / n) ** (n + 1) / Px / this.A
    const Ds = Math.sqrt(b * b + 4 * c)
    const dD = 2 * b - (4 * c) / xInp
    const price = 0.5 - dD / Ds / 4
    const scale = (this.rates[from] as number) / (this.rates[to] as number)
    return price * scale
  }

  setCurrentFlow(
    from: number,
    to: number,
    flow0: number,
    flow1: number,
    _gas: number,
  ) {
    if (this.singlePairUsed) {
      if (flow0 !== 0 || flow1 !== 0)
        console.assert(
          this.singlePairUsed[0] === from && this.singlePairUsed[1] === to,
          'CurveMultitokenCoreSingle unexpected pair error',
        )
      else this.singlePairUsed = undefined
    } else {
      if (flow0 !== 0 || flow1 !== 0) this.singlePairUsed = [from, to]
    }
  }
}

export function createCurvePoolsSingleForMultipool(
  address: string,
  tokens: RToken[],
  fee: number,
  A: number,
  reserves: bigint[],
  rates?: number[],
) {
  const core = new CurveMultitokenCoreSingle(
    address,
    tokens,
    fee,
    A,
    reserves,
    rates,
  )
  const pools: CurveMultitokenPoolSingle[] = []
  for (let i = 0; i < tokens.length; ++i)
    for (let j = i + 1; j < tokens.length; ++j)
      pools.push(new CurveMultitokenPoolSingle(core, i, j))
  return pools
}
