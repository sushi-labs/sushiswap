import { describe, expect, it } from 'vitest'
import { signAndSendPrivySvmTransaction } from './privy-svm-signing'

class ReceiverSensitivePrivyFeature {
  readonly #signature = new Uint8Array([1, 2, 3])

  async signAndSendTransaction(): Promise<{ signature: Uint8Array }> {
    return { signature: this.#signature }
  }
}

describe('signAndSendPrivySvmTransaction', () => {
  it('calls the Privy feature method with its receiver intact', async () => {
    const privy = new ReceiverSensitivePrivyFeature()

    await expect(
      signAndSendPrivySvmTransaction(privy, {
        address: '11111111111111111111111111111111',
        chain: 'solana:mainnet',
        transaction: new Uint8Array([4, 5, 6]),
      }),
    ).resolves.toEqual({ signature: new Uint8Array([1, 2, 3]) })
  })
})
