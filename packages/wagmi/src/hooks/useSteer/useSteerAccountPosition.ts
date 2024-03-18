import { useBlockNumber, useReadContracts } from 'wagmi'

import {
  getAccountPositions,
  getBalanceOfsContracts,
  getBalanceOfsSelect,
  getTotalSuppliesContracts,
  getTotalSuppliesSelect,
  getVaultsReservesContracts,
  getVaultsReservesSelect,
} from '@sushiswap/steer-sdk'
import { Address } from 'viem'

import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

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
  const queryClient = useQueryClient()

  const {
    data: accountBalances,
    isInitialLoading: isAccountBalancesLoading,
    queryKey: accountBalancesQueryKey,
  } = useReadContracts({
    contracts:
      account && vaultIds
        ? getBalanceOfsContracts({ account, vaultIds })
        : undefined,
    query: {
      enabled: Boolean(enabled && account && vaultIds),
      select: (results) => {
        return results.flatMap((res, i) => {
          if (!res.result) return []
          return getBalanceOfsSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  const {
    data: totalSupplies,
    isInitialLoading: isTotalSuppliesLoading,
    queryKey: totalSuppliesQueryKey,
  } = useReadContracts({
    contracts: vaultIds ? getTotalSuppliesContracts({ vaultIds }) : undefined,
    query: {
      enabled: Boolean(enabled && vaultIds),
      select: (results) => {
        return results.flatMap((res, i) => {
          if (!res.result) return []
          return getTotalSuppliesSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  const {
    data: vaultReserves,
    isInitialLoading: isVaultReservesInitialLoading,
    queryKey: vaultReservesQueryKey,
  } = useReadContracts({
    contracts: vaultIds ? getVaultsReservesContracts({ vaultIds }) : undefined,
    query: {
      enabled: Boolean(enabled && vaultIds),
      select: (results) => {
        return results.flatMap((res, i) => {
          if (!res.result) return []
          return getVaultsReservesSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useMemo(() => {
    if (blockNumber && blockNumber % 3n === 0n) {
      ;[
        accountBalancesQueryKey,
        totalSuppliesQueryKey,
        vaultReservesQueryKey,
      ].forEach((key) =>
        queryClient.invalidateQueries(key, {}, { cancelRefetch: false }),
      )
    }
  }, [
    blockNumber,
    queryClient,
    accountBalancesQueryKey,
    totalSuppliesQueryKey,
    vaultReservesQueryKey,
  ])

  const data = useMemo(() => {
    if (!accountBalances || !totalSupplies || !vaultReserves) return undefined

    const positions = getAccountPositions({
      accountBalances,
      totalSupplies,
      vaultReserves,
    })

    return positions
  }, [accountBalances, totalSupplies, vaultReserves])

  return {
    data,
    isLoading:
      isAccountBalancesLoading ||
      isTotalSuppliesLoading ||
      isVaultReservesInitialLoading,
  }
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
  const query = useSteerAccountPositions({
    vaultIds: vaultId ? [vaultId] : undefined,
    account,
    enabled,
  })

  return useMemo(() => {
    return {
      ...query,
      data: query.data?.[0],
    }
  }, [query])
}
