'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { hasPersistedConnector } from 'src/lib/wagmi/config/persisted-connectors'
import {
  PRIVY_SESSION_MARKER_KEY,
  hasPrivySessionMarker,
} from 'src/lib/wallet/privy-session-marker'
import { PRIVY_EVM_CONNECTOR_ID } from 'src/lib/wallet/privy/privy-evm-connector'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'

type PrivyRuntimeComponent = React.ComponentType

function requestSessionRuntime(): void {
  privyRuntimeStore.requestRuntime({
    evmReconnect: hasPersistedConnector(PRIVY_EVM_CONNECTOR_ID),
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
    if (hasPrivySessionMarker()) {
      requestSessionRuntime()
    }
  }, [])

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== PRIVY_SESSION_MARKER_KEY) return
      if (event.newValue) {
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
    import('./privy-runtime')
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
