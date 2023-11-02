import {
  getSteerAccountPosition,
  getSteerAccountPositions,
} from '@sushiswap/steer-sdk'
import { useQuery } from '@tanstack/react-query'
import { getChainIdAddressFromId } from 'sushi'
import { Address, usePublicClient } from 'wagmi'

import { clientsFromIds } from './getClientsFromIds'
import { PublicClient } from 'viem'

interface UseSteerAccountPositions {
  account: Address | undefined
  vaultIds: string[] | undefined
  enabled?: boolean
}

export const useSteerAccountPositions = ({
  vaultIds,
  account,
  enabled = true,
}: UseSteerAccountPositions) => {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['useSteerAccountPositions', { vaultIds, account, client }],
    queryFn: async () => {
      if (!vaultIds || !account) return null

      const data = await getSteerAccountPositions({
        clients: clientsFromIds(vaultIds) as PublicClient[],
        account,
        vaultIds: vaultIds,
      })

      return data.map((el, i) => {
        if (el) {
          return {
            ...el,
            vaultId: vaultIds[i],
          }
        }

        return null
      })
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

export const useSteerAccountPosition = ({
  vaultId,
  account,
  enabled = true,
}: UseSteerAccountPosition) => {
  const client = usePublicClient({
    chainId: vaultId ? getChainIdAddressFromId(vaultId).chainId : undefined,
  })

  return useQuery({
    queryKey: ['useSteerAccountPosition', { vaultId, account }],
    queryFn: () =>
      account && vaultId
        ? getSteerAccountPosition({ client, account, vaultId: vaultId })
        : null,
    refetchInterval: 10000,
    enabled: Boolean(enabled && account && vaultId),
  })
}
