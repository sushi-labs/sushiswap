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
  const {
    data: accountBalances,
    isInitialLoading: isAccountBalancesLoading,
    refetch: refetchAccountBalances,
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
    refetch: refetchTotalSupplies,
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
    refetch: refetchVaultReserves,
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
      refetchAccountBalances()
      refetchTotalSupplies()
      refetchVaultReserves()
    }
  }, [
    blockNumber,
    refetchAccountBalances,
    refetchTotalSupplies,
    refetchVaultReserves,
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

  return {
    ...query,
    data: query.data?.[0],
  }
}
