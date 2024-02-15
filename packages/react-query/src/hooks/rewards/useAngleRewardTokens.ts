import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { Token, tryParseAmount } from 'sushi/currency'

import { angleRewardTokensValidator } from './validator'

interface UseAngleRewardTokensParams {
  chainId: ChainId
}

export const useAngleRewardTokens = ({
  chainId,
}: UseAngleRewardTokensParams) => {
  return useQuery({
    queryKey: ['getAngleRewardTokens', { chainId }],
    queryFn: async () => {
      const url = new URL('https://api.angle.money/v2/merkl')
      url.searchParams.set('AMMs[0]', 'sushiswapv3')
      url.searchParams.set('chainIds[0]', chainId.toString())

      const res = await fetch(url)
      const json = await res.json()
      const parsed = angleRewardTokensValidator.parse(json[chainId])

      return parsed.validRewardTokens
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
