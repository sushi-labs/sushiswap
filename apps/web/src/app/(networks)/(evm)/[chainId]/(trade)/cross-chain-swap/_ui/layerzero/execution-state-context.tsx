'use client'

import { createContext, useContext } from 'react'
import type { LayerZeroExecutionState } from './hooks/use-layerzero-executions'

export const LayerZeroExecutionContext = createContext<
  LayerZeroExecutionState | undefined
>(undefined)

export function useSharedLayerZeroExecutions():
  | LayerZeroExecutionState
  | undefined {
  return useContext(LayerZeroExecutionContext)
}
