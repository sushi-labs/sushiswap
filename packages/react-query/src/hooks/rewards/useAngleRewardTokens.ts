import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'

import { angleRewardTokensValidator } from './validator'

interface UseAngleRewardTokensParams {
  chainId: ChainId
}

export const angleRewardTokensQueryFn = async () => {
  const res = await (
    await fetch(`https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/ERC20_LIST.json`)
  ).json()

  const parsed = angleRewardTokensValidator.parse(res)

  return Object.entries(parsed[0]).reduce<Record<ChainId, Record<string, Token>>>((acc, [chainId, tuple]) => {
    acc[+chainId as ChainId] = Object.entries(tuple).reduce<Record<string, Token>>((acc, [address, token]) => {
      acc[address] = new Token({
        chainId: +chainId as ChainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
      })
      return acc
    }, {})
    return acc
  }, {} as Record<ChainId, Record<string, Token>>)
}

export const useAngleRewardTokens = ({ chainId }: UseAngleRewardTokensParams) => {
  return useQuery({
    queryKey: ['getAngleRewardTokens', { chainId }],
    queryFn: angleRewardTokensQueryFn,
    select: (data) => data[chainId],
    staleTime: 360000, // 60 mins
    cacheTime: 8640000, // 1 day
  })
}
