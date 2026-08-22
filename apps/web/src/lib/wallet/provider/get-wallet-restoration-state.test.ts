import { describe, expect, it } from 'vitest'
import { getWalletRestorationState } from './get-wallet-restoration-state'

const restoredDisconnectedState = {
  hasRegisteredConnection: false,
  isProviderReady: true,
  isConnecting: false,
  isConnected: false,
}

describe('getWalletRestorationState', () => {
  it('restores while the provider initializes', () => {
    expect(
      getWalletRestorationState({
        ...restoredDisconnectedState,
        isProviderReady: false,
      }),
    ).toBe(true)
  })

  it('restores while the provider connects', () => {
    expect(
      getWalletRestorationState({
        ...restoredDisconnectedState,
        isConnecting: true,
      }),
    ).toBe(true)
  })

  it('restores while a provider connection is being registered', () => {
    expect(
      getWalletRestorationState({
        ...restoredDisconnectedState,
        isConnected: true,
      }),
    ).toBe(true)
  })

  it('finishes restoring once a connection is registered', () => {
    expect(
      getWalletRestorationState({
        hasRegisteredConnection: true,
        isProviderReady: false,
        isConnecting: true,
        isConnected: true,
      }),
    ).toBe(false)
  })

  it('finishes restoring once the provider confirms it is disconnected', () => {
    expect(getWalletRestorationState(restoredDisconnectedState)).toBe(false)
  })
})
