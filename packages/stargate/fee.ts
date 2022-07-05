import { Amount, Currency } from '@sushiswap/currency'
import { Fraction, JSBI } from '@sushiswap/math'
import invariant from 'tiny-invariant'

interface FeeLibrary {
  version: string // `${number}.${number}.${number}`
}
//StargateFeeLibraryV01
export interface FeeLibraryV01 extends FeeLibrary {
  version: '1.0.0' // `1.${number}.${number}`
  lpFeeRate: Fraction
  protocolFeeRate: Fraction
  eqFeeRate: Fraction
  eqRewardRate: Fraction
}

//StargateFeeLibraryV02
export interface FeeLibraryV02 extends FeeLibrary {
  version: '2.0.0' // `2.${number}.${number}`
  delta1Rate: Fraction
  delta2Rate: Fraction
  lambda1Rate: Fraction
  lambda2Rate: Fraction
  lpFeeRate: Fraction
  protocolFeeRate: Fraction
  protocolSubsidyRate: Fraction
}

export function getEquilibriumFee(
  _idealBalance: Amount<Currency>,
  _beforeBalance: Amount<Currency>,
  _amount: Amount<Currency>,
  _fee: FeeLibraryV02
): { eqFee: Amount<Currency>; protocolSubsidy: Amount<Currency> } {
  const afterBalance = _beforeBalance.subtract(_amount)

  const safeZoneMaxCurrency = _idealBalance.multiply(_fee.delta1Rate)
  const safeZoneMax = new Fraction(safeZoneMaxCurrency.numerator, safeZoneMaxCurrency.denominator)
  const safeZoneMinCurrency = _idealBalance.multiply(_fee.delta2Rate)
  const safeZoneMin = new Fraction(safeZoneMinCurrency.numerator, safeZoneMinCurrency.denominator)
  const proxyBeforeBalanceCurrency = _beforeBalance.lessThan(safeZoneMax) ? _beforeBalance : safeZoneMax
  const proxyBeforeBalance = new Fraction(proxyBeforeBalanceCurrency.numerator, proxyBeforeBalanceCurrency.denominator)

  let eqFee = Amount.fromRawAmount(_amount.currency, JSBI.BigInt(0))
  let protocolSubsidy = Amount.fromRawAmount(_amount.currency, JSBI.BigInt(0))

  if (afterBalance.greaterThan(safeZoneMax) || afterBalance.equalTo(safeZoneMax)) {
    // no fee zone, protocol subsidezes it
    eqFee = _amount.multiply(_fee.protocolSubsidyRate)
    protocolSubsidy = eqFee
  } else if (afterBalance.greaterThan(safeZoneMin) || afterBalance.equalTo(safeZoneMin)) {
    // safe zone
    eqFee = getTrapezoidArea(
      _amount.currency,
      _fee.lambda1Rate,
      new Fraction(0),
      safeZoneMax,
      safeZoneMin,
      proxyBeforeBalance,
      afterBalance
    )
  } else {
    // danger zone
    if (_beforeBalance.greaterThan(safeZoneMin) || _beforeBalance.equalTo(safeZoneMin)) {
      // across 2 or 3 zones
      // part 1
      eqFee = eqFee.add(
        getTrapezoidArea(
          _amount.currency,
          _fee.lambda1Rate,
          new Fraction(0),
          safeZoneMax,
          safeZoneMin,
          proxyBeforeBalance,
          safeZoneMin
        )
      )
      // part 2
      eqFee = eqFee.add(
        getTrapezoidArea(
          _amount.currency,
          _fee.lambda2Rate,
          _fee.lambda1Rate,
          safeZoneMin,
          new Fraction(0),
          safeZoneMin,
          afterBalance
        )
      )
    } else {
      // only in danger zone
      // part2 only
      eqFee = eqFee.add(
        getTrapezoidArea(
          _amount.currency,
          _fee.lambda2Rate,
          _fee.lambda1Rate,
          safeZoneMin,
          new Fraction(0),
          _beforeBalance,
          afterBalance
        )
      )
    }
  }

  return {
    eqFee,
    protocolSubsidy,
  }
}

function getTrapezoidArea(
  _token: Currency,
  _lambda: Fraction,
  _yOffset: Fraction,
  _xUpperBound: Fraction,
  _xLowerBound: Fraction,
  _xStart: Fraction,
  _xEnd: Fraction
): Amount<Currency> {
  invariant(_xEnd.greaterThan(_xLowerBound) || _xEnd.equalTo(_xLowerBound), 'out of bounds')
  invariant(_xStart.lessThan(_xUpperBound) || _xStart.equalTo(_xUpperBound), 'out of bounds')

  const xBoundWidth = _xUpperBound.subtract(_xLowerBound)
  const yStart = _xUpperBound.subtract(_xStart).multiply(_lambda).divide(xBoundWidth).add(_yOffset)
  const yEnd = _xUpperBound.subtract(_xEnd).multiply(_lambda).divide(xBoundWidth).add(_yOffset)
  const deltaX = _xStart.subtract(_xEnd)
  const area = yStart.add(yEnd).multiply(deltaX).divide(2)

  return Amount.fromFractionalAmount(_token, area.numerator, area.denominator)
}
