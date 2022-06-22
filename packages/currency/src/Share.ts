import { BigintIsh, Fraction, JSBI, MAX_UINT128, ZERO } from '@sushiswap/math'
import invariant from 'tiny-invariant'

import { Amount } from './Amount'
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

  public toAmount(rebase: { base: JSBI; elastic: JSBI }, roundUp = false) {
    return Amount.fromRawAmount(
      this.currency,
      JSBI.GT(rebase.base, 0)
        ? JSBI[roundUp ? 'add' : 'subtract'](
            JSBI.divide(JSBI.multiply(this.quotient, rebase.elastic), rebase.base),
            JSBI.BigInt(1)
          )
        : ZERO
    )
  }
}
