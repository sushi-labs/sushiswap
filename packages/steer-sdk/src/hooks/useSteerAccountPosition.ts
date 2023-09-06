import { getChainIdAddressFromId } from '@sushiswap/format'
import { Address, usePublicClient } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

import { getSteerAccountPosition, getSteerAccountPositions } from '../functions/getSteerAccountPosition.js'
import { clientsFromIds } from '../helpers/clientsFromIds.js'

interface UseSteerAccountPositions {
  account: Address | undefined
  vaultIds: string[] | undefined
  enabled?: boolean
}

export const useSteerAccountPositions = ({ vaultIds, account, enabled = true }: UseSteerAccountPositions) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerAccountPositions', { vaultIds, account, client }],
    queryFn: () => {
      if (!vaultIds || !account) return null

      return getSteerAccountPositions({ clients: clientsFromIds(vaultIds), account, vaultIds: vaultIds })
    },
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
  const client = usePublicClient({ chainId: vaultId ? getChainIdAddressFromId(vaultId).chainId : undefined })

  return useQuery({
    queryKey: ['useSteerAccountPosition', { vaultId, account }],
    queryFn: () => (account && vaultId ? getSteerAccountPosition({ client, account, vaultId: vaultId }) : null),
    refetchInterval: 10000,
    enabled: Boolean(enabled && account && vaultId),
  })
}
