import type { EvmTxHash } from 'sushi/evm'
import type { SvmTxHash } from 'sushi/svm'
import { describe, expect, it, vi } from 'vitest'
import { privyRuntimeStore } from './privy-runtime-store'
import type { PrivyRuntimeOperationHandlers } from './types'
import { authenticatePrivyRuntime } from './use-privy-runtime'

function createOperations(): PrivyRuntimeOperationHandlers {
  const operations: PrivyRuntimeOperationHandlers = {
    authenticate: vi.fn(async (loginMethod) => {
      privyRuntimeStore.publishRuntime({
        authenticated: true,
        hasEvmAccount: true,
        hasSvmAccount: false,
        loginMethod,
        operations,
        walletsReady: true,
      })
    }),
    connectOrCreateEvmWallet: vi.fn(async () => undefined),
    exportEvmWallet: vi.fn(async () => undefined),
    exportSvmWallet: vi.fn(async () => undefined),
    loginSvm: vi.fn(async () => undefined),
    logout: vi.fn(async () => {
      privyRuntimeStore.publishRuntime({
        authenticated: false,
        operations,
        walletsReady: true,
      })
    }),
    sendEvmTransaction: vi.fn(async () => ({ hash: '0x01' as EvmTxHash })),
    signSvmTransaction: vi.fn(async () => ({
      signedTransaction: new Uint8Array(),
    })),
    signAndSendSvmTransaction: vi.fn(async () => ({
      signature: 'signature' as SvmTxHash,
    })),
  }
  return operations
}

function publishAuthenticatedRuntime(
  operations: PrivyRuntimeOperationHandlers,
  loginMethod: 'email' | 'twitter',
): void {
  privyRuntimeStore.publishRuntime({
    authenticated: true,
    hasEvmAccount: true,
    hasSvmAccount: false,
    loginMethod,
    operations,
    walletsReady: true,
  })
}

describe('authenticatePrivyRuntime', () => {
  it('reuses a session authenticated with the requested method', async () => {
    const operations = createOperations()
    publishAuthenticatedRuntime(operations, 'twitter')

    await authenticatePrivyRuntime('twitter', 'solana-only')

    expect(operations.logout).not.toHaveBeenCalled()
    expect(operations.authenticate).not.toHaveBeenCalled()
  })

  it('logs out before authenticating with a different method', async () => {
    const operations = createOperations()
    publishAuthenticatedRuntime(operations, 'twitter')

    await authenticatePrivyRuntime('email', 'solana-only')

    expect(operations.logout).toHaveBeenCalledOnce()
    expect(operations.authenticate).toHaveBeenCalledWith('email', 'solana-only')
    expect(privyRuntimeStore.getSnapshot()).toMatchObject({
      authenticated: true,
      loginMethod: 'email',
    })
  })
})
