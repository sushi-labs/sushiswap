import { Token, tryParseAmount } from '@sushiswap/currency'
import { useMemo } from 'react'

import { Pair } from '../../.graphclient'

export const useTokensFromPair = (pair: Pair) => {
  return useMemo(() => {
    const [token0, token1, liquidityToken] = [
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
        address: pair.id.includes(':') ? pair.id.split(':')[1] : pair.id,
        name: 'SLP Token',
        decimals: 18,
        symbol: 'SLP',
        chainId: pair.chainId,
      }),
    ]

    return {
      token0,
      token1,
      liquidityToken,
      reserve0: tryParseAmount(pair.reserve0, token0),
      reserve1: tryParseAmount(pair.reserve1, token1),
      totalSupply: tryParseAmount(pair.liquidityUSD, liquidityToken),
    }
  }, [
    pair.chainId,
    pair.id,
    pair.liquidityUSD,
    pair.reserve0,
    pair.reserve1,
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
