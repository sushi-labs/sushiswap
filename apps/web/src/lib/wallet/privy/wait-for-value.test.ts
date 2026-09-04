import { afterEach, describe, expect, it, vi } from 'vitest'
import { WaitForValueTimeoutError, waitForValue } from './wait-for-value'

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

    const assertion = expect(result).rejects.toEqual(
      expect.objectContaining({
        message: 'timed out',
        name: WaitForValueTimeoutError.name,
      }),
    )
    await vi.advanceTimersByTimeAsync(1_000)
    await assertion
    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('rejects an already-aborted wait without subscribing', async () => {
    const controller = new AbortController()
    const error = new Error('cancelled before waiting')
    const subscribe = vi.fn(() => vi.fn())
    controller.abort(error)

    await expect(
      waitForValue({
        getValue: () => 0,
        predicate: (candidate) => candidate === 1,
        signal: controller.signal,
        subscribe,
        timeoutMessage: 'timed out',
        timeoutMs: 1_000,
      }),
    ).rejects.toBe(error)
    expect(subscribe).not.toHaveBeenCalled()
  })

  it('unsubscribes when an active wait is cancelled', async () => {
    const controller = new AbortController()
    const error = new Error('cancelled while waiting')
    const unsubscribe = vi.fn()
    const result = waitForValue({
      getValue: () => 0,
      predicate: (candidate) => candidate === 1,
      signal: controller.signal,
      subscribe: () => unsubscribe,
      timeoutMessage: 'timed out',
      timeoutMs: 1_000,
    })

    controller.abort(error)

    await expect(result).rejects.toBe(error)
    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
