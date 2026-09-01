import type {
  PrivyRuntimeListener,
  PrivyRuntimePublication,
  PrivyRuntimeSnapshot,
} from './types'

export interface PrivyRuntimeStore {
  clearEvmReconnect(): void
  getSnapshot(): PrivyRuntimeSnapshot
  publishRuntime(publication: PrivyRuntimePublication): void
  requestRuntime(options?: { evmReconnect?: boolean }): void
  setError(error: unknown): void
  setLoading(): void
  setUnavailable(): void
  subscribe(listener: PrivyRuntimeListener): () => void
}

const initialSnapshot: PrivyRuntimeSnapshot = {
  evmReconnect: false,
  requested: false,
  status: 'unavailable',
}

interface CreatePrivyRuntimeStoreOptions {
  evmReconnectTimeoutMs?: number
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Privy runtime failed')
}

export function createPrivyRuntimeStore({
  evmReconnectTimeoutMs,
}: CreatePrivyRuntimeStoreOptions = {}): PrivyRuntimeStore {
  let snapshot = initialSnapshot
  let evmReconnectTimeout: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<PrivyRuntimeListener>()

  function publish(nextSnapshot: PrivyRuntimeSnapshot): void {
    const previousSnapshot = snapshot
    snapshot = nextSnapshot
    for (const listener of listeners) listener(snapshot, previousSnapshot)
  }

  function cancelEvmReconnectTimeout(): void {
    if (!evmReconnectTimeout) return
    clearTimeout(evmReconnectTimeout)
    evmReconnectTimeout = undefined
  }

  function clearEvmReconnect(): void {
    cancelEvmReconnectTimeout()
    if (!snapshot.evmReconnect) return
    publish({ ...snapshot, evmReconnect: false })
  }

  function scheduleEvmReconnectTimeout(): void {
    if (!evmReconnectTimeoutMs || evmReconnectTimeout) return
    evmReconnectTimeout = setTimeout(() => {
      evmReconnectTimeout = undefined
      if (!snapshot.evmReconnect) return
      publish({ ...snapshot, evmReconnect: false })
    }, evmReconnectTimeoutMs)
  }

  return {
    clearEvmReconnect,
    getSnapshot() {
      return snapshot
    },
    publishRuntime(publication) {
      if (publication.authenticated) {
        const evmReconnect = publication.hasEvmAccount
          ? snapshot.evmReconnect
          : false
        if (!evmReconnect) cancelEvmReconnectTimeout()
        publish({
          authenticated: true,
          evmReconnect,
          evmWallet: publication.evmWallet ?? null,
          hasEvmAccount: publication.hasEvmAccount,
          hasSvmAccount: publication.hasSvmAccount,
          operations: publication.operations,
          requested: true,
          status: 'ready',
          svmWallet: publication.svmWallet ?? null,
        })
      } else {
        cancelEvmReconnectTimeout()
        publish({
          authenticated: false,
          evmReconnect: false,
          evmWallet: null,
          operations: publication.operations,
          requested: true,
          status: 'ready',
          svmWallet: null,
        })
      }
    },
    requestRuntime(options = {}) {
      const evmReconnect =
        snapshot.evmReconnect || Boolean(options.evmReconnect)

      // A previous load failure must not be permanent: re-requesting the
      // runtime drops back to `loading` so the gate can retry the import.
      if (!snapshot.requested || snapshot.status === 'error') {
        publish({
          evmReconnect,
          requested: true,
          status: 'loading',
        })
        if (evmReconnect) scheduleEvmReconnectTimeout()
        return
      }

      if (evmReconnect === snapshot.evmReconnect) return
      publish({ ...snapshot, evmReconnect, requested: true })
      if (evmReconnect) scheduleEvmReconnectTimeout()
    },
    setError(error) {
      publish({
        error: normalizeError(error),
        evmReconnect: snapshot.evmReconnect,
        requested: true,
        status: 'error',
      })
    },
    setLoading() {
      if (snapshot.status === 'loading') return
      publish({
        evmReconnect: snapshot.evmReconnect,
        requested: true,
        status: 'loading',
      })
    },
    setUnavailable() {
      if (snapshot.status === 'unavailable') return
      publish({
        evmReconnect: snapshot.evmReconnect,
        requested: true,
        status: 'unavailable',
      })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const privyRuntimeStore = createPrivyRuntimeStore({
  evmReconnectTimeoutMs: 5_000,
})
