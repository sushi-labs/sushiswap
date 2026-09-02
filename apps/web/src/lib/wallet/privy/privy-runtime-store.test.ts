import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createPrivyRuntimeStore } from './privy-runtime-store'
import type { PrivyEvmWallet, PrivyRuntimeOperationHandlers } from './types'

const address = '0x0000000000000000000000000000000000000001' as EvmAddress

function createOperations(): PrivyRuntimeOperationHandlers {
  return {
    connectOrCreateEvmWallet: vi.fn(async () => undefined),
    exportEvmWallet: vi.fn(async () => undefined),
    exportSvmWallet: vi.fn(async () => undefined),
    loginSvm: vi.fn(async () => undefined),
    logout: vi.fn(async () => undefined),
    sendEvmTransaction: vi.fn(async () => ({
      hash: '0x01' as EvmTxHash,
    })),
    signAndSendSvmTransaction: vi.fn(async () => ({
      signature: 'signature' as SvmTxHash,
    })),
  }
}

function createWallet(): PrivyEvmWallet {
  return {
    address,
    getEthereumProvider: vi.fn(
      async () =>
        ({
          on() {},
          removeListener() {},
          request: vi.fn(),
        }) as unknown as EIP1193Provider,
    ),
    switchChain: vi.fn(async () => undefined),
  }
}

describe('Privy runtime store', () => {
  it('latches runtime requests without changing revisions', () => {
    const store = createPrivyRuntimeStore()
    const listener = vi.fn()
    store.subscribe(listener)

    store.requestRuntime()
    store.requestRuntime()

    expect(store.getSnapshot()).toEqual({
      hostMounted: false,
      requested: true,
      revision: 0,
      status: 'loading',
    })
    expect(listener).toHaveBeenCalledOnce()
  })

  it('reference-counts runtime hosts across Strict Mode effect replay', () => {
    const store = createPrivyRuntimeStore()
    const unmountFirst = store.mountRuntimeHost()
    const unmountSecond = store.mountRuntimeHost()

    expect(store.getSnapshot().hostMounted).toBe(true)
    unmountFirst()
    unmountFirst()
    expect(store.getSnapshot().hostMounted).toBe(true)

    unmountSecond()
    expect(store.getSnapshot().hostMounted).toBe(false)

    const replayCleanup = store.mountRuntimeHost()
    expect(store.getSnapshot().hostMounted).toBe(true)
    replayCleanup()
    expect(store.getSnapshot().hostMounted).toBe(false)
  })

  it('publishes settled wallets and provider-capable handles synchronously', async () => {
    const store = createPrivyRuntimeStore()
    const wallet = createWallet()
    store.requestRuntime()

    store.publishRuntime({
      authenticated: true,
      evmWallet: wallet,
      hasEvmAccount: true,
      hasSvmAccount: false,
      operations: createOperations(),
      svmWallet: null,
      walletsReady: true,
    })

    const snapshot = store.getSnapshot()
    expect(snapshot).toMatchObject({
      authenticated: true,
      evmWallet: wallet,
      revision: 0,
      status: 'ready',
      walletsReady: true,
    })
    if (snapshot.status !== 'ready' || !snapshot.evmWallet) {
      throw new Error('Runtime wallet was not published')
    }
    await snapshot.evmWallet.getEthereumProvider()
    expect(wallet.getEthereumProvider).toHaveBeenCalledOnce()
  })

  it('clears wallet capabilities when the runtime logs out', () => {
    const store = createPrivyRuntimeStore()
    store.publishRuntime({
      authenticated: true,
      evmWallet: createWallet(),
      hasEvmAccount: true,
      hasSvmAccount: false,
      operations: createOperations(),
      walletsReady: true,
    })

    store.publishRuntime({
      authenticated: false,
      operations: createOperations(),
      walletsReady: true,
    })

    expect(store.getSnapshot()).toMatchObject({
      authenticated: false,
      evmWallet: null,
      status: 'ready',
      svmWallet: null,
      walletsReady: true,
    })
  })

  it('increments revisions when retrying errors or forcing a remount', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime()
    store.setError(new Error('chunk failed'))

    store.requestRuntime()
    expect(store.getSnapshot()).toMatchObject({
      revision: 1,
      status: 'loading',
    })

    store.restartRuntime()
    expect(store.getSnapshot()).toMatchObject({
      revision: 2,
      status: 'loading',
    })
  })

  it('keeps the request and revision latched across runtime unmounts', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime()
    store.restartRuntime()
    store.setUnavailable()

    expect(store.getSnapshot()).toEqual({
      hostMounted: false,
      requested: true,
      revision: 1,
      status: 'unavailable',
    })
  })
})
