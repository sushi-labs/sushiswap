import type { EvmAddress } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import type { Hex } from 'viem'
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
    sendEvmTransaction: vi.fn(async () => ({ hash: '0x01' as Hex })),
    signAndSendSvmTransaction: vi.fn(async () => ({
      signature: 'signature',
    })),
  }
}

function createWallet(): PrivyEvmWallet {
  return { address }
}

describe('Privy runtime store', () => {
  it('latches runtime requests', () => {
    const store = createPrivyRuntimeStore()
    const listener = vi.fn()
    store.subscribe(listener)

    store.requestRuntime()
    store.requestRuntime()

    expect(store.getSnapshot()).toEqual({
      evmReconnect: false,
      requested: true,
      status: 'loading',
    })
    expect(listener).toHaveBeenCalledTimes(1)

    store.requestRuntime({ evmReconnect: true })
    store.requestRuntime()

    expect(store.getSnapshot()).toEqual({
      evmReconnect: true,
      requested: true,
      status: 'loading',
    })
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('publishes a framework-independent snapshot without provider I/O', () => {
    const store = createPrivyRuntimeStore()
    const listener = vi.fn()
    store.subscribe(listener)
    const evmWallet = createWallet()
    store.requestRuntime()

    store.publishRuntime({
      authenticated: true,
      hasEvmAccount: true,
      evmWallet,
      operations: createOperations(),
      hasSvmAccount: true,
      svmWallet: {
        address: '11111111111111111111111111111111' as SvmAddress,
      },
    })

    expect(store.getSnapshot()).toMatchObject({
      authenticated: true,
      evmWallet: { address },
      status: 'ready',
      svmWallet: { address: '11111111111111111111111111111111' },
    })
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('publishes an unauthenticated runtime without wallet capabilities', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime()
    store.publishRuntime({
      authenticated: false,
      operations: createOperations(),
    })

    expect(store.getSnapshot()).toMatchObject({
      authenticated: false,
      evmWallet: null,
      status: 'ready',
      svmWallet: null,
    })
  })

  it('publishes the latest wallet synchronously', () => {
    const store = createPrivyRuntimeStore()
    const firstWallet = createWallet()
    const secondWallet = {
      ...createWallet(),
      address: '0x0000000000000000000000000000000000000002' as EvmAddress,
    }

    store.requestRuntime()
    store.publishRuntime({
      authenticated: true,
      hasEvmAccount: true,
      evmWallet: firstWallet,
      operations: createOperations(),
      hasSvmAccount: true,
    })
    store.publishRuntime({
      authenticated: true,
      hasEvmAccount: true,
      evmWallet: secondWallet,
      operations: createOperations(),
      hasSvmAccount: true,
    })

    const snapshot = store.getSnapshot()
    expect(snapshot.status).toBe('ready')
    if (snapshot.status !== 'ready') throw new Error('Runtime is not ready')
    expect(snapshot.evmWallet).toBe(secondWallet)
  })

  it('clears ready-only capabilities on errors', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime()
    store.publishRuntime({
      authenticated: true,
      hasEvmAccount: true,
      evmWallet: createWallet(),
      operations: createOperations(),
      hasSvmAccount: true,
    })

    store.setError(new Error('runtime failed'))

    const snapshot = store.getSnapshot()
    expect(snapshot).toMatchObject({
      error: new Error('runtime failed'),
      requested: true,
      status: 'error',
    })
    expect('authenticated' in snapshot).toBe(false)
    expect('evmWallet' in snapshot).toBe(false)
    expect('operations' in snapshot).toBe(false)
  })

  it('publishes linked-account presence so consumers can tell "no wallet" from "not surfaced yet"', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime()

    store.publishRuntime({
      authenticated: true,
      evmWallet: null,
      hasEvmAccount: true,
      hasSvmAccount: true,
      operations: createOperations(),
      svmWallet: null,
    })

    expect(store.getSnapshot()).toMatchObject({
      authenticated: true,
      evmWallet: null,
      hasEvmAccount: true,
      hasSvmAccount: true,
      svmWallet: null,
    })
  })

  it('retries after a load error when the runtime is requested again', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime({ evmReconnect: true })
    store.setError(new Error('chunk load failed'))

    store.requestRuntime()

    expect(store.getSnapshot()).toEqual({
      evmReconnect: true,
      requested: true,
      status: 'loading',
    })
  })

  it('clears a consumed reconnect request', () => {
    const store = createPrivyRuntimeStore()
    const listener = vi.fn()
    store.requestRuntime({ evmReconnect: true })
    store.subscribe(listener)

    store.clearEvmReconnect()
    store.clearEvmReconnect()

    expect(store.getSnapshot().evmReconnect).toBe(false)
    expect(listener).toHaveBeenCalledTimes(1)

    store.publishRuntime({
      authenticated: true,
      hasEvmAccount: true,
      evmWallet: createWallet(),
      operations: createOperations(),
      hasSvmAccount: true,
    })

    expect(store.getSnapshot().evmReconnect).toBe(false)
  })

  it('keeps a runtime request latched when the provider unmounts', () => {
    const store = createPrivyRuntimeStore()
    store.requestRuntime({ evmReconnect: true })
    store.publishRuntime({
      authenticated: false,
      operations: createOperations(),
    })

    store.setUnavailable()

    expect(store.getSnapshot()).toEqual({
      evmReconnect: true,
      requested: true,
      status: 'unavailable',
    })
  })
})
