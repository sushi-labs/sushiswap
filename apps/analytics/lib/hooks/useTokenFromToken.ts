import { Native, Token } from '@sushiswap/currency'
import { Token as GraphToken } from '@sushiswap/graph-client/.graphclient'
import { useMemo } from 'react'
export const useTokenFromToken = (token: GraphToken) => {
  return useMemo(() => {
    if (token.id === Native.onChain(token.chainId).wrapped.address) {
      return Native.onChain(token.chainId)
    }

    return new Token({
      address: token.id,
      chainId: token.chainId,
      name: token.name,
      symbol: token.symbol,
      decimals: Number(token.decimals),
    })
  }, [token.chainId, token.decimals, token.id, token.name, token.symbol])
}
