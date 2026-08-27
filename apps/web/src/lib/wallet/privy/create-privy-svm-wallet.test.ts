import type { PrivyStandardWallet } from '@privy-io/react-auth/solana'
import type { Wallet } from '@wallet-standard/base'
import type { SvmAddress } from 'sushi/svm'
import { describe, expect, it, vi } from 'vitest'
import { createPrivySvmWallet } from './create-privy-svm-wallet'

const ADDRESS = '11111111111111111111111111111111' as SvmAddress

function createSourceWallet(): PrivyStandardWallet {
  const sourceConnect = vi.fn(async () => ({ accounts: [] }))
  return {
    accounts: [],
    chains: ['solana:mainnet'],
    features: {
      'standard:connect': { version: '1.0.0', connect: sourceConnect },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: vi.fn(async () => undefined),
      },
      'standard:events': {
        version: '1.0.0',
        on: vi.fn(() => () => undefined),
      },
      'solana:signAndSendTransaction': {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signAndSendTransaction: vi.fn(),
      },
      'solana:signTransaction': {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signTransaction: vi.fn(),
      },
      'solana:signMessage': {
        version: '1.0.0',
        signMessage: vi.fn(),
      },
      'privy:': {
        privy: {
          signAndSendTransaction: vi.fn(),
          signMessage: vi.fn(),
          signTransaction: vi.fn(),
        },
      },
    },
    icon: 'data:image/png;base64,AA==',
    isPrivyWallet: true,
    name: 'Privy',
    version: '1.0.0',
  } as unknown as PrivyStandardWallet
}

describe('createPrivySvmWallet', () => {
  it('connects the linked account while preserving Privy signing features', async () => {
    const source = createSourceWallet()
    const wallet = createPrivySvmWallet({ address: ADDRESS, wallet: source })

    expect(wallet.accounts).toHaveLength(1)
    expect(wallet.accounts[0]?.address).toBe(ADDRESS)
    expect(wallet.accounts[0]?.publicKey).toHaveLength(32)
    expect(wallet.features['solana:signAndSendTransaction']).toBe(
      source.features['solana:signAndSendTransaction'],
    )

    const connect = wallet.features['standard:connect'] as {
      connect(): Promise<{ accounts: readonly Wallet['accounts'][number][] }>
    }
    await expect(connect.connect()).resolves.toEqual({
      accounts: wallet.accounts,
    })
    expect(source.accounts).toEqual([])
  })
})
