import { ChainId } from '@sushiswap/chain'
import { useMemo } from 'react'

import { Native } from './Native'

export function useNativeCurrency({ chainId = ChainId.ETHEREUM }: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
