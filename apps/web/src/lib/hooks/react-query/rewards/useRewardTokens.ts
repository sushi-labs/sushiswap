import { useQuery } from '@tanstack/react-query'
import type { EvmChainId } from 'sushi/chain'
import { Token, tryParseAmount } from 'sushi/currency'

import { withoutScientificNotation } from 'sushi/format'
import { merklRewardsTokensValidator } from './validator'

interface UseAngleRewardTokensParams {
  chainId: EvmChainId
}

export const useRewardTokens = ({ chainId }: UseAngleRewardTokensParams) => {
  return useQuery({
    queryKey: ['merklRewardTokens', { chainId }],
    queryFn: async () => {
      const url = new URL(`https://api.merkl.xyz/v4/tokens/reward/${chainId}`)

      const res = await fetch(url)
      const json = await res.json()

      const parsed = merklRewardsTokensValidator.parse(json)

      return parsed
        .filter(
          (el) =>
            el.decimals && el.symbol !== 'aglaMerkl' && el.isTest !== true,
        )
        .map((el) => {
          const token = new Token({
            chainId,
            address: el.address,
            symbol: el.symbol,
            decimals: el.decimals!,
          })
          return {
            minimumAmountPerHour: tryParseAmount(
              withoutScientificNotation(el.minimumAmountPerHour.toString()),
              token,
            ),
            token,
          }
        })
    },
  })
}
