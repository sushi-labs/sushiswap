import { BigNumber } from '@ethersproject/bignumber'
import { RPool, RToken } from '../dist'

const BENTO_MINIMUM_SHARE_BALANCE = 1000 // Bento Shares
const BRIDGING_GAS_COST = 60_000 // gas points

export class BentoBridge extends RPool {
  elastic: number
  base: number

  // elastic is reserve0, base is reserve1
  constructor(address: string, tokenEthereum: RToken, tokenBento: RToken, elastic: BigNumber, base: BigNumber) {
    super(address, tokenEthereum, tokenBento, 0, elastic, base, BENTO_MINIMUM_SHARE_BALANCE, BRIDGING_GAS_COST)
    this.elastic = parseInt(elastic.toString())
    this.base = parseInt(base.toString())
  }

  updateReserves(elastic: BigNumber, base: BigNumber) {
    this.reserve0 = elastic
    this.elastic = parseInt(elastic.toString())
    this.reserve1 = base
    this.base = parseInt(base.toString())
  }

  // direction == true -> deposit: calcs output shares by input amounts
  // direction == false -> withdraw: calcs output amounts by input shares
  calcOutByIn(amountIn: number, direction: boolean): { out: number; gasSpent: number } {
    let out
    if (direction == true) {
      if (this.elastic == 0) {
        out = amountIn
      } else {
        out = (amountIn * this.base) / this.elastic
      }
    } else {
      if (this.base == 0) {
        out = amountIn
      } else {
        out = (amountIn * this.elastic) / this.base
      }
    }
    return { out, gasSpent: this.swapGasCost }
  }

  calcInByOut(amountOut: number, direction: boolean): { inp: number; gasSpent: number } {
    let inp
    if (direction == true) {
      if (this.elastic == 0) {
        inp = amountOut
      } else {
        if (this.base == 0) {
          inp = Number.POSITIVE_INFINITY
        } else {
          inp = (amountOut * this.elastic) / this.base
        }
      }
    } else {
      if (this.base == 0) {
        inp = amountOut
      } else {
        if (this.elastic == 0) {
          inp = Number.POSITIVE_INFINITY
        } else {
          inp = (amountOut * this.base) / this.elastic
        }
      }
    }
    return { inp, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    if (direction == true) {
      if (this.elastic == 0) {
        return 1
      } else {
        return this.base / this.elastic
      }
    } else {
      if (this.base == 0) {
        return 1
      } else {
        return this.elastic / this.base
      }
    }
  }
}
