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

const hydrate = (data: Data) => {
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
}

export const useTokens = ({ chainId }: UseTokensParams) => {
  return useQuery({
    queryKey: ['tokens', { chainId }],
    queryFn: async () =>
        fetch(`https://tokens.sushi.com/v0/${chainId}`).then((response) => response.json()),
    select: hydrate
  })
}
