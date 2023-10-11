import { Native, Token } from 'sushi/currency'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { useMemo } from 'react'

export const useTokenFromToken = (token: GraphToken) => {
  return useMemo(() => {
    const id = token.id.includes(':') ? token.id.split(':')[1] : token.id
    if (id === Native.onChain(token.chainId).wrapped.address) {
      return Native.onChain(token.chainId)
    }

    return new Token({
      address: id,
      chainId: token.chainId,
      name: token.name,
      symbol: token.symbol,
      decimals: Number(token.decimals),
    })
  }, [token.chainId, token.decimals, token.id, token.name, token.symbol])
}
