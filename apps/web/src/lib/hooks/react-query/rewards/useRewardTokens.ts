import { useQuery } from '@tanstack/react-query'
import { Amount } from 'sushi'
import { type EvmChainId, EvmToken } from 'sushi/evm'
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
          const token = new EvmToken({
            chainId,
            address: el.address,
            symbol: el.symbol || '',
            name: '',
            decimals: el.decimals!,
          })
          return {
            minimumAmountPerHour: new Amount(token, el.minimumAmountPerHour),
            token,
          }
        })
    },
  })
}
