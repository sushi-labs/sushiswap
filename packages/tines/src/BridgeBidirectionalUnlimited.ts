import { Address } from 'viem'

import { RPool, RToken } from './PrimaryPools'

export class BridgeUnlimited extends RPool {
  constructor(
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    swapGasCost = 150_000,
  ) {
    super(address as Address, token0, token1, fee, -1n, -1n, 0, swapGasCost)
  }

  calcOutByIn(
    amountIn: number,
    _direction: boolean,
  ): { out: number; gasSpent: number } {
    return { out: amountIn * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcInByOut(
    amountOut: number,
    _direction: boolean,
  ): { inp: number; gasSpent: number } {
    return { inp: amountOut / (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(_direction: boolean): number {
    return 1
  }

  override alwaysAppropriateForPricing() {
    return true
  }
}
