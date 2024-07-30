'use client'

import {
  getVault,
  GetVault,
  VaultV1,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export function useVault(args: GetVault, shouldFetch = true) {
  return useQuery<VaultV1>({
    queryKey: ['vault', { ...args }],
    queryFn: async () => await getVault(args),
    enabled: Boolean(shouldFetch && args.chainId),
  })
}
