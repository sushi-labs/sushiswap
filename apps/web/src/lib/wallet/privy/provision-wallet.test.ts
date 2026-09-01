import { describe, expect, it, vi } from 'vitest'
import { provisionPrivyWallet } from './provision-wallet'

describe('provisionPrivyWallet', () => {
  it('creates the missing wallet for an authenticated user', async () => {
    const createWallet = vi.fn(async () => ({ address: 'wallet' }))
    const login = vi.fn(async () => undefined)

    await provisionPrivyWallet({
      authenticated: true,
      createWallet,
      login,
    })

    expect(createWallet).toHaveBeenCalledOnce()
    expect(login).not.toHaveBeenCalled()
  })

  it('logs in an unauthenticated user', async () => {
    const createWallet = vi.fn(async () => ({ address: 'wallet' }))
    const login = vi.fn(async () => undefined)

    await provisionPrivyWallet({
      authenticated: false,
      createWallet,
      login,
    })

    expect(login).toHaveBeenCalledOnce()
    expect(createWallet).not.toHaveBeenCalled()
  })

  it('propagates provisioning failures', async () => {
    const error = new Error('wallet creation failed')

    await expect(
      provisionPrivyWallet({
        authenticated: true,
        createWallet: vi.fn(async () => {
          throw error
        }),
        login: vi.fn(async () => undefined),
      }),
    ).rejects.toBe(error)
  })
})
