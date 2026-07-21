import type { ReplacementReason } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  TransactionReceiptRevertedError,
  TransactionReplacedError,
  waitForSuccessfulReceipt,
} from './wait-for-successful-receipt'

interface ReplacementParameters {
  onReplaced(replacement: { reason: ReplacementReason }): void
}

describe('waitForSuccessfulReceipt', () => {
  it('returns a successful receipt', async () => {
    const receipt = { status: 'success', transactionHash: '0xabc' } as const
    const client = {
      waitForTransactionReceipt: async () => receipt,
    }

    await expect(
      waitForSuccessfulReceipt(client, receipt.transactionHash),
    ).resolves.toBe(receipt)
  })

  it('rejects a reverted receipt even though receipt polling resolved', async () => {
    const receipt = {
      status: 'reverted',
      transactionHash: '0xdead',
    } as const
    const client = {
      waitForTransactionReceipt: async () => receipt,
    }

    await expect(
      waitForSuccessfulReceipt(client, receipt.transactionHash),
    ).rejects.toBeInstanceOf(TransactionReceiptRevertedError)
  })

  it('accepts a repriced transaction with the same intent', async () => {
    const receipt = { status: 'success', transactionHash: '0xabc' } as const
    const client = {
      waitForTransactionReceipt: async ({
        onReplaced,
      }: ReplacementParameters) => {
        onReplaced({ reason: 'repriced' })
        return receipt
      },
    }

    await expect(
      waitForSuccessfulReceipt(client, receipt.transactionHash),
    ).resolves.toBe(receipt)
  })

  it.each(['cancelled', 'replaced'] as const)(
    'rejects a %s transaction',
    async (reason) => {
      const receipt = {
        status: 'success',
        transactionHash: '0xabc',
      } as const
      const client = {
        waitForTransactionReceipt: async ({
          onReplaced,
        }: ReplacementParameters) => {
          onReplaced({ reason })
          return receipt
        },
      }

      await expect(
        waitForSuccessfulReceipt(client, receipt.transactionHash),
      ).rejects.toBeInstanceOf(TransactionReplacedError)
    },
  )
})
