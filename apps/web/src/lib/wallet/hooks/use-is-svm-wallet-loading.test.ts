import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useIsSvmWalletLoading } from './use-is-svm-wallet-loading'

const mocks = vi.hoisted(() => ({
  useAccount: vi.fn(),
  useConnector: vi.fn(),
  useStandardWallets: vi.fn(),
}))

vi.mock('@privy-io/react-auth/solana', () => ({
  useStandardWallets: mocks.useStandardWallets,
}))

vi.mock('@solana/connector/react', () => ({
  useConnector: mocks.useConnector,
}))

vi.mock('./use-account', () => ({
  useAccount: mocks.useAccount,
}))

describe('useIsSvmWalletLoading', () => {
  beforeEach(() => {
    mocks.useAccount.mockReturnValue(undefined)
    mocks.useConnector.mockReturnValue({
      wallet: { status: 'disconnected' },
    })
    mocks.useStandardWallets.mockReturnValue({
      ready: true,
      wallets: [],
    })
  })

  it('stops loading for a disconnected wallet after Privy is ready', () => {
    mocks.useStandardWallets.mockReturnValue({
      ready: true,
      wallets: [{}],
    })

    expect(useIsSvmWalletLoading()).toBe(false)
  })

  it('loads while Privy is resolving standard wallets', () => {
    mocks.useStandardWallets.mockReturnValue({
      ready: false,
      wallets: [],
    })

    expect(useIsSvmWalletLoading()).toBe(true)
  })

  it('loads while the Solana connector is connecting', () => {
    mocks.useConnector.mockReturnValue({
      wallet: {
        status: 'connecting',
        connectorId: 'wallet-standard:phantom',
      },
    })

    expect(useIsSvmWalletLoading()).toBe(true)
  })

  it('stops loading once the Solana connector has connected', () => {
    mocks.useConnector.mockReturnValue({
      wallet: {
        status: 'connected',
        session: {
          selectedAccount: {
            address: '11111111111111111111111111111111',
          },
        },
      },
    })

    expect(useIsSvmWalletLoading()).toBe(false)
  })

  it('stops loading once the wallet registry has an account', () => {
    mocks.useAccount.mockReturnValue('11111111111111111111111111111111')

    expect(useIsSvmWalletLoading()).toBe(false)
  })
})
