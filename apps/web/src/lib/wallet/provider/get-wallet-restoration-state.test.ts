import { describe, expect, it } from 'vitest'
import {
  getIsPrivyWalletProviderReady,
  getWalletRestorationState,
} from './get-wallet-restoration-state'

const restoredDisconnectedState = {
  hasRegisteredConnection: false,
  isProviderReady: true,
  isAutoConnectPending: false,
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

  it('restores while a saved wallet is queued for auto-connect', () => {
    expect(
      getWalletRestorationState({
        ...restoredDisconnectedState,
        isAutoConnectPending: true,
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
        isAutoConnectPending: true,
        isConnecting: true,
        isConnected: true,
      }),
    ).toBe(false)
  })

  it('finishes restoring once the provider confirms it is disconnected', () => {
    expect(getWalletRestorationState(restoredDisconnectedState)).toBe(false)
  })
})

describe('getIsPrivyWalletProviderReady', () => {
  it('waits for Privy authentication to initialize', () => {
    expect(
      getIsPrivyWalletProviderReady({
        isAuthReady: false,
        isAuthenticated: false,
        areWalletsReady: false,
      }),
    ).toBe(false)
  })

  it('does not wait for wallets in a logged-out session', () => {
    expect(
      getIsPrivyWalletProviderReady({
        isAuthReady: true,
        isAuthenticated: false,
        areWalletsReady: false,
      }),
    ).toBe(true)
  })

  it('waits for wallets in an authenticated session', () => {
    expect(
      getIsPrivyWalletProviderReady({
        isAuthReady: true,
        isAuthenticated: true,
        areWalletsReady: false,
      }),
    ).toBe(false)

    expect(
      getIsPrivyWalletProviderReady({
        isAuthReady: true,
        isAuthenticated: true,
        areWalletsReady: true,
      }),
    ).toBe(true)
  })
})
