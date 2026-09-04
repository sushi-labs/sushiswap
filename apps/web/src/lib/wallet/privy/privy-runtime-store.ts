import type {
  PrivyRuntimeListener,
  PrivyRuntimePublication,
  PrivyRuntimeSnapshot,
} from './types'

export interface PrivyRuntimeStore {
  getSnapshot(): PrivyRuntimeSnapshot
  mountRuntimeHost(): () => void
  publishRuntime(publication: PrivyRuntimePublication): void
  requestRuntime(): void
  restartRuntime(): void
  setError(error: unknown): void
  setLoading(): void
  setUnavailable(): void
  subscribe(listener: PrivyRuntimeListener): () => void
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Privy runtime failed')
}

export function createPrivyRuntimeStore(): PrivyRuntimeStore {
  let snapshot: PrivyRuntimeSnapshot = {
    hostMounted: false,
    requested: false,
    revision: 0,
    status: 'unavailable',
  }
  let hostCount = 0
  const listeners = new Set<PrivyRuntimeListener>()

  function publish(nextSnapshot: PrivyRuntimeSnapshot): void {
    const previousSnapshot = snapshot
    snapshot = nextSnapshot
    for (const listener of listeners) listener(snapshot, previousSnapshot)
  }

  return {
    getSnapshot() {
      return snapshot
    },
    mountRuntimeHost() {
      hostCount += 1
      if (hostCount === 1) publish({ ...snapshot, hostMounted: true })

      let mounted = true
      return () => {
        if (!mounted) return
        mounted = false
        hostCount = Math.max(0, hostCount - 1)
        if (hostCount === 0) publish({ ...snapshot, hostMounted: false })
      }
    },
    publishRuntime(publication) {
      if (publication.authenticated) {
        publish({
          authenticated: true,
          evmWallet: publication.evmWallet ?? null,
          hasEvmAccount: publication.hasEvmAccount,
          hasSvmAccount: publication.hasSvmAccount,
          hostMounted: snapshot.hostMounted,
          operations: publication.operations,
          requested: true,
          revision: snapshot.revision,
          status: 'ready',
          svmWallet: publication.svmWallet ?? null,
          walletsReady: publication.walletsReady,
        })
      } else {
        publish({
          authenticated: false,
          evmWallet: null,
          hostMounted: snapshot.hostMounted,
          operations: publication.operations,
          requested: true,
          revision: snapshot.revision,
          status: 'ready',
          svmWallet: null,
          walletsReady: publication.walletsReady,
        })
      }
    },
    requestRuntime() {
      if (snapshot.requested && snapshot.status !== 'error') return

      // Re-requesting after an import or authentication failure allows the
      // gate to retry and remount the runtime.
      publish({
        hostMounted: snapshot.hostMounted,
        requested: true,
        revision:
          snapshot.status === 'error'
            ? snapshot.revision + 1
            : snapshot.revision,
        status: 'loading',
      })
    },
    restartRuntime() {
      publish({
        hostMounted: snapshot.hostMounted,
        requested: true,
        revision: snapshot.revision + 1,
        status: 'loading',
      })
    },
    setError(error) {
      publish({
        error: normalizeError(error),
        hostMounted: snapshot.hostMounted,
        requested: true,
        revision: snapshot.revision,
        status: 'error',
      })
    },
    setLoading() {
      if (snapshot.status === 'loading') return
      publish({
        hostMounted: snapshot.hostMounted,
        requested: true,
        revision: snapshot.revision,
        status: 'loading',
      })
    },
    setUnavailable() {
      if (snapshot.status === 'unavailable' && snapshot.requested) return
      publish({
        hostMounted: snapshot.hostMounted,
        requested: true,
        revision: snapshot.revision,
        status: 'unavailable',
      })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const privyRuntimeStore = createPrivyRuntimeStore()
