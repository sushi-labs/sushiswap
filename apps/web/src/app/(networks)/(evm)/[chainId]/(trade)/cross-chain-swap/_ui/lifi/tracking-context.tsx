'use client'

import { createContext, useContext } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseLifiXSwapSelectedTradeRouteReturn } from './xswap-provider'

export interface LifiTrackingRecord {
  chainId0: LifiXSwapSupportedChainId
  chainId1: LifiXSwapSupportedChainId
  hash: TxHashFor<LifiXSwapSupportedChainId>
  route: UseLifiXSwapSelectedTradeRouteReturn<
    LifiXSwapSupportedChainId,
    LifiXSwapSupportedChainId
  >
  account: WalletAddressFor<LifiXSwapSupportedChainId> | undefined
  groupTimestamp: number
  sourceReceipt: Promise<unknown>
}

interface SharedLifiTracking {
  track(record: LifiTrackingRecord): void
  subscribeToCompletion(id: string, callback: () => void): () => void
}

export const LifiTrackingContext = createContext<
  SharedLifiTracking | undefined
>(undefined)

export function useSharedLifiTracking(): SharedLifiTracking | undefined {
  return useContext(LifiTrackingContext)
}

export function getLifiTrackingId(chainId: number, hash: string): string {
  return `${chainId}:${hash}`
}
