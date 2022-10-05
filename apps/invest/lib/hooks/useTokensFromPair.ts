import { Amount, Native, Token } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { useMemo } from 'react'

export const useTokensFromPair = (pair: Pair) => {
  return useMemo(() => {
    const _token0 = new Token({
      address: pair.token0.id,
      name: pair.token0.name,
      decimals: Number(pair.token0.decimals),
      symbol: pair.token0.symbol,
      chainId: pair.chainId,
    })

    const _token1 = new Token({
      address: pair.token1.id,
      name: pair.token1.name,
      decimals: Number(pair.token1.decimals),
      symbol: pair.token1.symbol,
      chainId: pair.chainId,
    })

    const [token0, token1, liquidityToken] = [
      _token0.wrapped.address == Native.onChain(_token0.chainId).wrapped.address
        ? Native.onChain(_token0.chainId)
        : _token0,
      _token1.wrapped.address == Native.onChain(_token1.chainId).wrapped.address
        ? Native.onChain(_token1.chainId)
        : _token1,
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
      reserve0: Amount.fromRawAmount(token0, pair.reserve0 || 0),
      reserve1: Amount.fromRawAmount(token1, pair.reserve1 || 0),
      totalSupply: Amount.fromRawAmount(liquidityToken, pair.liquidity || 0),
    }
  }, [
    pair.chainId,
    pair.id,
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
    pair.liquidity,
  ])
}
