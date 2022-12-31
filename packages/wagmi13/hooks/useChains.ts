import { Chain, chains } from '@sushiswap/chain'
import { useMemo } from 'react'

export const useChains = (chainIds: number[]): Chain[] => {
  return useMemo(() => chainIds.map((chainId) => chains[chainId]), [chainIds])
}
