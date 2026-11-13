'use client'

import { type ReactNode, useState } from 'react'
import {
  DialogProvider,
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog'
import { LayerZeroExecutionConfirmation } from './layerzero/execution-confirmation'
import { LayerZeroExecutionContext } from './layerzero/execution-state-context'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './layerzero/hooks/use-layerzero-executions'
import { LayerZeroPendingExecutions } from './layerzero/pending-executions'
import { LifiTrackingProvider } from './lifi/tracking-provider'

// Keep submitted transfers and their status polling alive as the swap page
// switches between its same-chain and cross-chain runtimes.
export function UnifiedSwapExecutionProvider({
  children,
}: { children: ReactNode }): ReactNode {
  const executionState = useLayerZeroExecutions()

  return (
    <LayerZeroExecutionContext.Provider value={executionState}>
      <LifiTrackingProvider>
        {children}
        <DialogProvider>
          <ExecutionTracker executionState={executionState} />
        </DialogProvider>
      </LifiTrackingProvider>
    </LayerZeroExecutionContext.Provider>
  )
}

function ExecutionTracker({
  executionState,
}: { executionState: LayerZeroExecutionState }): ReactNode {
  const [executionId, setExecutionId] = useState<string>()
  const { setOpen } = useDialog(DialogType.Confirm)
  const execution = executionState.executions.find(
    (item) => item.id === executionId,
  )

  return (
    <>
      <LayerZeroPendingExecutions
        executions={executionState.executions}
        onSelect={(id) => {
          setExecutionId(id)
          setOpen(true)
        }}
      />
      <LayerZeroExecutionConfirmation
        execution={execution}
        isSubmitting={executionState.isSubmitting}
      />
    </>
  )
}
