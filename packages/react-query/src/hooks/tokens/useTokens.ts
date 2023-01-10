import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import { getAddress } from '@ethersproject/address'

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

export const useTokens = ({ chainId }: UseTokensParams) => {
  return useQuery({
    queryKey: ['tokens', { chainId }],
    queryFn: async () => {
      const res = await fetch(`https://tokens.sushi.com/v0/${chainId}`)
      const data: Data = await res.json()
      return data.reduce<Record<string, Token>>((acc, { id, name, symbol, decimals }) => {
        const [chainId, address] = id.split(':')
        acc[getAddress(address)] = new Token({
          chainId,
          name,
          decimals,
          symbol,
          address,
        })
        return acc
      }, {})
    },
  })
}
