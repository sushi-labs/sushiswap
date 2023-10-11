import invariant from 'tiny-invariant'
import {
  Big,
  type BigintIsh,
  Fraction,
  MAX_UINT128,
  Rounding,
  ZERO,
} from '../math/index.js'

import { Amount } from './Amount.js'
import { type Type } from './Type.js'

export class Share<T extends Type> extends Fraction {
  public readonly currency: T
  public readonly scale: bigint

  public static fromRawShare<T extends Type>(
    currency: T,
    rawShare: BigintIsh = 0,
  ): Share<T> {
    return new Share(currency, rawShare)
  }

  protected constructor(
    currency: T,
    numerator: BigintIsh,
    denominator?: BigintIsh,
  ) {
    super(numerator, denominator)
    invariant(this.quotient <= MAX_UINT128, 'SHARE')
    this.currency = currency
    this.scale = 10n ** BigInt(currency.decimals)
  }

  public toAmount(rebase: { base: bigint; elastic: bigint }, roundUp = false) {
    if (rebase.base === ZERO)
      return Amount.fromRawAmount(this.currency, this.quotient)

    const elastic = (this.quotient * rebase.elastic) / rebase.base

    if (roundUp && (elastic * rebase.base) / rebase.elastic < this.quotient) {
      return Amount.fromRawAmount(this.currency, elastic + 1n)
    }

    return Amount.fromRawAmount(this.currency, elastic)
  }

  /**
   * Construct a currency share with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token share
   * @param denominator the denominator of the fractional token share
   */
  public static fromFractionalShare<T extends Type>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh,
  ): Share<T> {
    return new Share(currency, numerator, denominator)
  }

  public override add(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return Share.fromFractionalShare(
      this.currency,
      added.numerator,
      added.denominator,
    )
  }

  public override subtract(other: Share<T>): Share<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return Share.fromFractionalShare(
      this.currency,
      subtracted.numerator,
      subtracted.denominator,
    )
  }

  public override multiply(other: Fraction | BigintIsh): Share<T> {
    const multiplied = super.multiply(other)
    return Share.fromFractionalShare(
      this.currency,
      multiplied.numerator,
      multiplied.denominator,
    )
  }

  public override divide(other: Fraction | BigintIsh): Share<T> {
    const divided = super.divide(other)
    return Share.fromFractionalShare(
      this.currency,
      divided.numerator,
      divided.denominator,
    )
  }

  public override toSignificant(
    significantDigits = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return super
      .divide(this.scale)
      .toSignificant(significantDigits, format, rounding)
  }

  public override toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString())
      .div(this.scale.toString())
      .toFormat(format)
  }
}
