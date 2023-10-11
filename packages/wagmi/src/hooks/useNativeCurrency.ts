'use client'

import { ChainId } from 'sushi/chain'
import { Native } from 'sushi/currency'
import { useMemo } from 'react'

export function useNativeCurrency({
  chainId = ChainId.ETHEREUM,
}: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
