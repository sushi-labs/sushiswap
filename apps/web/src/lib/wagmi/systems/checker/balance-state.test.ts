import { describe, expect, it } from 'vitest'
import { getBalanceState, hasSufficientBalance } from './balance-state'

class TestAmount {
  constructor(readonly value: number) {}

  lt(other: TestAmount): boolean {
    return this.value < other.value
  }
}

describe('getBalanceState', () => {
  it('distinguishes loading, known, and unavailable balances', () => {
    expect(getBalanceState(undefined, false)).toBe('loading')
    expect(getBalanceState(new Map(), false)).toBe('known')
    expect(getBalanceState(undefined, true)).toBe('unavailable')
  })
})

describe('hasSufficientBalance', () => {
  const requested = new TestAmount(10)

  it('requires a balance for every amount', () => {
    expect(
      hasSufficientBalance(
        [requested],
        () => undefined,
        (balance, amount) => balance.lt(amount),
      ),
    ).toBe(false)
  })

  it('rejects a known insufficient balance', () => {
    expect(
      hasSufficientBalance(
        [requested],
        () => new TestAmount(9),
        (balance, amount) => balance.lt(amount),
      ),
    ).toBe(false)
  })

  it('accepts a known sufficient balance', () => {
    expect(
      hasSufficientBalance(
        [requested],
        () => new TestAmount(10),
        (balance, amount) => balance.lt(amount),
      ),
    ).toBe(true)
  })
})
