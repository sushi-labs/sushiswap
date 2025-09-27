'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChainId, getChainById } from 'sushi'
import { useChainId } from 'wagmi'

export function useSushiChain() {
  const evmChainId = useChainId()

  const pathname = usePathname()

  const mvmChainId = pathname?.startsWith('/aptos/') ? ChainId.APTOS : undefined
  const tvmChainId = pathname?.startsWith('/tron/') ? ChainId.TRON : undefined

  const chainId = mvmChainId || tvmChainId || evmChainId

  return useMemo(() => getChainById(chainId), [chainId])
}
