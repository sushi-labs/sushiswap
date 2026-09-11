import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWalletConnection } from './use-wallet-connection'

const mocks = vi.hoisted(() => ({
  useWalletContext: vi.fn(),
  useWalletRestorationState: vi.fn(),
  useWalletState: vi.fn(),
}))

vi.mock('../provider', () => ({
  useWalletContext: mocks.useWalletContext,
}))

vi.mock('../provider/store', () => ({
  useWalletRestorationState: mocks.useWalletRestorationState,
}))

vi.mock('../provider/wallet-state-provider', () => ({
  useWalletState: mocks.useWalletState,
}))

const evmConnection = {
  id: 'evm:injected',
  name: 'Injected',
  namespace: 'evm',
  account: '0x0000000000000000000000000000000000000001',
  chainId: 1,
}

describe('useWalletConnection', () => {
  beforeEach(() => {
    mocks.useWalletContext.mockReturnValue({
      connections: [],
      isConnected: false,
      isPending: false,
    })
    mocks.useWalletRestorationState.mockReturnValue({
      evm: false,
      svm: false,
      stellar: false,
    })
    mocks.useWalletState.mockReturnValue({
      isPending: false,
      pendingWalletId: undefined,
    })
  })

  it('returns connection information for a namespace', () => {
    mocks.useWalletContext.mockReturnValue({
      connections: [evmConnection],
      isConnected: true,
      isPending: false,
    })

    expect(useWalletConnection('evm')).toEqual({
      address: evmConnection.account,
      connection: evmConnection,
      isConnected: true,
      isPending: false,
      isRestoring: false,
      status: 'connected',
    })
  })

  it('returns namespace-specific restoration state', () => {
    mocks.useWalletRestorationState.mockReturnValue({
      evm: true,
      svm: false,
      stellar: false,
    })

    expect(useWalletConnection('evm')).toEqual({
      address: undefined,
      connection: undefined,
      isConnected: false,
      isPending: false,
      isRestoring: true,
      status: 'restoring',
    })
    expect(useWalletConnection('svm').isRestoring).toBe(false)
  })

  it('returns aggregate state when no namespace is provided', () => {
    mocks.useWalletContext.mockReturnValue({
      connections: [],
      isConnected: false,
    })
    mocks.useWalletState.mockReturnValue({
      isPending: true,
      pendingWalletId: 'evm:injected',
    })
    mocks.useWalletRestorationState.mockReturnValue({
      evm: true,
      svm: false,
      stellar: false,
    })

    expect(useWalletConnection()).toEqual({
      address: undefined,
      connection: undefined,
      isConnected: false,
      isPending: true,
      isRestoring: true,
      status: 'connecting',
    })
  })

  it('scopes pending state to the requested namespace', () => {
    mocks.useWalletState.mockReturnValue({
      isPending: true,
      pendingWalletId: 'svm:phantom',
    })

    expect(useWalletConnection('evm').isPending).toBe(false)
    expect(useWalletConnection('svm').isPending).toBe(true)
  })

  it('scopes a pending Privy reconnect to EVM', () => {
    mocks.useWalletState.mockReturnValue({
      isPending: true,
      pendingWalletId: undefined,
    })

    expect(useWalletConnection().isPending).toBe(true)
    expect(useWalletConnection('evm').isPending).toBe(true)
    expect(useWalletConnection('svm').isPending).toBe(false)
  })
})
