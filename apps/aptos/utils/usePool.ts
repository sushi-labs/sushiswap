import { useQuery } from '@tanstack/react-query'
import { Pool } from './usePools'
import { useNetwork } from './useNetwork'
import { SupportedNetwork, chains } from 'config/chains'

interface GetPoolQueryFn {
  poolAddress: string
  network: SupportedNetwork
}

export const getPoolQueryFn = async ({ poolAddress, network }: GetPoolQueryFn) => {
  const response = await fetch(
    `${chains[network].api.fetchUrlPrefix}/v1/accounts/${chains[network].contracts.swap}/resource/${chains[network].contracts.swap}::swap::TokenPairMetadata<${poolAddress}>`
  )

  if (response.status === 200) {
    const pair = await response.json()
    pair.id = `${pair?.data?.token_x_details?.token_address}, ${pair?.data?.token_y_details?.token_address}`
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
