'use client'

import { GetVaults, VaultV1, getVaults } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export function useVaults(args: Partial<GetVaults>, shouldFetch = true) {
  return useQuery<VaultV1[] | null>({
    queryKey: ['vaults', args],
    queryFn: async () => await getVaults(args as GetVaults),
    enabled: Boolean(shouldFetch && args.chainId && args.poolAddress),
  })
}
