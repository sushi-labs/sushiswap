import type { Wallet, WindowRegisterWalletEvent } from '@wallet-standard/base'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerWallet } from './use-register-privy-svm-wallet'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('registerWallet', () => {
  it('unregisters the wallet when the lazy runtime is released', () => {
    const unregister = vi.fn()
    const register = vi.fn(() => unregister)
    const removeEventListener = vi.fn()

    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn((event: WindowRegisterWalletEvent) => {
        event.detail({ register })
        return true
      }),
      removeEventListener,
    })

    const cleanup = registerWallet({ name: 'Privy' } as Wallet)
    expect(register).toHaveBeenCalledOnce()

    cleanup()

    expect(unregister).toHaveBeenCalledOnce()
    expect(removeEventListener).toHaveBeenCalledWith(
      'wallet-standard:app-ready',
      expect.any(Function),
    )
  })
})
