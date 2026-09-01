'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { hasPersistedConnectorMatching } from 'src/lib/wagmi/config/persisted-connectors'
import {
  hasStoredPrivySession,
  isPrivySessionStorageKey,
} from 'src/lib/wallet/privy-storage'
import { isPrivyTestRuntimeEnabled } from 'src/lib/wallet/privy/privy-e2e-mode'
import { isPrivyEvmConnectorId } from 'src/lib/wallet/privy/privy-evm-connector'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'

type PrivyRuntimeComponent = React.ComponentType

function loadPrivyRuntime(): Promise<{ PrivyRuntime: PrivyRuntimeComponent }> {
  if (isPrivyTestRuntimeEnabled()) {
    return import('./privy-test-runtime')
  }
  return import('./privy-runtime')
}

function requestSessionRuntime(): void {
  privyRuntimeStore.requestRuntime({
    evmReconnect: hasPersistedConnectorMatching(isPrivyEvmConnectorId),
  })
}

export function PrivyRuntimeGate() {
  const { requested, status } = useSyncExternalStore(
    privyRuntimeStore.subscribe,
    privyRuntimeStore.getSnapshot,
    privyRuntimeStore.getSnapshot,
  )
  const [Runtime, setRuntime] = useState<PrivyRuntimeComponent>()

  useEffect(() => {
    if (hasStoredPrivySession()) {
      requestSessionRuntime()
    }
  }, [])

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (!isPrivySessionStorageKey(event.key)) return
      if (hasStoredPrivySession()) {
        requestSessionRuntime()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    let cancelled = false
    // `status === 'error'` means the previous import failed; wait for a fresh
    // `requestRuntime()` to reset the store to `loading` before retrying.
    if (!requested || Runtime || status === 'error') return

    privyRuntimeStore.setLoading()
    loadPrivyRuntime()
      .then(({ PrivyRuntime }) => {
        if (!cancelled) setRuntime(() => PrivyRuntime)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        privyRuntimeStore.setError(error)
      })

    return () => {
      cancelled = true
    }
  }, [requested, status, Runtime])

  if (!requested || !Runtime) return null
  return <Runtime />
}
