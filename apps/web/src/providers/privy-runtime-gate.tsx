'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  hasStoredPrivySession,
  isPrivySessionStorageKey,
} from '../lib/wallet/privy-storage'
import { isPrivyTestRuntimeEnabled } from '../lib/wallet/privy/privy-e2e-mode'
import { privyRuntimeStore } from '../lib/wallet/privy/privy-runtime-store'

type PrivyRuntimeComponent = React.ComponentType

function loadPrivyRuntime(): Promise<{ PrivyRuntime: PrivyRuntimeComponent }> {
  if (isPrivyTestRuntimeEnabled()) {
    return import('./privy-test-runtime')
  }
  return import('./privy-runtime')
}

function requestSessionRuntime(): void {
  privyRuntimeStore.requestRuntime()
}

export function PrivyRuntimeGate() {
  const { hostMounted, requested, revision, status } = useSyncExternalStore(
    privyRuntimeStore.subscribe,
    privyRuntimeStore.getSnapshot,
    privyRuntimeStore.getSnapshot,
  )
  const [Runtime, setRuntime] = useState<PrivyRuntimeComponent>()

  useEffect(() => privyRuntimeStore.mountRuntimeHost(), [])

  useEffect(() => {
    if (hasStoredPrivySession()) requestSessionRuntime()
  }, [])

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (!isPrivySessionStorageKey(event.key)) return
      if (hasStoredPrivySession()) requestSessionRuntime()
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!hostMounted || !requested || Runtime || status === 'error') return

    privyRuntimeStore.setLoading()
    loadPrivyRuntime()
      .then(({ PrivyRuntime }) => {
        if (
          !cancelled &&
          privyRuntimeStore.getSnapshot().revision === revision
        ) {
          setRuntime(() => PrivyRuntime)
        }
      })
      .catch((error: unknown) => {
        if (
          !cancelled &&
          privyRuntimeStore.getSnapshot().revision === revision
        ) {
          privyRuntimeStore.setError(error)
        }
      })

    return () => {
      cancelled = true
    }
  }, [hostMounted, requested, revision, status, Runtime])

  if (!requested || !Runtime) return null
  return <Runtime key={revision} />
}
