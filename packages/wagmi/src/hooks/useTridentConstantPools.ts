'use client'

import { tridentConstantPoolAbi, tridentConstantPoolFactoryAbi } from '@sushiswap/abi'
import { computeTridentConstantPoolAddress, Fee, TridentConstantPool } from '@sushiswap/amm'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { Address, useContractReads } from 'wagmi'

import { useTridentConstantPoolFactoryContract } from './useTridentConstantPoolFactoryContract'

export enum TridentConstantPoolState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not Exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

type PoolInput = [Currency | undefined, Currency | undefined, Fee, boolean]

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

interface UseGetTridentConstantPoolsReturn {
  isLoading: boolean
  isError: boolean
  data: [TridentConstantPoolState, TridentConstantPool | null][]
}

type Config = Omit<NonNullable<Parameters<typeof useContractReads>['0']>, 'contracts'>

export function useGetTridentConstantPools(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config: Config = { enabled: true }
): UseGetTridentConstantPoolsReturn {
  const contract = useTridentConstantPoolFactoryContract(chainId)
  const pairsUnique = useMemo<[Token, Token][]>(() => {
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

  const pairsUniqueAddr = useMemo<[string, string][]>(
    () => pairsUnique.map(([t0, t1]) => [t0.address, t1.address]),
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
      abi: tridentConstantPoolFactoryAbi,
      functionName: 'poolsCount',
      args: el as [Address, Address],
    })),
    enabled: Boolean(pairsUniqueAddr.length > 0 && config?.enabled),
    watch: !config?.enabled,
  })

  const callStatePoolsCountProcessed = useMemo(() => {
    return (
      callStatePoolsCount
        ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
        .filter(([, length]) => length)
        .map(
          ([i, length]) =>
            [pairsUniqueAddr[i][0] as Address, pairsUniqueAddr[i][1] as Address, 0n, BigInt(length)] as const
        ) ?? []
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
        abi: tridentConstantPoolFactoryAbi,
        functionName: 'getPools' as const,
        args,
      }))
    }, [callStatePoolsCountProcessed, chainId, contract?.address]),

    enabled: Boolean(callStatePoolsCountProcessed && callStatePoolsCountProcessed?.length > 0 && config?.enabled),
    watch: !config?.enabled,
    select: (results) => results.map((r) => r.result),
  })

  const pools = useMemo(() => {
    const pools: PoolData[] = []
    callStatePools?.forEach((s, i) => {
      if (s !== undefined)
        s?.forEach((address) => {
          pools.push({
            address: address as Address,
            token0: pairsUniqueProcessed?.[i][0] as Token,
            token1: pairsUniqueProcessed?.[i][1] as Token,
          })
        })
    })
    return pools
  }, [callStatePools, pairsUniqueProcessed])

  const poolsAddresses = useMemo(() => pools.map((p) => p.address as Address), [pools])

  const contracts = [
    ...poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: tridentConstantPoolAbi,
      functionName: 'getReserves' as const,
    })),
    ...poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: tridentConstantPoolAbi,
      functionName: 'swapFee' as const,
    })),
  ]

  const {
    data: reservesAndFees,
    isLoading: reservesAndFeesLoading,
    isError: reservesAndFeesError,
  } = useContractReads({
    contracts,
    enabled: poolsAddresses.length > 0 && config?.enabled,
    watch: !config?.enabled,
    select: (results) => results.map((r) => r.result),
  })

  return useMemo(() => {
    return {
      isLoading: callStatePoolsCountLoading || callStatePoolsLoading || reservesAndFeesLoading,
      isError: callStatePoolsCountError || callStatePoolsError || reservesAndFeesError,
      data: pools.map((p, i) => {
        const _reserves = reservesAndFees?.[i]
        const _swapFee = reservesAndFees?.[i + poolsAddresses.length]

        if (!_reserves || !_swapFee) {
          return [TridentConstantPoolState.LOADING, null]
        }

        if (typeof _reserves === 'bigint' || typeof _swapFee !== 'bigint') {
          return [TridentConstantPoolState.LOADING, null]
        }

        const reserves = {
          _reserve0: _reserves[0],
          _reserve1: _reserves[1],
          _blockTimestampLast: _reserves[2],
        }

        const swapFee = _swapFee

        return [
          TridentConstantPoolState.EXISTS,
          new TridentConstantPool(
            Amount.fromRawAmount(p.token0, reserves._reserve0.toString()),
            Amount.fromRawAmount(p.token1, reserves._reserve1.toString()),
            parseInt(swapFee.toString()),
            reserves._blockTimestampLast !== 0
          ),
        ]
      }),
    }
  }, [
    callStatePoolsCountLoading,
    callStatePoolsLoading,
    reservesAndFeesLoading,
    callStatePoolsCountError,
    callStatePoolsError,
    reservesAndFeesError,
    pools,
    reservesAndFees,
    poolsAddresses.length,
  ])
}

export function useTridentConstantPools(
  chainId: number,
  pools: PoolInput[]
): [TridentConstantPoolState, TridentConstantPool | null][] {
  const tridentConstantPoolFactory = useTridentConstantPoolFactoryContract(chainId)

  const input = useMemo(
    () =>
      pools
        .filter((input): input is [Currency, Currency, Fee, boolean] => {
          const [currencyA, currencyB, fee, twap] = input
          return Boolean(
            currencyA &&
              currencyB &&
              fee &&
              twap !== undefined &&
              currencyA.chainId === currencyB.chainId &&
              !currencyA.wrapped.equals(currencyB.wrapped) &&
              tridentConstantPoolFactory?.address
          )
        })
        .map<[Token, Token, Fee, boolean]>(([currencyA, currencyB, fee, twap]) => [
          currencyA.wrapped,
          currencyB.wrapped,
          fee,
          twap,
        ]),
    [tridentConstantPoolFactory?.address, pools]
  )

  const poolsAddresses = useMemo(
    () =>
      input.reduce<Address[]>((acc, [tokenA, tokenB, fee, twap]) => {
        if (!tridentConstantPoolFactory) return acc
        const address = computeTridentConstantPoolAddress({
          factoryAddress: tridentConstantPoolFactory.address,
          tokenA,
          tokenB,
          fee,
          twap,
        }) as Address
        acc.push(address)
        console.debug('computeTridentConstantPoolAddress', address, {
          factoryAddress: tridentConstantPoolFactory.address,
          tokenA,
          tokenB,
          fee,
          twap,
        })
        return acc
      }, []),
    [tridentConstantPoolFactory, input]
  )

  const { data } = useContractReads({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: tridentConstantPoolAbi,
      functionName: 'getReserves' as const,
    })),
    enabled: poolsAddresses.length > 0,
    watch: true,
    keepPreviousData: true,
    select: (results) => results.map((r) => r.result),
  })

  return useMemo(() => {
    if (poolsAddresses.length === 0) return [[TridentConstantPoolState.INVALID, null]]
    if (!data || !data.length) return poolsAddresses.map(() => [TridentConstantPoolState.LOADING, null])
    return data.map((result, i) => {
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [TridentConstantPoolState.INVALID, null]
      if (!result) return [TridentConstantPoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = result
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      return [
        TridentConstantPoolState.EXISTS,
        new TridentConstantPool(
          Amount.fromRawAmount(token0, reserve0),
          Amount.fromRawAmount(token1, reserve1),
          fee,
          twap
        ),
      ]
    })
  }, [data, pools, poolsAddresses])
}

export function useTridentConstantPool(
  chainId: number,
  tokenA: Currency | undefined,
  tokenB: Currency | undefined,
  fee: Fee,
  twap: boolean
): [TridentConstantPoolState, TridentConstantPool | null] {
  const inputs: [PoolInput] = useMemo(() => [[tokenA, tokenB, Number(fee), Boolean(twap)]], [tokenA, tokenB, fee, twap])
  return useTridentConstantPools(chainId, inputs)[0]
}
