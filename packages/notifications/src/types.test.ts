import { ChainId } from 'sushi'
import { describe, expect, it } from 'vitest'
import {
  type PromiseNotification,
  type ResolvedNotification,
  isPromiseNotification,
} from './types'

const base = {
  account: '0x0000000000000000000000000000000000000000',
  chainId: ChainId.ETHEREUM,
  groupTimestamp: 1,
  timestamp: 1,
  type: 'swap',
} as const

describe('isPromiseNotification', () => {
  it('distinguishes pending notifications from resolved notifications', () => {
    const pending: PromiseNotification = {
      ...base,
      promise: Promise.resolve(),
      summary: { pending: 'Pending', completed: 'Done', failed: 'Failed' },
    }
    const resolved: ResolvedNotification = { ...base, summary: 'Done' }

    expect(isPromiseNotification(pending)).toBe(true)
    expect(isPromiseNotification(resolved)).toBe(false)
  })
})
