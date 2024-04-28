import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import {
  AptosPool,
  convertPoolToSushiPool,
} from 'lib/pool/convert-pool-to-sushi-pool'
import { useNetwork } from '../common/use-network'

interface FetchPoolsQueryFn {
  network: SupportedNetwork
}

export async function fetchPoolsQueryFn({ network }: FetchPoolsQueryFn) {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${chains[network].contracts.swap}/resources`,
  )

  if (response.status === 200) {
    const data: AptosPool[] = await response.json()
    const coinPair = data.flatMap((pair) => {
      if (!pair.type.includes(`::swap::TokenPairMetadata`)) {
        return []
      }
      return convertPoolToSushiPool(pair)
    })

    return coinPair
  }

  return []
}

interface UsePools {
  enabled?: boolean
}

export function usePools({ enabled = true }: UsePools = { enabled: true }) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['pools', { network }],
    queryFn: async () => fetchPoolsQueryFn({ network }),
    keepPreviousData: true,
    enabled: Boolean(enabled),
  })
}
