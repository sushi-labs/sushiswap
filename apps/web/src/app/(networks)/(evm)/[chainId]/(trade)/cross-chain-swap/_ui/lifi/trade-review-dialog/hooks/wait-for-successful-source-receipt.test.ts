import { describe, expect, it } from 'vitest'
import {
  CrossChainSourceTransactionFailedError,
  waitForSuccessfulSourceReceipt,
} from './wait-for-successful-source-receipt'

describe('waitForSuccessfulSourceReceipt', () => {
  it('returns a successful source receipt', async () => {
    const receipt = { status: 'success' } as const

    await expect(
      waitForSuccessfulSourceReceipt(
        Promise.resolve(receipt),
        ({ status }) => ({
          status,
        }),
      ),
    ).resolves.toBe(receipt)
  })

  it('rejects a reverted source receipt', async () => {
    await expect(
      waitForSuccessfulSourceReceipt(
        Promise.resolve({ status: 'reverted' } as const),
        () => ({ status: 'failed' }),
      ),
    ).rejects.toBeInstanceOf(CrossChainSourceTransactionFailedError)
  })

  it('preserves receipt observer errors', async () => {
    const observerError = new Error('RPC unavailable')

    await expect(
      waitForSuccessfulSourceReceipt(Promise.reject(observerError), () => ({
        status: 'success',
      })),
    ).rejects.toBe(observerError)
  })
})
