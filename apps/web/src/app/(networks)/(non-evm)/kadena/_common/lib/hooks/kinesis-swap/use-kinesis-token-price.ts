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
      const response = await fetch(
        `http://localhost:3000/kadena/api/price/kinesis?network=${network}&tokenAddress=${tokenAddress}`,
      )
      const data = await response.json()
      console.log('useKinesisTokenPrice', data)
      return data.price
    },
    staleTime: ms('30s'),
  })
}
