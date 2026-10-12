import { describe, expect, it } from 'vitest'
import {
  SPRAAY_MAX_RECIPIENTS,
  SPRAAY_NATIVE_SENTINEL,
  calculateSpraayFee,
  getSpraayDistributionAmount,
  validateSpraayRecipients,
} from './index'

const recipient = '0x000000000000000000000000000000000000dEaD'

describe('batch-distribute', () => {
  it('sums recipient amounts', () => {
    expect(
      getSpraayDistributionAmount([
        { recipient, amount: 1n },
        { recipient, amount: 2n },
      ]),
    ).toBe(3n)
  })

  it('mirrors the contract fee calculation', () => {
    expect(calculateSpraayFee(10_000n, 30n)).toBe(30n)
    expect(calculateSpraayFee(333n, 30n)).toBe(0n)
  })

  it('validates recipient lists', () => {
    expect(validateSpraayRecipients([{ recipient, amount: 1n }])).toBeNull()
    expect(validateSpraayRecipients([])).toBe('No recipients provided')
    expect(
      validateSpraayRecipients(
        Array.from({ length: SPRAAY_MAX_RECIPIENTS + 1 }, () => ({
          recipient,
          amount: 1n,
        })),
      ),
    ).toBe(`Maximum ${SPRAAY_MAX_RECIPIENTS} recipients per batch`)
    expect(
      validateSpraayRecipients([
        { recipient: SPRAAY_NATIVE_SENTINEL, amount: 1n },
      ]),
    ).toBe('Invalid recipient')
    expect(validateSpraayRecipients([{ recipient, amount: 0n }])).toBe(
      'Recipient amounts must be greater than zero',
    )
  })
})
