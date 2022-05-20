import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ChainTokenMap } from '@sushiswap/redux-token-lists'
import { useMemo } from 'react'

// reduce token map into standard address <-> Token mapping
export function useTokensFromMap(chainId: ChainId, tokenMap: ChainTokenMap): { [address: string]: Token } {
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token
        return newMap
      },
      {}
    )

    return mapWithoutUrls
  }, [chainId, tokenMap])
}
