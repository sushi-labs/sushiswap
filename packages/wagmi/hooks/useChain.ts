import { Chain, chains } from '@sushiswap/chain'
import { useMemo } from 'react'

export const useChain = (chainId: number): Chain => {
  return useMemo(() => chains[chainId], [chainId])
}
