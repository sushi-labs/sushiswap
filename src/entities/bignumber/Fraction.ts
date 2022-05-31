import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { One, Zero } from '@ethersproject/constants'
import { Fraction as SDKFraction } from '@sushiswap/core-sdk'
import { formatBalance } from 'app/functions/format'
import { parseBalance } from 'app/functions/parse'
import { isEmptyValue } from 'app/functions/validate'

export class Fraction {
  static BASE = BigNumber.from(10).pow(18)

  static NAN = new Fraction(Zero, Zero)

  static ZERO = new Fraction(Zero, One)

  static convert(sdk: SDKFraction): Fraction {
    return new Fraction(BigNumber.from(sdk.numerator.toString()), BigNumber.from(sdk.denominator.toString()))
  }

  static from(numerator: BigNumberish, denominator: BigNumberish): Fraction {
    return new Fraction(BigNumber.from(numerator), BigNumber.from(denominator))
  }

  static parse(value: string): Fraction {
    return value === ''
      ? Fraction.NAN
      : isEmptyValue(value)
      ? Fraction.ZERO
      : new Fraction(parseBalance(value, 18), Fraction.BASE)
  }

  numerator: BigNumber
  denominator: BigNumber

  private constructor(numerator: BigNumber, denominator: BigNumber) {
    this.numerator = numerator
    this.denominator = denominator
  }

  isZero(): boolean {
    return !this.isNaN() && this.numerator.isZero()
  }

  isNaN(): boolean {
    return this.denominator.isZero()
  }

  eq(fraction: Fraction): boolean {
    return this.numerator.mul(fraction.denominator).div(fraction.numerator).eq(this.denominator)
  }

  gt(fraction: Fraction): boolean {
    return this.numerator.mul(fraction.denominator).div(fraction.numerator).gt(this.denominator)
  }

  lt(fraction: Fraction): boolean {
    return this.numerator.mul(fraction.denominator).div(fraction.numerator).lt(this.denominator)
  }

  toString(maxFractions = 8): string {
    if (this.isNaN()) return ''
    if (this.isZero()) return '0'
    let str = formatBalance(this.numerator.mul(Fraction.BASE).div(this.denominator), 18, maxFractions)
    if (str.endsWith('.0')) str = str.substring(0, str.length - 2)
    return str
  }

  apply(value: BigNumberish): BigNumber {
    return this.denominator.isZero() ? Zero : this.numerator.mul(value).div(this.denominator)
  }
}
