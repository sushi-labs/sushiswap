'use client'

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StepState } from './confirmation-dialog'
import {
  LifiTrackingContext,
  type LifiTrackingRecord,
  getLifiTrackingId,
} from './tracking-context'
import { useLifiTracking } from './trade-review-dialog/hooks/use-lifi-tracking'

export function LifiTrackingProvider({
  children,
}: { children: ReactNode }): ReactNode {
  const [records, setRecords] = useState<LifiTrackingRecord[]>([])
  const listeners = useRef(new Map<string, Set<() => void>>())
  const completed = useRef(new Set<string>())
  const track = useCallback((record: LifiTrackingRecord): void => {
    const id = getLifiTrackingId(record.chainId0, record.hash)
    setRecords((current) =>
      current.some((item) => getLifiTrackingId(item.chainId0, item.hash) === id)
        ? current
        : [...current, record],
    )
  }, [])
  const subscribeToCompletion = useCallback(
    (id: string, callback: () => void): (() => void) => {
      if (completed.current.has(id)) {
        callback()
        return () => {}
      }
      const callbacks = listeners.current.get(id) ?? new Set<() => void>()
      callbacks.add(callback)
      listeners.current.set(id, callbacks)
      return () => {
        callbacks.delete(callback)
        if (!callbacks.size) listeners.current.delete(id)
      }
    },
    [],
  )
  const onComplete = useCallback((id: string): void => {
    completed.current.add(id)
    for (const callback of listeners.current.get(id) ?? []) callback()
  }, [])
  const value = useMemo(
    () => ({ track, subscribeToCompletion }),
    [track, subscribeToCompletion],
  )

  return (
    <LifiTrackingContext.Provider value={value}>
      {children}
      {records.map((record) => (
        <TrackedSwap
          key={getLifiTrackingId(record.chainId0, record.hash)}
          record={record}
          onComplete={onComplete}
        />
      ))}
    </LifiTrackingContext.Provider>
  )
}

function TrackedSwap({
  record,
  onComplete,
}: {
  record: LifiTrackingRecord
  onComplete(id: string): void
}): null {
  const id = getLifiTrackingId(record.chainId0, record.hash)
  const [sourceState, setSourceState] = useState(StepState.Pending)
  const [complete, setComplete] = useState(false)
  useEffect(() => {
    let mounted = true
    void record.sourceReceipt.then(
      () => mounted && setSourceState(StepState.Success),
      () => mounted && setSourceState(StepState.Failed),
    )
    return () => {
      mounted = false
    }
  }, [record.sourceReceipt])
  const reset = useCallback(() => {
    setComplete(true)
    onComplete(id)
  }, [id, onComplete])

  useLifiTracking({
    ...record,
    tradeId: id,
    sourceState,
    reset,
    enabled: sourceState === StepState.Success && !complete,
  })
  return null
}
