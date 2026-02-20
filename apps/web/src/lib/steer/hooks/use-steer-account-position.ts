import { useReadContracts } from 'wagmi'

import type { Address } from 'viem'

import { useMemo } from 'react'
import { useWatchByInterval } from 'src/lib/wagmi/hooks/watch/useWatchByInterval'
import type { EvmID } from 'sushi/evm'
import {
  getBalanceOfsContracts,
  getBalanceOfsSelect,
  getVaultsReservesContracts,
  getVaultsReservesSelect,
} from '../fetchers'
import {
  getAccountPositions,
  getTotalSuppliesContracts,
  getTotalSuppliesSelect,
} from '../utils'

interface UseSteerAccountPositions {
  account: Address | undefined
  vaultIds: EvmID[] | undefined
  enabled?: boolean
}

export type SteerAccountPosition = ReturnType<typeof getAccountPositions>[0]

export const useSteerAccountPositions = ({
  vaultIds,
  account,
  enabled = true,
}: UseSteerAccountPositions) => {
  const {
    data: accountBalances,
    isLoading: isAccountBalancesLoading,
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
          if (typeof res.result === 'undefined') return []
          return getBalanceOfsSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  const {
    data: totalSupplies,
    isLoading: isTotalSuppliesLoading,
    queryKey: totalSuppliesQueryKey,
  } = useReadContracts({
    contracts: vaultIds ? getTotalSuppliesContracts({ vaultIds }) : undefined,
    query: {
      enabled: Boolean(enabled && vaultIds),
      select: (results) => {
        return results.flatMap((res, i) => {
          if (typeof res.result === 'undefined') return []
          return getTotalSuppliesSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  const {
    data: vaultReserves,
    isLoading: isVaultReservesInitialLoading,
    queryKey: vaultReservesQueryKey,
  } = useReadContracts({
    contracts: vaultIds ? getVaultsReservesContracts({ vaultIds }) : undefined,
    query: {
      enabled: Boolean(enabled && vaultIds),
      select: (results) => {
        return results.flatMap((res, i) => {
          if (typeof res.result === 'undefined') return []
          return getVaultsReservesSelect(vaultIds![i], res.result)
        })
      },
    },
  })

  useWatchByInterval({
    keys: useMemo(
      () => [
        accountBalancesQueryKey,
        totalSuppliesQueryKey,
        vaultReservesQueryKey,
      ],
      [accountBalancesQueryKey, totalSuppliesQueryKey, vaultReservesQueryKey],
    ),
    interval: 10_000,
  })

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
  vaultId: EvmID | undefined
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
