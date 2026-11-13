'use client'

import { usePathname } from 'next/navigation'
import {
  type UnifiedSwapChainId,
  isUnifiedSwapChainId,
} from 'src/lib/swap/unified-swap'
import { getChainByKey, isChainKey } from 'sushi'

export function useSwapPageChainId(): UnifiedSwapChainId | undefined {
  const pathname = usePathname()
  const network = pathname.match(/^\/([^/]+)\/swap\/?$/)?.[1]
  if (!network) return undefined

  const chainId = isChainKey(network)
    ? getChainByKey(network).chainId
    : Number(network)
  return isUnifiedSwapChainId(chainId) ? chainId : undefined
}
