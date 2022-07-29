import { Token } from '@sushiswap/currency'
import { useMemo } from 'react'

import { Pair } from '../../.graphclient'

export const useTokensFromPair = (pair: Pair) => {
  return useMemo(() => {
    return [
      new Token({
        address: pair.token0.id,
        name: pair.token0.name,
        decimals: Number(pair.token0.decimals),
        symbol: pair.token0.symbol,
        chainId: pair.chainId,
      }),
      new Token({
        address: pair.token1.id,
        name: pair.token1.name,
        decimals: Number(pair.token1.decimals),
        symbol: pair.token1.symbol,
        chainId: pair.chainId,
      }),
      new Token({
        address: pair.id,
        name: 'SLP Token',
        decimals: 18,
        symbol: 'SLP',
        chainId: pair.chainId,
      }),
    ]
  }, [
    pair.chainId,
    pair.id,
    pair.token0.decimals,
    pair.token0.id,
    pair.token0.name,
    pair.token0.symbol,
    pair.token1.decimals,
    pair.token1.id,
    pair.token1.name,
    pair.token1.symbol,
  ])
}
