import { useQuery } from '@tanstack/react-query'
import type { EvmChainId } from 'sushi/chain'
import { Token, tryParseAmount } from 'sushi/currency'

import { merklRewardsTokensValidator } from './validator'

interface UseAngleRewardTokensParams {
  chainId: EvmChainId
}

export const useRewardTokens = ({ chainId }: UseAngleRewardTokensParams) => {
  return useQuery({
    queryKey: ['merklRewardTokens', { chainId }],
    queryFn: async () => {
      const url = new URL('https://api.merkl.xyz/v3/overview')
      url.searchParams.set('chainId', `${chainId}`)

      const res = await fetch(url)
      const json = await res.json()
      const parsed = merklRewardsTokensValidator.parse(json[chainId])

      return parsed
        .map((el) => {
          const token = new Token({
            chainId,
            address: el.token,
            symbol: el.symbol,
            decimals: el.decimals,
          })
          return {
            minimumAmountPerEpoch: tryParseAmount(
              el.minimumAmountPerEpoch.toString(),
              token,
            ),
            token,
          }
        })
        .filter((el) => el.token.symbol !== 'aglaMerkl')
    },
  })
}
