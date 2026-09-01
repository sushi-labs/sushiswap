import type { Wallet, WindowRegisterWalletEvent } from '@wallet-standard/base'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerPrivySvmWallet } from './register-privy-svm-wallet'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('registerPrivySvmWallet', () => {
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

    const cleanup = registerPrivySvmWallet({ name: 'Privy' } as Wallet)
    expect(register).toHaveBeenCalledOnce()

    cleanup()

    expect(unregister).toHaveBeenCalledOnce()
    expect(removeEventListener).toHaveBeenCalledWith(
      'wallet-standard:app-ready',
      expect.any(Function),
    )
  })
})
