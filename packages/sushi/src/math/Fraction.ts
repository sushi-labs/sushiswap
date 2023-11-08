import invariant from 'tiny-invariant'

import Big from './Big.js'
import { type BigintIsh } from './BigintIsh.js'
import Decimal from './Decimal.js'
import Rounding from './Rounding.js'

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
}

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: Big.roundDown,
  [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
  [Rounding.ROUND_UP]: Big.roundUp,
}

class Fraction {
  public readonly numerator: bigint
  public readonly denominator: bigint

  public constructor(numerator: BigintIsh, denominator: BigintIsh = 1n) {
    this.numerator =
      typeof numerator !== 'bigint' ? BigInt(numerator) : numerator
    this.denominator =
      typeof denominator !== 'bigint' ? BigInt(denominator) : denominator
  }

  private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
    if (
      typeof fractionish === 'number' ||
      typeof fractionish === 'string' ||
      typeof fractionish === 'bigint'
    )
      return new Fraction(fractionish)

    if ('numerator' in fractionish && 'denominator' in fractionish)
      return fractionish
    throw new Error('Could not parse fraction')
  }

  // performs floor division
  public get quotient(): bigint {
    return this.numerator / this.denominator
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator)
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(
        this.numerator + otherParsed.numerator,
        this.denominator,
      )
    }
    return new Fraction(
      this.numerator * otherParsed.denominator +
        otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    )
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(
        this.numerator - otherParsed.numerator,
        this.denominator,
      )
    }
    return new Fraction(
      this.numerator * otherParsed.denominator -
        otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    )
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return (
      this.numerator * otherParsed.denominator <
      otherParsed.numerator * this.denominator
    )
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return (
      this.numerator * otherParsed.denominator ===
      otherParsed.numerator * this.denominator
    )
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return (
      this.numerator * otherParsed.denominator >
      otherParsed.numerator * this.denominator
    )
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(
      this.numerator * otherParsed.numerator,
      this.denominator * otherParsed.denominator,
    )
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(
      this.numerator * otherParsed.denominator,
      this.denominator * otherParsed.numerator,
    )
  }

  public toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP,
  ): string {
    invariant(
      Number.isInteger(significantDigits),
      `${significantDigits} is not an integer.`,
    )
    invariant(significantDigits > 0, `${significantDigits} is not positive.`)

    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    })
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
  }

  public toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP,
  ): string {
    invariant(
      Number.isInteger(decimalPlaces),
      `${decimalPlaces} is not an integer.`,
    )
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(this.numerator.toString())
      .div(this.denominator.toString())
      .toFormat(decimalPlaces, format)
  }

  public toJSON() {
    return {
      n: this.numerator.toString(),
      d: this.denominator.toString(),
    }
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }
}

export default Fraction
