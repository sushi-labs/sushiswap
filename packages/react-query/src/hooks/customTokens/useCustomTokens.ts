import { Token } from '@sushiswap/currency'
import { useQuery, useQueryClient } from '@tanstack/react-query'


type Data = {
  chainId: number
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
}

const hydrate = (data: Record<string, Data>) => {
  return Object.entries(data).reduce<Record<string, Token>>(
      (acc, [k, { address, chainId, decimals, name, symbol }]) => {
        acc[k] = new Token({ address, chainId, decimals, name, symbol })
        return acc
      },
      {}
  )
}

export const useCustomTokens = () => {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['customTokens'],
    queryFn:  () => {
      const data = queryClient.getQueryData<Record<string, Data>>(['customTokens'])
      if (!data) return {}
      return data
    },
    select: hydrate,
    refetchOnWindowFocus: false
  })
}
