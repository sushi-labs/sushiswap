import { BigintIsh, Fraction, JSBI, MAX_UINT128 } from '@sushiswap/math'
import invariant from 'tiny-invariant'

import { Type } from './Type'

export class Share<T extends Type> extends Fraction {
  public readonly currency: T
  public readonly scale: JSBI

  public static fromRawShare<T extends Type>(currency: T, rawShare: BigintIsh): Share<T> {
    return new Share(currency, rawShare)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MAX_UINT128), 'SHARE')
    this.currency = currency
    this.scale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }
}
