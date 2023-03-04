import { Token } from '@sushiswap/currency'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useCustomTokens = () => {
  const queryClient = useQueryClient()
  return useQuery<Record<string, Token>, unknown, Record<string, Token>>({
    queryKey: ['customTokens'],
    queryFn: () => {
      const data = queryClient.getQueryData<Record<string, Token>>(['customTokens'])
      if (!data) return {}

      return Object.entries(data).reduce<Record<string, Token>>(
        (acc, [k, { address, chainId, decimals, name, symbol }]) => {
          acc[k] = new Token({ address, chainId, decimals, name, symbol })
          return acc
        },
        {}
      )
    },
  })
}
