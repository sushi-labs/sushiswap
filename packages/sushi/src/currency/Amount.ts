import invariant from 'tiny-invariant'
import {
  Big,
  type BigintIsh,
  Fraction,
  MAX_UINT256,
  Rounding,
  ZERO,
} from '../math/index.js'
import { Native } from './Native.js'
import { Share } from './Share.js'
import { Token } from './Token.js'
import { type Type } from './Type.js'
import { type SerializedAmount, amountSchema } from './zod.js'

export class Amount<T extends Type> extends Fraction {
  public readonly currency: T
  public readonly scale: bigint
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Type>(
    currency: T,
    rawAmount: BigintIsh,
  ): Amount<T> {
    return new Amount(currency, rawAmount)
  }

  public static fromShare<T extends Type>(
    currency: T,
    shares: BigintIsh,
    rebase: { base: bigint; elastic: bigint },
    roundUp = false,
  ): Amount<T> {
    if (rebase.base === ZERO) return new Amount(currency, shares)

    const sharesBI =
      typeof shares === 'bigint' ? shares : BigInt(shares.toString())

    const elastic = (sharesBI * rebase.elastic) / rebase.base

    if (roundUp && (elastic * rebase.base) / rebase.elastic < sharesBI) {
      return new Amount(currency, elastic + 1n)
    }

    return new Amount(currency, elastic)
  }

  public toShare(rebase: { base: bigint; elastic: bigint }, roundUp = false) {
    if (rebase.elastic === ZERO)
      return Share.fromRawShare(this.currency, this.quotient)

    const base = (this.quotient * rebase.base) / rebase.elastic

    if (roundUp && (base * rebase.elastic) / rebase.base < this.quotient) {
      return Share.fromRawShare(this.currency, base + 1n)
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
    denominator: BigintIsh,
  ): Amount<T> {
    return new Amount(currency, numerator, denominator)
  }

  protected constructor(
    currency: T,
    numerator: BigintIsh,
    denominator?: BigintIsh,
  ) {
    super(numerator, denominator)
    invariant(this.quotient <= MAX_UINT256, 'AMOUNT')
    this.currency = currency
    this.scale = 10n ** BigInt(currency.decimals)
  }

  public override add(other: Amount<T>): Amount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return Amount.fromFractionalAmount(
      this.currency,
      added.numerator,
      added.denominator,
    )
  }

  public override subtract(other: Amount<T>): Amount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return Amount.fromFractionalAmount(
      this.currency,
      subtracted.numerator,
      subtracted.denominator,
    )
  }

  public override multiply(other: Fraction | BigintIsh): Amount<T> {
    const multiplied = super.multiply(other)
    return Amount.fromFractionalAmount(
      this.currency,
      multiplied.numerator,
      multiplied.denominator,
    )
  }

  public override divide(other: Fraction | BigintIsh): Amount<T> {
    const divided = super.divide(other)
    return Amount.fromFractionalAmount(
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

  public toHex(): string {
    return `0x${this.quotient.toString(16)}`
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString())
      .div(this.scale.toString())
      .toFormat(format)
  }

  public get wrapped(): Amount<Token> {
    if (this.currency.isToken) return this as Amount<Token>
    return Amount.fromFractionalAmount(
      this.currency.wrapped,
      this.numerator,
      this.denominator,
    )
  }

  public serialize(): SerializedAmount {
    return amountSchema.parse({
      amount: this.quotient.toString(),
      currency: this.currency.serialize(),
    })
  }

  public static deserialize<T extends Type>(
    amount: SerializedAmount,
  ): Amount<T> {
    if (amount.currency.isNative)
      return Amount.fromRawAmount(
        Native.deserialize(amount.currency) as T,
        amount.amount,
      )
    return Amount.fromRawAmount(
      Token.deserialize(amount.currency) as T,
      amount.amount,
    )
  }
}
