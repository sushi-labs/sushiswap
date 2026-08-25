import { afterEach, describe, expect, it, vi } from 'vitest'
import { waitForValue } from './wait-for-value'

afterEach(() => {
  vi.useRealTimers()
})

describe('waitForValue', () => {
  it('handles a synchronous subscription callback without leaking', async () => {
    let value = 0
    const unsubscribe = vi.fn()

    const result = waitForValue({
      getValue: () => value,
      predicate: (candidate) => candidate === 1,
      subscribe: (listener) => {
        value = 1
        listener()
        return unsubscribe
      },
      timeoutMessage: 'timed out',
      timeoutMs: 1_000,
    })

    await expect(result).resolves.toBe(1)
    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('unsubscribes when the timeout expires', async () => {
    vi.useFakeTimers()
    const unsubscribe = vi.fn()
    const result = waitForValue({
      getValue: () => 0,
      predicate: (candidate) => candidate === 1,
      subscribe: () => unsubscribe,
      timeoutMessage: 'timed out',
      timeoutMs: 1_000,
    })

    const assertion = expect(result).rejects.toThrow('timed out')
    await vi.advanceTimersByTimeAsync(1_000)
    await assertion
    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
