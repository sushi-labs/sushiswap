import { describe, expect, it } from 'vitest'
import type { WalletWithState } from '../../types'
import { getWalletStatusLabel } from './wallet-connectors-list-button'

function createWallet(
  overrides: Partial<WalletWithState> = {},
): WalletWithState {
  return {
    adapterId: 'test',
    icon: '',
    id: 'svm:test',
    isAvailable: true,
    isInstalled: false,
    isRecent: false,
    name: 'Test',
    namespace: 'svm',
    ...overrides,
  }
}

describe('getWalletStatusLabel', () => {
  it('marks only the active Privy login method as logged in', () => {
    const email = createWallet({
      isInstalled: true,
      isRecent: true,
      loginMethod: 'email',
      name: 'Email',
    })
    const twitter = createWallet({
      id: 'svm:twitter',
      isInstalled: true,
      isRecent: true,
      loginMethod: 'twitter',
      name: 'X',
    })

    expect(
      getWalletStatusLabel({
        activePrivyLoginMethod: 'twitter',
        hasPrivySession: true,
        wallet: twitter,
      }),
    ).toBe('Logged in')
    expect(
      getWalletStatusLabel({
        activePrivyLoginMethod: 'twitter',
        hasPrivySession: true,
        wallet: email,
      }),
    ).toBeUndefined()
  })

  it('keeps the existing recent and installed labels without a session', () => {
    expect(
      getWalletStatusLabel({
        activePrivyLoginMethod: undefined,
        hasPrivySession: false,
        wallet: createWallet({ isInstalled: true }),
      }),
    ).toBe('Installed')
    expect(
      getWalletStatusLabel({
        activePrivyLoginMethod: undefined,
        hasPrivySession: false,
        wallet: createWallet({ isInstalled: true, isRecent: true }),
      }),
    ).toBe('Recent')
  })
})
