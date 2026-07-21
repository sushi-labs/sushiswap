import { describe, expect, it } from 'vitest'
import { getBalanceRetryDelay, shouldRetryBalanceFetch } from './balance-retry'

describe('balance retry policy', () => {
  it('allows a retry after one transient failure', () => {
    expect(
      shouldRetryBalanceFetch({
        failureCount: 1,
        force: false,
        lastErrorAt: 1_000,
        now: 1_999,
      }),
    ).toBe(false)
    expect(
      shouldRetryBalanceFetch({
        failureCount: 1,
        force: false,
        lastErrorAt: 1_000,
        now: 2_000,
      }),
    ).toBe(true)
  })

  it('caps automatic backoff at 30 seconds', () => {
    expect(getBalanceRetryDelay(100)).toBe(30_000)
  })

  it('allows an explicit retry during backoff', () => {
    expect(
      shouldRetryBalanceFetch({
        failureCount: 3,
        force: true,
        lastErrorAt: 1_000,
        now: 1_001,
      }),
    ).toBe(true)
  })
})
