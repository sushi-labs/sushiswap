import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useIsEvmWalletLoading } from './use-is-evm-wallet-loading'

const mocks = vi.hoisted(() => ({
  useAccount: vi.fn(),
  useConnection: vi.fn(),
  usePrivyWallets: vi.fn(),
}))

vi.mock('@privy-io/react-auth', () => ({
  useWallets: mocks.usePrivyWallets,
}))

vi.mock('wagmi', () => ({
  useConnection: mocks.useConnection,
}))

vi.mock('./use-account', () => ({
  useAccount: mocks.useAccount,
}))

describe('useIsEvmWalletLoading', () => {
  beforeEach(() => {
    mocks.useAccount.mockReturnValue(undefined)
    mocks.useConnection.mockReturnValue({
      address: undefined,
      isConnecting: false,
      isReconnecting: false,
    })
    mocks.usePrivyWallets.mockReturnValue({
      ready: true,
      wallets: [],
    })
  })

  it('stops loading for a disconnected wallet after Privy is ready', () => {
    mocks.usePrivyWallets.mockReturnValue({
      ready: true,
      wallets: [{}],
    })

    expect(useIsEvmWalletLoading()).toBe(false)
  })

  it('loads while Privy is resolving wallets', () => {
    mocks.usePrivyWallets.mockReturnValue({
      ready: false,
      wallets: [],
    })

    expect(useIsEvmWalletLoading()).toBe(true)
  })

  it('loads while Wagmi is reconnecting', () => {
    mocks.useConnection.mockReturnValue({
      address: undefined,
      isConnecting: false,
      isReconnecting: true,
    })

    expect(useIsEvmWalletLoading()).toBe(true)
  })

  it('stops loading once Wagmi has connected', () => {
    mocks.useConnection.mockReturnValue({
      address: '0x0000000000000000000000000000000000000001',
      isConnecting: false,
      isReconnecting: false,
    })

    expect(useIsEvmWalletLoading()).toBe(false)
  })

  it('stops loading once the wallet registry has an account', () => {
    mocks.useAccount.mockReturnValue(
      '0x0000000000000000000000000000000000000001',
    )

    expect(useIsEvmWalletLoading()).toBe(false)
  })
})
