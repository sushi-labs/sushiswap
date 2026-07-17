import type { Address } from 'viem'
import { describe, expect, it } from 'vitest'
import { isBalanceResponseCurrent } from './balance-request'

const accountA = '0x0000000000000000000000000000000000000001' as Address
const accountB = '0x0000000000000000000000000000000000000002' as Address

describe('isBalanceResponseCurrent', () => {
  it('accepts a response for the current account generation', () => {
    expect(
      isBalanceResponseCurrent(
        { account: accountA, generation: 1 },
        { account: accountA, generation: 1 },
      ),
    ).toBe(true)
  })

  it('rejects account A after switching to account B', () => {
    expect(
      isBalanceResponseCurrent(
        { account: accountA, generation: 1 },
        { account: accountB, generation: 2 },
      ),
    ).toBe(false)
  })

  it('rejects an earlier generation after switching away and back', () => {
    expect(
      isBalanceResponseCurrent(
        { account: accountA, generation: 1 },
        { account: accountA, generation: 3 },
      ),
    ).toBe(false)
  })
})
