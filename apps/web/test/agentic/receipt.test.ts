import { describe, expect, it } from 'vitest'
import { parseReceipt } from './receipt'

describe('parseReceipt', () => {
  it.each([
    ['0x1', 'success'],
    ['0x0', 'reverted'],
  ] as const)('maps %s to %s', (status, expected) => {
    expect(
      parseReceipt({
        blockNumber: '0x10',
        gasUsed: '0x20',
        logs: [],
        status,
        transactionHash:
          '0x0000000000000000000000000000000000000000000000000000000000000001',
      }).status,
    ).toBe(expected)
  })
})
