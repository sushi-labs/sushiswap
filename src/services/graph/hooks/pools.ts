import { formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useOneDayBlock, useTwoDayBlock } from 'app/services/graph'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import {
  getPoolDayBuckets,
  getPoolHourBuckets,
  getPoolKpi,
  getPoolKpis,
  getTridentPools,
  getTridentPoolTransactions,
  PoolBucket,
  TridentPool,
} from '../fetchers/pools'
import { GraphProps } from '../interfaces'

export function useTridentPools({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): TridentPool[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pools', chainId, stringify(variables)] : null,
    () => getTridentPools({ chainId, variables }),
    swrConfig
  )
  return data
}

export function usePoolHourBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): PoolBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pool-hour-buckets', chainId, stringify(variables)] : null,
    () => getPoolHourBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function usePoolDayBuckets({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps): PoolBucket[] {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['trident-pool-day-buckets', chainId, stringify(variables)] : null,
    () => getPoolDayBuckets(chainId, variables),
    swrConfig
  )
  return data
}

export function usePoolKpi({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpi(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function usePoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING

export function useOneDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTwoDayPoolKpis({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-pool-kpis', chainId, stringify(variables)] : null,
    () => getPoolKpis(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useRollingPoolStats({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  const { data: oneDayBlock } = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const { data: twoDayBlock } = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const {
    data: poolKpis,
    isValidating: poolKpisIsValidating,
    error: poolKpisError,
  } = usePoolKpis({
    chainId,
    shouldFetch,
    variables,
    swrConfig,
  })
  const {
    data: oneDayPoolKpis,
    isValidating: oneDayPoolKpisIsValidating,
    error: oneDayPoolKpisError,
  } = useOneDayPoolKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: oneDayBlock },
    swrConfig,
  })
  const {
    data: twoDayPoolKpis,
    isValidating: twoDayPoolKpisIsValidating,
    error: twoDayPoolKpisError,
  } = useTwoDayPoolKpis({
    chainId,
    shouldFetch,
    variables: { ...variables, block: twoDayBlock },
    swrConfig,
  })

  return {
    isValidating: poolKpisIsValidating || oneDayPoolKpisIsValidating || twoDayPoolKpisIsValidating,
    error: poolKpisError || oneDayPoolKpisError || twoDayPoolKpisError,
    data: poolKpis?.map((poolKpi: any) => {
      const oneDayPoolKpi = oneDayPoolKpis?.find((oneDayPoolKpi: any) => oneDayPoolKpi.id === poolKpi.id)
      const twoDayPoolKpi = twoDayPoolKpis?.find((twoDayPoolKpi: any) => twoDayPoolKpi.id === poolKpi.id)

      const volume = formatNumber(
        oneDayPoolKpi?.volumeUSD ? poolKpi.volumeUSD - oneDayPoolKpi.volumeUSD : poolKpi.volumeUSD,
        true,
        false
      )

      const volume24hChange =
        ((poolKpi?.volumeUSD - oneDayPoolKpi?.volumeUSD) / (oneDayPoolKpi?.volumeUSD - twoDayPoolKpi?.volumeUSD)) *
          100 -
        100

      const fees = formatNumber(
        oneDayPoolKpi ? poolKpi?.feesUSD - oneDayPoolKpi?.feesUSD : poolKpi?.feesUSD,
        true,
        false
      )

      const fees24hChange =
        ((poolKpi?.feesUSD - oneDayPoolKpi?.feesUSD) / (oneDayPoolKpi?.feesUSD - twoDayPoolKpi?.feesUSD)) * 100 - 100

      const liquidity = formatPercent(
        ((oneDayPoolKpi ? poolKpi?.volumeUSD - oneDayPoolKpi?.volumeUSD : poolKpi?.volumeUSD) / poolKpi?.liquidityUSD) *
          100
      )

      const transactions = oneDayPoolKpi
        ? poolKpi.transactionCount - oneDayPoolKpi.transactionCount
        : poolKpi.transactionCount

      const apy =
        poolKpi.liquidityUSD > 0
          ? (Math.max(0, oneDayPoolKpi ? poolKpi?.feesUSD - oneDayPoolKpi?.feesUSD : poolKpi?.feesUSD) * 365 * 100) /
            poolKpi?.liquidityUSD
          : 0

      return {
        volume,
        volume24hChange,
        fees,
        fees24hChange,
        liquidity,
        liquidity24hChange:
          ((poolKpi?.volumeUSD - oneDayPoolKpi?.volumeUSD) /
            poolKpi?.liquidityUSD /
            ((oneDayPoolKpi?.volumeUSD - twoDayPoolKpi?.volumeUSD) / oneDayPoolKpi?.liquidityUSD)) *
            100 -
          100,
        transactions,
        transactions24hChange:
          ((poolKpi?.transactionCount - oneDayPoolKpi?.transactionCount) /
            (oneDayPoolKpi?.transactionCount - twoDayPoolKpi?.transactionCount)) *
            100 -
          100,
        apy,
      }
    }),
  }
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTransactions({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-transactions', chainId, stringify(variables)] : null,
    () => getTridentPoolTransactions(chainId, variables),
    swrConfig
  )
}

export const useGetAllTridentPools = ({
  chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) => {
  const tokens = useAllTokens()
  // const allowedAssets = useMemo(() => Object.keys(tokens).map((address) => address.toLowerCase()), [tokens])
  return useSWR<TridentPool[]>(
    shouldFetch ? ['getAllTridentPools', chainId] : null,
    () => getTridentPools({ chainId, tokens }),
    swrConfig
  )
}
