'use client'

import { useIsWalletRestoring } from 'src/lib/wallet'
import type { ChainId } from 'sushi'
import { useChainId } from 'wagmi'

type ConnectedChainId = ReturnType<typeof useChainId>

export interface ResolvedChainId {
  chainId: ChainId
  connectedChainId: ConnectedChainId
  isLoading: boolean
}

export function useResolvedChainId(explicitChainId?: ChainId): ResolvedChainId {
  const connectedChainId = useChainId()
  const isConnectedChainRestoring = useIsWalletRestoring(connectedChainId)

  return {
    chainId: explicitChainId ?? connectedChainId,
    connectedChainId,
    isLoading: explicitChainId === undefined && isConnectedChainRestoring,
  }
}
