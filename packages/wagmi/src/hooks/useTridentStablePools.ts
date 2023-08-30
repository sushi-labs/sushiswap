'use client'

import { tridentStablePoolAbi, tridentStablePoolFactoryAbi } from '@sushiswap/abi'
import { computeTridentStablePoolAddress, Fee, TridentStablePool } from '@sushiswap/amm'
import { BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Currency, Token, Type } from '@sushiswap/currency'
import { isTridentChainId, TridentChainId } from '@sushiswap/trident-sdk'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { useBentoBoxTotals } from './useBentoBoxTotals'
import { useStablePoolFactoryContract } from './useStablePoolFactoryContract'

export enum TridentStablePoolState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not Exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

interface Rebase {
  base: bigint
  elastic: bigint
}

type PoolInput = [Type | undefined, Type | undefined, Fee, boolean, Rebase, Rebase]

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

type Config = Omit<NonNullable<Parameters<typeof useContractReads>['0']>, 'contracts'>

export function useGetTridentStablePools(
  chainId: BentoBoxChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config: Config = { enabled: true }
): {
  isLoading: boolean
  isError: boolean
  data: [TridentStablePoolState, TridentStablePool | null][]
} {
  const contract = useStablePoolFactoryContract(chainId)
  const pairsUnique = useMemo(() => {
    const pairsMap = new Map<string, [Token, Token]>()
    currencies.map(([c1, c2]) => {
      if (c1 && c2) {
        const addr1 = c1.wrapped.address as string | undefined
        const addr2 = c2.wrapped.address as string | undefined
        if (addr1 !== undefined && addr2 !== undefined) {
          if (addr1.toLowerCase() < addr2.toLowerCase()) pairsMap.set(addr1 + addr2, [c1, c2] as [Token, Token])
          else pairsMap.set(addr2 + addr1, [c2, c1] as [Token, Token])
        }
      }
    })
    return Array.from(pairsMap.values())
  }, [currencies])
  const pairsUniqueAddr = useMemo(() => pairsUnique.map(([t0, t1]) => [t0.address, t1.address]), [pairsUnique])

  const tokensUnique = useMemo(
    () =>
      Array.from(
        new Set(pairsUnique.reduce<Token[]>((previousValue, currentValue) => previousValue.concat(currentValue), []))
      ),
    [pairsUnique]
  )

  const {
    data: callStatePoolsCount,
    isLoading: callStatePoolsCountLoading,
    isError: callStatePoolsCountError,
  } = useContractReads({
    contracts: pairsUniqueAddr.map((el) => ({
      chainId,
      address: contract?.address as Address,
      abi: tridentStablePoolFactoryAbi,
      functionName: 'poolsCount' as const,
      args: el as [Address, Address],
    })),
    enabled: Boolean(pairsUniqueAddr.length > 0 && config?.enabled),
    watch: !config?.enabled,
    select: (data) => data?.map((r) => r.result),
  })

  const callStatePoolsCountProcessed = useMemo(() => {
    return callStatePoolsCount
      ?.map((s, i) => [i, s ? Number(s) : 0] as [number, number])
      .filter(([, length]) => length)
      .map(
        ([i, length]) =>
          [pairsUniqueAddr[i][0] as Address, pairsUniqueAddr[i][1] as Address, 0n, BigInt(length)] as const
      )
  }, [callStatePoolsCount, pairsUniqueAddr])

  const pairsUniqueProcessed = useMemo(() => {
    return callStatePoolsCount
      ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
      .filter(([, length]) => length)
      .map(([i]) => [pairsUnique[i][0], pairsUnique[i][1]])
  }, [callStatePoolsCount, pairsUnique])

  const {
    data: callStatePools,
    isLoading: callStatePoolsLoading,
    isError: callStatePoolsError,
  } = useContractReads({
    contracts: useMemo(() => {
      if (!callStatePoolsCountProcessed) return []
      return callStatePoolsCountProcessed.map((args) => ({
        chainId,
        address: contract?.address as Address,
        abi: tridentStablePoolFactoryAbi,
        functionName: 'getPools' as const,
        args,
      }))
    }, [callStatePoolsCountProcessed, chainId, contract?.address]),
    enabled: Boolean(callStatePoolsCountProcessed && callStatePoolsCountProcessed?.length > 0 && config?.enabled),
    watch: !config?.enabled,
    select: (data) => data?.map((r) => r.result),
  })

  const pools = useMemo(() => {
    const pools: PoolData[] = []
    callStatePools?.forEach((s, i) => {
      if (s)
        s?.forEach((address) =>
          pools.push({
            address,
            token0: pairsUniqueProcessed?.[i][0] as Token,
            token1: pairsUniqueProcessed?.[i][1] as Token,
          })
        )
    })
    return pools
  }, [callStatePools, pairsUniqueProcessed])

  const poolsAddresses = useMemo(() => pools.map((p) => p.address), [pools])

  const {
    data: reserves,
    isLoading: reservesLoading,
    isError: reservesError,
  } = useContractReads({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: tridentStablePoolAbi,
      functionName: 'getReserves' as const,
    })),
    enabled: poolsAddresses.length > 0 && config?.enabled,
    watch: !config?.enabled,
    select: (data) => data?.map((r) => (r.result ? { reserve0: r.result[0], reserve1: r.result[1] } : undefined)),
  })

  const {
    data: fees,
    isLoading: feesLoading,
    isError: feesError,
  } = useContractReads({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: tridentStablePoolAbi,
      functionName: 'swapFee' as const,
    })),
    enabled: poolsAddresses.length > 0 && config?.enabled,
    watch: !config?.enabled,
    select: (data) => data?.map((r) => r.result),
  })

  const totals = useBentoBoxTotals(chainId, tokensUnique)

  return useMemo(() => {
    return {
      isLoading: callStatePoolsCountLoading || callStatePoolsLoading || reservesLoading || feesLoading,
      isError: callStatePoolsCountError || callStatePoolsError || reservesError || feesError,
      data: pools.map((p, i) => {
        const _reserves = reserves?.[i]

        if (
          !_reserves ||
          !fees?.[i] ||
          !totals ||
          !(p.token0.wrapped.address in totals) ||
          !(p.token1.wrapped.address in totals)
        ) {
          return [TridentStablePoolState.LOADING, null]
        }
        return [
          TridentStablePoolState.EXISTS,
          new TridentStablePool(
            Amount.fromRawAmount(p.token0, _reserves.reserve0),
            Amount.fromRawAmount(p.token1, _reserves.reserve1),
            Number(fees[i]),
            totals[p.token0.wrapped.address],
            totals[p.token1.wrapped.address]
          ),
        ]
      }),
    }
  }, [
    callStatePoolsCountError,
    callStatePoolsCountLoading,
    callStatePoolsError,
    callStatePoolsLoading,
    fees,
    feesError,
    feesLoading,
    pools,
    reserves,
    reservesError,
    reservesLoading,
    totals,
  ])
}

export function useTridentStablePools(
  chainId: number,
  pools: PoolInput[]
): [TridentStablePoolState, TridentStablePool | null][] {
  const stablePoolFactory = useStablePoolFactoryContract(chainId)

  const input = useMemo(
    () =>
      pools
        .filter((input): input is [Type, Type, Fee, boolean, Rebase, Rebase] => {
          const [currencyA, currencyB, fee, twap, total0, total1] = input
          return Boolean(
            currencyA &&
              currencyB &&
              fee &&
              twap !== undefined &&
              currencyA.chainId === currencyB.chainId &&
              !currencyA.wrapped.equals(currencyB.wrapped) &&
              stablePoolFactory?.address &&
              total0 &&
              total1
          )
        })
        .map<[Token, Token, Fee, boolean, Rebase, Rebase]>(([currencyA, currencyB, fee, twap, total0, total1]) => [
          currencyA.wrapped,
          currencyB.wrapped,
          fee,
          twap,
          total0,
          total1,
        ]),
    [stablePoolFactory?.address, pools]
  )

  const poolsAddresses = useMemo(
    () =>
      stablePoolFactory
        ? input.reduce<string[]>((acc, [tokenA, tokenB, fee]) => {
            acc.push(
              computeTridentStablePoolAddress({
                factoryAddress: stablePoolFactory.address,
                tokenA,
                tokenB,
                fee,
              })
            )
            return acc
          }, [])
        : [],
    [stablePoolFactory, input]
  )

  const { data } = useContractReads({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: tridentStablePoolAbi,
      functionName: 'getReserves' as const,
    })),
    enabled: poolsAddresses.length > 0 && isTridentChainId(chainId as TridentChainId),
    watch: true,
    keepPreviousData: true,
    select: (data) => data?.map((r) => r.result),
  })

  return useMemo(() => {
    if (poolsAddresses.length === 0) return [[TridentStablePoolState.INVALID, null]]
    if (!data || !data.length) return poolsAddresses.map(() => [TridentStablePoolState.LOADING, null])
    return data.map((result, i) => {
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      // const twap = pools[i]?.[3]
      const total0 = pools[i]?.[4]
      const total1 = pools[i]?.[5]

      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [TridentStablePoolState.INVALID, null]
      if (!result) return [TridentStablePoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = result
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      return [
        TridentStablePoolState.EXISTS,
        new TridentStablePool(
          Amount.fromRawAmount(token0, reserve0.toString()),
          Amount.fromRawAmount(token1, reserve1.toString()),
          fee,
          total0,
          total1
        ),
      ]
    })
  }, [data, pools, poolsAddresses])
}

export function useTridentStablePool(
  chainId: number,
  tokenA: Type | undefined,
  tokenB: Type | undefined,
  fee: Fee,
  twap: boolean,
  // TODO: Change this, just to satify TS for now
  total0: Rebase = { base: 0n, elastic: 0n },
  total1: Rebase = { base: 0n, elastic: 0n }
): [TridentStablePoolState, TridentStablePool | null] {
  const inputs: [PoolInput] = useMemo(
    () => [[tokenA, tokenB, Number(fee), Boolean(twap), total0, total1]],
    [tokenA, tokenB, fee, twap, total0, total1]
  )
  return useTridentStablePools(chainId, inputs)[0]
}
