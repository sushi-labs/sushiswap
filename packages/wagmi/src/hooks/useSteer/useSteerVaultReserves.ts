import {
  getVaultsReservesContracts,
  getVaultsReservesSelect,
} from '@sushiswap/steer-sdk'
import { useBlockNumber, useReadContracts, useSimulateContract } from 'wagmi'

import { useEffect, useMemo } from 'react'

interface UseSteerVaultsReserves {
  vaultIds: string[] | undefined
  enabled?: boolean
}

export const useSteerVaultsReserves = ({
  vaultIds,
  enabled = true,
}: UseSteerVaultsReserves) => {
  const contracts = useMemo(() => {
    if (!vaultIds) return undefined
    return getVaultsReservesContracts({ vaultIds })
  }, [vaultIds])

  const query = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(enabled && vaultIds),
      select: (results) =>
        results.flatMap(({ result }, i) => {
          if (!result) return []

          // ! TODO: Fix when viem is updated
          return getVaultsReservesSelect(vaultIds![i], result as any)
        }),
    },
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    if (blockNumber) {
      query.refetch()
    }
  }, [blockNumber, query.refetch])

  return query
}

interface UseSteerVaultReserve {
  vaultId: string | undefined
  enabled?: boolean
}

export const useSteerVaultReserves = ({
  vaultId,
  enabled = true,
}: UseSteerVaultReserve) => {
  const contract = useMemo(() => {
    if (!vaultId) return undefined
    return getVaultsReservesContracts({ vaultIds: [vaultId!] })[0]
  }, [vaultId])

  const query = useSimulateContract({
    ...contract,
    query: {
      enabled: Boolean(enabled && vaultId),
      select: ({ result }) => getVaultsReservesSelect(vaultId!, result),
    },
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    if (blockNumber) {
      query.refetch()
    }
  }, [blockNumber, query.refetch])

  return query
}
