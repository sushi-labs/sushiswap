'use client'

import { useCallback, useState } from 'react'
import type { NearIntentsDepositAddress } from 'src/lib/swap/near-intents'

interface NearIntentsActiveExecutionPayload {
  depositAddress: NearIntentsDepositAddress
  depositMemo?: string
  txHash: string
}

export function useNearIntentsActiveExecution() {
  const [sourceTxHash, setSourceTxHash] = useState<string | undefined>()
  const [depositAddress, setDepositAddress] = useState<
    NearIntentsDepositAddress | undefined
  >()
  const [depositMemo, setDepositMemo] = useState<string | undefined>()

  const clearActiveExecution = useCallback(() => {
    setSourceTxHash(undefined)
    setDepositAddress(undefined)
    setDepositMemo(undefined)
  }, [])

  const setActiveExecution = useCallback(
    (payload: NearIntentsActiveExecutionPayload) => {
      setDepositAddress(payload.depositAddress)
      setDepositMemo(payload.depositMemo)
      setSourceTxHash(payload.txHash)
    },
    [],
  )

  return {
    clearActiveExecution,
    depositAddress,
    depositMemo,
    setActiveExecution,
    sourceTxHash,
  }
}
