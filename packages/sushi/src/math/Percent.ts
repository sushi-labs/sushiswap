import { formatPercent } from '../format'

import { type BigintIsh } from './BigintIsh.js'
import Fraction from './Fraction.js'
import Rounding from './Rounding.js'

const ONE_HUNDRED = new Fraction(100n)

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
  return new Percent(fraction.numerator, fraction.denominator)
}

class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent = true as const

  override add(other: Fraction | BigintIsh): Percent {
    return toPercent(super.add(other))
  }

  override subtract(other: Fraction | BigintIsh): Percent {
    return toPercent(super.subtract(other))
  }

  override multiply(other: Fraction | BigintIsh): Percent {
    return toPercent(super.multiply(other))
  }

  override divide(other: Fraction | BigintIsh): Percent {
    return toPercent(super.divide(other))
  }

  public override toSignificant(
    significantDigits = 5,
    format?: object,
    rounding?: Rounding,
  ): string {
    return super
      .multiply(ONE_HUNDRED)
      .toSignificant(significantDigits, format, rounding)
  }

  public override toFixed(
    decimalPlaces = 2,
    format?: object,
    rounding?: Rounding,
  ): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
  }

  public toPercentageString(decimalPlaces = 2): string {
    // +2 since 0.5 = 50%
    return formatPercent(super.toFixed(decimalPlaces + 2))
  }
}

export default Percent
