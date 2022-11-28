import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { useMemo } from 'react'

export function useNativeCurrency({ chainId = ChainId.ETHEREUM }: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
