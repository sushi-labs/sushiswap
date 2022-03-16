import invariant from 'tiny-invariant'
import { JSBI, Fraction, Big, BigintIsh, Rounding, MAX_UINT256, ONE, ZERO } from 'math'
import { Token } from './Token'
import { Type } from './Type'

export class Amount<T extends Type> extends Fraction {
  public readonly currency: T
  public readonly scale: JSBI

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Type>(currency: T, rawAmount: BigintIsh): Amount<T> {
    return new Amount(currency, rawAmount)
  }

  public static fromShares<T extends Token>(
    currency: T,
    shares: BigintIsh,
    rebase: { base: JSBI; elastic: JSBI },
  ): Amount<T> {
    return new Amount(
      currency,
      JSBI.GT(rebase.base, 0) ? JSBI.divide(JSBI.multiply(JSBI.BigInt(shares), rebase.elastic), rebase.base) : ZERO,
    )
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends Type>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh,
  ): Amount<T> {
    return new Amount(currency, numerator, denominator)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MAX_UINT256), 'AMOUNT')
    this.currency = currency
    this.scale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }

  public add(other: Amount<T>): Amount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return Amount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: Amount<T>): Amount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return Amount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): Amount<T> {
    const multiplied = super.multiply(other)
    return Amount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): Amount<T> {
    const divided = super.divide(other)
    return Amount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator)
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    return super.divide(this.scale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN,
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.scale.toString()).toFormat(format)
  }

  public get wrapped(): Amount<Token> {
    if (this.currency.isToken) return this as Amount<Token>
    return Amount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator)
  }
}
