import { fetchTokenPrice } from '@kinesis-bridge/kinesis-sdk/dist/bridgeHelpers'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

type UseKinesisTokenPriceParams = {
  network: string
  tokenAddress: string
  enabled?: boolean
}

export const useKinesisTokenPrice = ({
  network,
  tokenAddress,
  enabled = true,
}: UseKinesisTokenPriceParams) => {
  return useQuery<number>({
    queryKey: ['kinesis-token-price', network, tokenAddress],
    enabled: Boolean(enabled && network && tokenAddress),
    queryFn: async () => {
      return fetchTokenPrice(network, tokenAddress)
    },
    staleTime: ms('30s'),
  })
}
