import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useMemo } from 'react'

import { ChainTokenMap } from '../types'

export function useTokensFromMap(chainId: ChainId | undefined, tokenMap: ChainTokenMap): Record<string, Token> {
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{
      [address: string]: Token
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})

    return mapWithoutUrls
  }, [chainId, tokenMap])
}
