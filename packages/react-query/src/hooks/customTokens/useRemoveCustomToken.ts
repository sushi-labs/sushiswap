import {Token} from '@sushiswap/currency'
import {useMutation, useQueryClient} from '@tanstack/react-query'

export const useRemoveCustomToken = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['customTokens'],
    mutationFn: async (currency: Token) => {
      queryClient.setQueryData<Record<string, Token>>(['customTokens'], (prevData) => {
        if (!prevData) return {}
        return Object.entries(prevData).reduce<Record<string, Token>>((acc, [k, v]) => {
          if (k !== `${currency.chainId}:${currency.address}`) {
            acc[k] = v
          }

          return acc
        }, {})
      })
    },
  })
}
