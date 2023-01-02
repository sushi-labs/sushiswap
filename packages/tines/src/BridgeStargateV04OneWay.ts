import { BigNumber } from '@ethersproject/bignumber'

import { RPool, RToken } from './PrimaryPools'
import { BridgeState, getStarGateFeesV04 } from './StarGateFeesV04'
import { getBigNumber } from './Utils'

export class BridgeStargateV04OneWay extends RPool {
  bridgeState: BridgeState
  whitelisted: boolean

  constructor(
    id: string, // some kind of bridge ID. Used for tines output
    token0: RToken, // from token
    token1: RToken, // to token
    bridgeState: BridgeState,
    whitelisted: boolean,
    swapGasCost = 150_000
  ) {
    super(id, token0, token1, Number.NaN, BigNumber.from(0), BigNumber.from(0), 0, swapGasCost)
    this.bridgeState = bridgeState
    this.whitelisted = whitelisted
  }

  calcFeeAmount(amountIn: number) {
    const fees = getStarGateFeesV04(this.bridgeState, this.whitelisted, getBigNumber(amountIn))
    const feesTotal = fees.lpFee.add(fees.protocolFee).add(fees.eqFee).sub(fees.eqReward)
    return parseInt(feesTotal.toString())
  }

  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    if (!direction) throw new Error('Wrong way for BridgeStargateV04OneWay')
    const fees = getStarGateFeesV04(this.bridgeState, this.whitelisted, getBigNumber(amountIn))
    const maxAmount = parseInt(this.bridgeState.currentBalance.sub(fees.lpFee).add(fees.eqReward).toString())
    if (amountIn > maxAmount) throw new Error('OutOfLiquidity BridgeStargateV04OneWay')
    const feesTotal = parseInt(fees.lpFee.add(fees.protocolFee).add(fees.eqFee).sub(fees.eqReward).toString())
    const out = amountIn - feesTotal
    console.assert(out >= 0, 'Error 336')
    return { out, gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    throw new Error('calcInByOut for BridgeStargateV04OneWay')
  }

  calcCurrentPriceWithoutFee(_direction: boolean): number {
    return 1
  }

  alwaysAppropriateForPricing() {
    return true
  }
}
