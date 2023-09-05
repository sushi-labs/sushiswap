import { Address } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

import { getSteerAccountPosition, getSteerAccountPositions } from '../functions/getSteerAccountPosition.js'

interface UseSteerAccountPositions {
  account: Address | undefined
  vaultIds: string[] | undefined
  enabled?: boolean
}

export const useSteerAccountPositions = ({ vaultIds, account, enabled = true }: UseSteerAccountPositions) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerAccountPositions'],
    queryFn: () =>
      account && vaultIds ? getSteerAccountPositions({ client, account, vaultIds: vaultIds || [] }) : null,
    refetchInterval: 10000,
    enabled: Boolean(enabled && account && vaultIds),
  })
}

interface UseSteerAccountPosition {
  account: Address | undefined
  vaultId: string | undefined
  enabled?: boolean
}

export const useSteerAccountPosition = ({ vaultId, account, enabled = true }: UseSteerAccountPosition) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerAccountPositions'],
    queryFn: () => (account && vaultId ? getSteerAccountPosition({ client, account, vaultId: vaultId }) : null),
    refetchInterval: 10000,
    enabled: Boolean(enabled && account && vaultId),
  })
}
