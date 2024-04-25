import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork, chains } from 'config/chains'
import { useNetwork } from './useNetwork'
import { Pool } from './usePools'

interface GetPoolQueryFn {
  poolAddress: string
  network: SupportedNetwork
}

export const getPoolQueryFn = async ({
  poolAddress,
  network,
}: GetPoolQueryFn) => {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${chains[network].contracts.swap}/resource/${chains[network].contracts.swap}::swap::TokenPairMetadata<${poolAddress}>`,
  )

  if (response.status === 200) {
    const pair = await response.json()
    pair.id = `${pair?.data?.token_x_details?.token_address}, ${pair?.data?.token_y_details?.token_address}`

    pair.data.token_x_details = {
      address: pair.data.token_x_details.token_address,
      decimals: pair.data.token_x_details.decimals,
      name: pair.data.token_x_details.name,
      symbol: pair.data.token_x_details.symbol,
    }

    pair.data.token_y_details = {
      address: pair.data.token_y_details.token_address,
      decimals: pair.data.token_y_details.decimals,
      name: pair.data.token_y_details.name,
      symbol: pair.data.token_y_details.symbol,
    }

    return pair as Pool
  }
}

export function usePool(poolAddress: string) {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['pool', { poolAddress, network }],
    queryFn: async () => getPoolQueryFn({ poolAddress, network }),
    keepPreviousData: true,
    enabled: Boolean(poolAddress),
  })
}
