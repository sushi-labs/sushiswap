import { Interface } from '@ethersproject/abi'
import { Amount, Token, Type as Currency } from '@sushiswap/currency'
import { StablePool } from '@sushiswap/exchange'
import { useBentoBoxTotals } from '@sushiswap/wagmi'
import STABLE_POOL_ABI from 'abis/stable-pool.json'
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'lib/state/multicall'
import { useMemo } from 'react'
import { useBlockNumber } from 'wagmi'

import { useStableProductPoolFactoryContract } from './useStablePoolFactoryContract'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const POOL_INTERFACE = new Interface(STABLE_POOL_ABI)

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export function useStablePools(
  chainId: number,
  currencies: [Currency | undefined, Currency | undefined][]
): [StablePoolState, StablePool | null][] {
  const { data: latestBlockNumber } = useBlockNumber({ chainId })
  const contract = useStableProductPoolFactoryContract(chainId)
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

  const tokensUnique = useMemo(
    () =>
      Array.from(new Set(pairsUnique.reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []))),
    [pairsUnique]
  )

  const pairsUniqueAddr = useMemo(() => pairsUnique.map(([t0, t1]) => [t0.address, t1.address]), [pairsUnique])

  const callStatePoolsCount = useSingleContractMultipleData(
    chainId,
    latestBlockNumber,
    contract,
    'poolsCount',
    pairsUniqueAddr
  )
  const callStatePoolsCountProcessed = useMemo(() => {
    return callStatePoolsCount
      .map((s, i) => [i, s.result ? parseInt(s.result.count.toString()) : 0] as [number, number])
      .filter(([_n, length]) => length)
      .map(([i, length]) => [pairsUniqueAddr[i][0], pairsUniqueAddr[i][1], 0, length])
  }, [callStatePoolsCount, pairsUniqueAddr])

  const pairsUniqueProcessed = useMemo(() => {
    return callStatePoolsCount
      .map((s, i) => [i, s.result ? parseInt(s.result.count.toString()) : 0] as [number, number])
      .filter(([_n, length]) => length)
      .map(([i, length]) => [pairsUnique[i][0], pairsUnique[i][1]])
  }, [callStatePoolsCount, pairsUnique])

  const callStatePools = useSingleContractMultipleData(
    chainId,
    latestBlockNumber,
    contract,
    'getPools',
    callStatePoolsCountProcessed
  )

  const pools = useMemo(() => {
    const pools: PoolData[] = []
    callStatePools.forEach((s, i) => {
      if (s.result !== undefined)
        s.result.pairPools.forEach((address: string) =>
          pools.push({
            address,
            token0: pairsUniqueProcessed[i][0] as Token,
            token1: pairsUniqueProcessed[i][1] as Token,
          })
        )
    })
    return pools
  }, [callStatePools, pairsUniqueProcessed])
  const poolsAddresses = useMemo(() => pools.map((p) => p.address), [pools])

  const resultsReserves = useMultipleContractSingleData(
    chainId,
    latestBlockNumber,
    poolsAddresses,
    POOL_INTERFACE,
    'getReserves'
  )
  const resultsFee = useMultipleContractSingleData(
    chainId,
    latestBlockNumber,
    poolsAddresses,
    POOL_INTERFACE,
    'swapFee'
  )

  const totals = useBentoBoxTotals(chainId, tokensUnique)

  return useMemo(
    () =>
      pools.map((p, i) => {
        if (!resultsReserves[i].valid || !resultsReserves[i].result) return [StablePoolState.LOADING, null]
        if (!resultsFee[i].valid || !resultsFee[i].result) return [StablePoolState.LOADING, null]
        if (!totals || !(p.token0.wrapped.address in totals) || !(p.token1.wrapped.address in totals))
          return [StablePoolState.LOADING, null]
        return [
          StablePoolState.EXISTS,
          new StablePool(
            Amount.fromRawAmount(p.token0, resultsReserves[i].result!._reserve0.toString()),
            Amount.fromRawAmount(p.token1, resultsReserves[i].result!._reserve1.toString()),
            parseInt(resultsFee[i].result![0].toString()),
            totals[p.token0.wrapped.address],
            totals[p.token1.wrapped.address]
          ),
        ]
      }),
    [pools, resultsReserves, resultsFee, totals]
  )
}

// Just for testing purposes
export function poolListCompare(
  list1: [StablePoolState, StablePool | null][],
  list2: [StablePoolState, StablePool | null][]
): boolean | number {
  const l1 = list1
    .filter((p) => p[0] == StablePoolState.EXISTS)
    .sort((p1, p2) => parseInt(p1[1]?.liquidityToken.address || '1') - parseInt(p2[1]?.liquidityToken.address || '1'))
  const l2 = list2
    .filter((p) => p[0] == StablePoolState.EXISTS)
    .sort((p1, p2) => parseInt(p1[1]?.liquidityToken.address || '1') - parseInt(p2[1]?.liquidityToken.address || '1'))
  if (l1.length !== l2.length) {
    console.log(l1.length, '-', l2.length)
    return 2
  }
  for (let i = 0; i < l1.length; ++i) {
    const p1 = l1[i][1]
    const p2 = l2[i][1]
    if (p1 === null || p2 === null) return 3
    // if (p1.twap !== p2.twap) return 4
    if (p1.fee !== p2.fee) return 5
    if (p1.token0.address !== p2.token0.address) return 6
    if (p1.token1.address !== p2.token1.address) return 7
    if (!p1.reserve0.equalTo(p2.reserve0)) return 8
    if (!p1.reserve1.equalTo(p2.reserve1)) return 9
  }
  return true
}
