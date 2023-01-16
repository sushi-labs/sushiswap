import chains from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddCustomToken = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['customTokens'],
    mutationFn: async (currency: Token) => {
      queryClient.setQueryData<Record<string, Token>>(['customTokens'], (prevData) => {
        if (prevData !== undefined) {
          if (prevData[currency.address]) {
            throw new Error('You already added this token')
          } else {
            return {
              ...prevData,
              [`${chains[currency.chainId].shortName}:${currency.address}`]: currency,
            }
          }
        } else {
          return {
            [`${chains[currency.chainId].shortName}:${currency.address}`]: currency,
          }
        }
      })
    },
  })
}
