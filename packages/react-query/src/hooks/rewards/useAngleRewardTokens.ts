import { ChainId } from '@sushiswap/chain'
import { Token, tryParseAmount } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'

import { angleRewardTokensValidator } from './validator'

interface UseAngleRewardTokensParams {
  chainId: ChainId
}

export const useAngleRewardTokens = ({ chainId }: UseAngleRewardTokensParams) => {
  return useQuery({
    queryKey: ['getAngleRewardTokens', { chainId }],
    queryFn: async () => {
      const res = await (
        await fetch(
          `https://api.angle.money/v1/merkl?chainId=${chainId}&user=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`
        )
      ).json()
      const parsed = angleRewardTokensValidator.parse(res)

      return parsed.validRewardTokens
        .map((el) => {
          const token = new Token({ chainId, address: el.token, symbol: el.symbol, decimals: el.decimals })
          return {
            minimumAmountPerEpoch: tryParseAmount(el.minimumAmountPerEpoch.toString(), token),
            token,
          }
        })
        .filter((el) => el.token.symbol !== 'aglaMerkl')
    },
  })
}
