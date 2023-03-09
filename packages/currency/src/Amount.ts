import { Big, BigintIsh, Fraction, JSBI, MAX_UINT256, Rounding, ZERO } from '@sushiswap/math'
import invariant from 'tiny-invariant'

import { Native } from './Native'
import { Share } from './Share'
import { Token } from './Token'
import { Type } from './Type'
import { amountSchema, SerializedAmount } from './zod'

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

  public static fromShare<T extends Type>(
    currency: T,
    shares: BigintIsh,
    rebase: { base: JSBI; elastic: JSBI },
    roundUp = false
  ): Amount<T> {
    if (JSBI.EQ(rebase.base, ZERO)) return new Amount(currency, shares)

    const elastic = JSBI.divide(
      JSBI.multiply(JSBI.BigInt(typeof shares === 'bigint' ? shares.toString() : shares), rebase.elastic),
      rebase.base
    )

    if (
      roundUp &&
      JSBI.LT(
        JSBI.divide(JSBI.multiply(elastic, rebase.base), rebase.elastic),
        JSBI.BigInt(typeof shares === 'bigint' ? shares.toString() : shares)
      )
    ) {
      return new Amount(currency, JSBI.add(elastic, JSBI.BigInt(1)))
    }

    return new Amount(currency, elastic)
  }

  public toShare(rebase: { base: JSBI; elastic: JSBI }, roundUp = false) {
    if (JSBI.EQ(rebase.elastic, ZERO)) return Share.fromRawShare(this.currency, this.quotient)

    const base = JSBI.divide(JSBI.multiply(this.quotient, rebase.base), rebase.elastic)

    if (roundUp && JSBI.LT(JSBI.divide(JSBI.multiply(base, rebase.elastic), rebase.base), this.quotient)) {
      return Share.fromRawShare(this.currency, JSBI.add(base, JSBI.BigInt(1)))
    }

    return Share.fromRawShare(this.currency, base)
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
    denominator: BigintIsh
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

  public toSignificant(significantDigits = 6, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    return super.divide(this.scale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.scale).toFixed(decimalPlaces, format, rounding)
  }

  public toHex(): string {
    return `0x${this.quotient.toString(16)}`
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.scale.toString()).toFormat(format)
  }

  public get wrapped(): Amount<Token> {
    if (this.currency.isToken) return this as Amount<Token>
    return Amount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator)
  }

  public serialize(): SerializedAmount {
    return amountSchema.parse({
      amount: this.quotient.toString(),
      currency: this.currency.serialize(),
    })
  }

  public static deserialize<T extends Type>(amount: SerializedAmount): Amount<T> {
    if (amount.currency.isNative) return Amount.fromRawAmount(Native.deserialize(amount.currency) as T, amount.amount)
    return Amount.fromRawAmount(Token.deserialize(amount.currency) as T, amount.amount)
  }
}
