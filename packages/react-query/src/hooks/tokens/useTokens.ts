import { getAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'

interface UseTokensParams {
  chainId: ChainId
}

type Data = Array<{
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
}>

const hydrate = (data: Data, _chainId: ChainId) => {
  return data.reduce<Record<string, Token>>((acc, { id, name, symbol, decimals }) => {
    const [chainId, address] = id.split(':')
    if (_chainId === +chainId) {
      acc[getAddress(address)] = new Token({
        chainId,
        name,
        decimals,
        symbol,
        address,
      })
    }
    return acc
  }, {})
}

export const useTokens = ({ chainId }: UseTokensParams) => {
  return useQuery({
    queryKey: ['tokens', { chainId }],
    queryFn: async () => {
      return fetch(`https://tokens.sushi.com/v0`).then((response) => response.json())
    },
    select: (data) => hydrate(data, chainId),
    staleTime: 900, // 15 mins
    cacheTime: 86400 // 24hs
  })
}
