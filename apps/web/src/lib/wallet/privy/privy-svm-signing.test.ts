import type { Wallet, WalletAccount } from '@wallet-standard/base'
import { describe, expect, it } from 'vitest'
import {
  signAndSendPrivySvmTransaction,
  signPrivySvmTransaction,
} from './privy-svm-signing'

const address = '11111111111111111111111111111111'
const account = { address } as WalletAccount

class ReceiverSensitiveInjection {
  readonly #signature = new Uint8Array([7, 8, 9])

  async signTransaction(): Promise<{ signedTransaction: Uint8Array }> {
    return { signedTransaction: this.#signature }
  }

  async signAndSendTransaction(): Promise<{ signature: Uint8Array }> {
    return { signature: this.#signature }
  }
}

function createWallet(): Wallet {
  const injection = new ReceiverSensitiveInjection()
  return {
    accounts: [account],
    chains: ['solana:mainnet'],
    features: {
      'solana:signTransaction': {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signTransaction: async () => [await injection.signTransaction()],
      },
      'solana:signAndSendTransaction': {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signAndSendTransaction: async () => [
          await injection.signAndSendTransaction(),
        ],
      },
      'privy:': {
        privy: {
          signTransaction: injection.signTransaction,
          signAndSendTransaction: injection.signAndSendTransaction,
        },
      },
    },
    icon: 'data:image/png;base64,AA==',
    name: 'Privy',
    version: '1.0.0',
  } as unknown as Wallet
}

describe('Privy SVM signing', () => {
  it('signs through Wallet Standard instead of the detached private feature', async () => {
    const wallet = createWallet()
    const privateFeature = wallet.features['privy:'] as {
      privy: {
        signTransaction(): Promise<{ signedTransaction: Uint8Array }>
      }
    }

    await expect(privateFeature.privy.signTransaction()).rejects.toThrow(
      TypeError,
    )
    await expect(
      signPrivySvmTransaction({
        address,
        transaction: new Uint8Array([1]),
        wallet,
      }),
    ).resolves.toEqual({ signedTransaction: new Uint8Array([7, 8, 9]) })
  })

  it('signs and sends through Wallet Standard', async () => {
    await expect(
      signAndSendPrivySvmTransaction({
        address,
        transaction: new Uint8Array([1]),
        wallet: createWallet(),
      }),
    ).resolves.toEqual({ signature: new Uint8Array([7, 8, 9]) })
  })
})
