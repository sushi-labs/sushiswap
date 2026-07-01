import { describe, expect, it } from 'vitest'
import {
  getMarginRequiredFromLeverage,
  maxRemovableIsolatedMargin,
} from './isolated-margin-utils'

describe('isolated margin utils', () => {
  it('calculates removable margin from leverage-derived margin requirements', () => {
    const marginRequired = getMarginRequiredFromLeverage({
      leverage: 20,
      positionValue: '100',
    })

    expect(marginRequired).toBe('5')
    expect(
      maxRemovableIsolatedMargin({
        marginRequired,
        marginUsed: '14.88',
        positionValue: '100',
      }),
    ).toBe('4.88')
  })

  it('keeps current leverage margin when it exceeds the 10 percent floor', () => {
    expect(
      maxRemovableIsolatedMargin({
        marginRequired: getMarginRequiredFromLeverage({
          leverage: 5,
          positionValue: '100',
        }),
        marginUsed: '30',
        positionValue: '100',
      }),
    ).toBe('10')
  })

  it('returns zero when margin removal is disabled', () => {
    expect(
      maxRemovableIsolatedMargin({
        canRemove: false,
        marginRequired: '5',
        marginUsed: '14.88',
        positionValue: '100',
      }),
    ).toBe('0')
  })
})
