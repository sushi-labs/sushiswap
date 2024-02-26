import { Address } from 'viem'

import { PoolType, RPool, RToken } from './RPool.js'
import { BridgeState, getStarGateFeesV04 } from './StarGateFeesV04.js'
import { getBigInt } from './Utils.js'

export class BridgeStargateV04OneWay extends RPool {
  bridgeState: BridgeState
  whitelisted: boolean

  constructor(
    id: string, // some kind of bridge ID. Used for tines output
    token0: RToken, // from token
    token1: RToken, // to token
    bridgeState: BridgeState,
    whitelisted: boolean,
    swapGasCost = 150_000,
  ) {
    super(id as Address, token0, token1, Number.NaN, 0n, 0n, 0, swapGasCost)
    this.bridgeState = bridgeState
    this.whitelisted = whitelisted
  }

  calcFeeAmount(amountIn: number) {
    const fees = getStarGateFeesV04(
      this.bridgeState,
      this.whitelisted,
      getBigInt(amountIn),
    )
    const feesTotal = fees.lpFee + fees.protocolFee + fees.eqFee - fees.eqReward
    return parseInt(feesTotal.toString())
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number } {
    if (!direction) throw new Error('Wrong way for BridgeStargateV04OneWay')
    const fees = getStarGateFeesV04(
      this.bridgeState,
      this.whitelisted,
      getBigInt(amountIn),
    )
    const maxAmount = parseInt(
      (this.bridgeState.currentBalance - fees.lpFee + fees.eqReward).toString(),
    )
    if (amountIn > maxAmount)
      throw new Error('OutOfLiquidity BridgeStargateV04OneWay')
    const feesTotal = parseInt(
      (fees.lpFee + fees.protocolFee + fees.eqFee - fees.eqReward).toString(),
    )
    const out = amountIn - feesTotal
    console.assert(out >= 0, 'Error 336')
    return { out, gasSpent: this.swapGasCost }
  }

  calcInByOut(): { inp: number; gasSpent: number } {
    throw new Error('calcInByOut for BridgeStargateV04OneWay')
  }

  calcCurrentPriceWithoutFee(_direction: boolean): number {
    return 1
  }

  override alwaysAppropriateForPricing() {
    return true
  }

  override poolType(): PoolType {
    return PoolType.Bridge
  }
}
