import { Address } from 'viem'

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
    if (!t.tokenId) {
      if (
        t.address &&
        t.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      )
        t.tokenId = `_${t.chainId}`
      else t.tokenId = `${t.address || ''}_${t.chainId}`
    }
  })
}

export enum PoolType {
  Wrap = 'Wrap',
  Bridge = 'Bridge',
  Classic = 'Classic',
  Concentrated = 'Concentrated',
  Stable = 'Stable',
  Curve = 'Curve',
  Unknown = 'Unknown',
}

export abstract class RPool {
  readonly address: Address
  token0: RToken
  token1: RToken
  readonly fee: number
  reserve0: bigint
  reserve1: bigint
  // flow0: number = 0
  // flow1: number = 0
  // gasSpent: number = 0
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
    swapGasCost = TYPICAL_SWAP_GAS_COST,
  ) {
    this.address = address || '0x'
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

  // Calculates pool output having amountIn input
  // Returns [<output amount>, <gas consumption estimation>] for swap
  // Should throw if the rest of liquidity after swap is lesser than minLiquidity
  /// @param amountIn - input liquidity amount, wei
  /// @param direction - true if token0->token1 swap, false otherwise
  abstract calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number }

  // Calculates pool input having amountOut output. Opposite to calcOutByIn
  // Returns [<input amount>, <gas consumption estimation>]
  // Should return Number.POSITIVE_INFINITY if pool can't return such amountOut
  /// @param amountOut - output liquidity amount, wei
  /// @param direction - true if token0->token1 swap, false otherwise
  abstract calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number }

  // Calculates current pool price without fee
  /// @param direction - if true then how much token0 wei is in 1 token1 wei
  abstract calcCurrentPriceWithoutFee(direction: boolean): number

  // Should return real output, as close to the pool as possible. With rounding. No exceptions
  /// @param amountIn - input liquidity amount, wei
  /// @param direction - true if token0->token1 swap, false otherwise
  calcOutByInReal(amountIn: number, direction: boolean): number {
    return this.calcOutByIn(amountIn, direction).out
  }

  // For multitoken pools
  setCurrentFlow(_flow0: number, _flow1: number, _gas: number) {}

  // For multitoken pools
  cleanTmpData() {}

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

  // not so easy for multitoken pools
  uniqueID(): string {
    return this.address
  }

  poolType(): PoolType {
    return PoolType.Unknown
  }
}
