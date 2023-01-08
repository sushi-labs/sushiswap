import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'

export class BridgeUnlimited extends RPool {
  constructor(address: string, token0: RToken, token1: RToken, fee: number, swapGasCost = 150_000) {
    super(address, token0, token1, fee, BigNumber.from(-1), BigNumber.from(-1), 0, swapGasCost)
  }

  calcOutByIn(amountIn: number, _direction: boolean): { out: number; gasSpent: number } {
    return { out: amountIn * (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, _direction: boolean): { inp: number; gasSpent: number } {
    return { inp: amountOut / (1 - this.fee), gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(_direction: boolean): number {
    return 1
  }

  alwaysAppropriateForPricing() {
    return true
  }
}
