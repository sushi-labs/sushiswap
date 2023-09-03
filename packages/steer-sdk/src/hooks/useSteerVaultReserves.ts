import { usePublicClient } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

import { getSteerVaultReserves, getSteerVaultsReserves } from '../functions/index.js'

interface UseSteerVaultsReserves {
  vaultIds: string[] | undefined
  enabled?: boolean
}

export const useSteerVaultsReserves = ({ vaultIds, enabled = true }: UseSteerVaultsReserves) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerVaultsReserves'],
    queryFn: () => getSteerVaultsReserves({ client, vaultIds: vaultIds || [] }),
    refetchInterval: 10000,
    enabled: Boolean(enabled && vaultIds),
  })
}

interface UseSteerVaultReserve {
  vaultId: string | undefined
  enabled?: boolean
}

export const useSteerVaultReserves = ({ vaultId, enabled = true }: UseSteerVaultReserve) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerVaultsReserves'],
    queryFn: () => (vaultId ? getSteerVaultReserves({ client, vaultId: vaultId }) : undefined),
    refetchInterval: 10000,
    enabled: Boolean(enabled && vaultId),
  })
}
