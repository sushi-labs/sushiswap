import { BigNumber } from '@ethersproject/bignumber'

export const TYPICAL_SWAP_GAS_COST = 60_000
export const TYPICAL_MINIMAL_LIQUIDITY = 1000

export interface RToken {
  name: string
  symbol: string
  address: string
  chainId?: number | string
  tokenId?: string // if tokens' ids are equal then tokens are the same
}

export function setTokenId(...tokens: RToken[]) {
  tokens.forEach((t) => {
    if (!t.tokenId) t.tokenId = `${t.address}_${t.chainId}`
  })
}

export interface PoolState {
  gasSpent: number
}

export interface DefaultPoolState extends PoolState {
  flow: number[]
}

export abstract class RPool {
  readonly address: string
  readonly tokens: RToken[]
  readonly fee: number
  reserves: BigNumber[]
  readonly minLiquidity: number
  readonly swapGasCost: number

  constructor(
    address: string,
    tokens: RToken[],
    fee: number,
    reserves: BigNumber[],
    minLiquidity = TYPICAL_MINIMAL_LIQUIDITY,
    swapGasCost = TYPICAL_SWAP_GAS_COST
  ) {
    this.address = address
    this.tokens = tokens
    setTokenId(...tokens)
    this.fee = fee
    this.minLiquidity = minLiquidity
    this.swapGasCost = swapGasCost
    this.reserves = reserves
  }

  updateReserves(res: BigNumber[]) {
    this.reserves = res
  }
  getReserve(i: number) {
    return this.reserves[i]
  }

  // Returns [<output amount>, <gas consumption estimation>]
  // Should throw if the rest of liquidity is lesser than minLiquidity
  abstract calcOutByIn2(amountIn: number, direction: boolean): { out: number; gasSpent: number }
  abstract calcInByOut2(amountOut: number, direction: boolean): { inp: number; gasSpent: number }
  abstract calcCurrentPriceWithoutFee2(direction: boolean): number

  calcDiff(from: number, to: number, amountIn: number, statePrev?: PoolState): { diff: number; gasSpent: number } {
    if (from > 1 || to > 1 || from == to) throw new Error(`unsupported calcOutput ${from} => ${to}`)
    if (statePrev === undefined) {
      if (amountIn >= 0) {
        const res = this.calcOutByIn2(amountIn, from < to)
        return { diff: -res.out, gasSpent: res.gasSpent }
      } else {
        const res = this.calcInByOut2(-amountIn, to < from)
        return { diff: res.inp, gasSpent: res.gasSpent }
      }
    } else {
      const state = statePrev as DefaultPoolState
      const newInput = state.flow[from] + amountIn
      let diff = 0,
        gasSpent = 0
      if (newInput >= 0) {
        const res = this.calcOutByIn2(newInput, from < to)
        diff = -res.out - state.flow[to]
        gasSpent = res.gasSpent
      } else {
        const res = this.calcInByOut2(-newInput, to < from)
        diff = res.inp - state.flow[to]
        gasSpent = res.gasSpent
      }
      console.assert(diff * amountIn <= 0, 'Wrong pool output1 value: ' + amountIn + '->' + diff)
      return { diff, gasSpent }
    }
  }

  applyChanges(
    from: number,
    fromDelta: number,
    to: number,
    toDelta: number,
    gasSpent: number,
    statePrev?: PoolState
  ): PoolState {
    const state: DefaultPoolState =
      statePrev !== undefined
        ? (statePrev as DefaultPoolState)
        : {
            flow: this.tokens.map(() => 0),
            gasSpent: 0,
          }
    state.flow[from] += fromDelta
    state.flow[to] += toDelta
    state.gasSpent = gasSpent
    return state
  }

  calcCurrentPriceWithoutFee(from: number, to: number): number {
    if (from > 1 || to > 1 || from == to) throw new Error(`unsupported calcInByOut ${from} => ${to}`)
    return this.calcCurrentPriceWithoutFee2(from < to)
  }

  // precision of calcOutByIn2
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

  constructor(address: string, token0: RToken, token1: RToken, fee: number, reserve0: BigNumber, reserve1: BigNumber) {
    super(address, [token0, token1], fee, [reserve0, reserve1])
    this.reserve0Number = parseInt(reserve0.toString())
    this.reserve1Number = parseInt(reserve1.toString())
  }

  updateReserves(res: BigNumber[]) {
    this.reserves = res
    this.reserve0Number = parseInt(res[0].toString())
    this.reserve1Number = parseInt(res[1].toString())
  }

  calcOutByIn2(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    const out = (y * amountIn) / (x / (1 - this.fee) + amountIn)
    if (y - out < this.minLiquidity) throw 'CP OutOfLiquidity'
    return { out, gasSpent: this.swapGasCost }
  }

  calcInByOut2(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    const x = direction ? this.reserve0Number : this.reserve1Number
    const y = direction ? this.reserve1Number : this.reserve0Number
    if (y - amountOut < this.minLiquidity)
      // not possible swap
      return { inp: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    const input = (x * amountOut) / (1 - this.fee) / (y - amountOut)
    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee2(direction: boolean): number {
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
