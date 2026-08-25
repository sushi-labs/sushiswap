'use client'

import { useEffect, useState } from 'react'

const DEFAULT_AUTO_CONNECT_TIMEOUT_MS = 5_000

interface UseInitialWalletAutoConnectPendingOptions {
  getHasReconnectCandidate: () => boolean | Promise<boolean>
  isConnectionAttemptActive: boolean
  timeoutMs?: number
}

export function useInitialWalletAutoConnectPending({
  getHasReconnectCandidate,
  isConnectionAttemptActive,
  timeoutMs = DEFAULT_AUTO_CONNECT_TIMEOUT_MS,
}: UseInitialWalletAutoConnectPendingOptions): boolean {
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    if (!isPending) return

    if (isConnectionAttemptActive) {
      setIsPending(false)
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined

    async function checkReconnectCandidate(): Promise<void> {
      let hasReconnectCandidate = false

      try {
        hasReconnectCandidate = await getHasReconnectCandidate()
      } catch {}

      if (cancelled) return

      if (!hasReconnectCandidate) {
        setIsPending(false)
        return
      }

      timeout = setTimeout(() => {
        setIsPending(false)
      }, timeoutMs)
    }

    void checkReconnectCandidate()

    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [
    getHasReconnectCandidate,
    isConnectionAttemptActive,
    isPending,
    timeoutMs,
  ])

  return isPending
}
