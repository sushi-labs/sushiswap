import { describe, expect, it } from 'vitest'
import {
  initialApprovalLifecycle,
  transitionApprovalLifecycle,
} from './approval-lifecycle'

describe('approval lifecycle', () => {
  it('opens the gate only after a successful receipt and fresh sufficient allowance', () => {
    let lifecycle = initialApprovalLifecycle()
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      type: 'request-created',
    })
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      type: 'wallet-accepted',
    })
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      type: 'transaction-broadcast',
    })
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      status: 'success',
      type: 'receipt-found',
    })
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      sufficient: true,
      type: 'allowance-refreshed',
    })

    expect(lifecycle.state).toBe('gate-open')
    expect(lifecycle.history).toEqual([
      'idle',
      'request-created',
      'wallet-accepted',
      'transaction-broadcast',
      'receipt-found',
      'receipt-success',
      'allowance-refreshed',
      'gate-open',
    ])
  })

  it('makes a reverted receipt terminal without opening the gate', () => {
    let lifecycle = initialApprovalLifecycle()
    for (const type of [
      'request-created',
      'wallet-accepted',
      'transaction-broadcast',
    ] as const) {
      lifecycle = transitionApprovalLifecycle(lifecycle, { type })
    }
    lifecycle = transitionApprovalLifecycle(lifecycle, {
      status: 'reverted',
      type: 'receipt-found',
    })

    expect(lifecycle.state).toBe('failed')
    expect(lifecycle.history).not.toContain('gate-open')
  })
})
