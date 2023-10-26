'use client'

import { useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'

export function useNativeCurrency({
  chainId = ChainId.ETHEREUM,
}: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
