import { Interface } from '@ethersproject/abi'
import { Amount, Token, Type } from '@sushiswap/currency'
import { computeConstantProductPoolAddress, ConstantProductPool, Fee } from '@sushiswap/exchange'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import CONSTANT_PRODUCT_POOL_ABI from '../abis/constant-product-pool.json'
import { useConstantProductPoolFactoryContract } from './useConstantProductPoolFactoryContract'

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const POOL_INTERFACE = new Interface(CONSTANT_PRODUCT_POOL_ABI)

type PoolInput = [Type | undefined, Type | undefined, Fee, boolean]

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export function useGetAllExistedPools(
  chainId: number,
  currencies: [Type | undefined, Type | undefined][]
): [PoolState, ConstantProductPool | null][] {
  const contract = useConstantProductPoolFactoryContract(chainId)
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

  const { data: callStatePoolsCount } = useContractReads({
    contracts: pairsUniqueAddr.map((el) => ({
      chainId,
      addressOrName: contract.address,
      contractInterface: contract.interface,
      functionName: 'poolsCount',
      args: el,
    })),
    enabled: pairsUniqueAddr.length > 0,
  })

  const callStatePoolsCountProcessed = useMemo(() => {
    return (
      callStatePoolsCount
        ?.map((s, i) => [i, s.result ? parseInt(s.result.count.toString()) : 0] as [number, number])
        .filter(([, length]) => length)
        .map(([i, length]) => [pairsUniqueAddr[i][0], pairsUniqueAddr[i][1], 0, length]) || []
    )
  }, [callStatePoolsCount, pairsUniqueAddr])

  const pairsUniqueProcessed = useMemo(() => {
    return (
      callStatePoolsCount
        ?.map((s, i) => [i, s.result ? parseInt(s.result.count.toString()) : 0] as [number, number])
        .filter(([, length]) => length)
        .map(([i]) => [pairsUnique[i][0], pairsUnique[i][1]]) || []
    )
  }, [callStatePoolsCount, pairsUnique])

  const { data: callStatePools } = useContractReads({
    contracts: callStatePoolsCountProcessed.map((el) => ({
      chainId,
      addressOrName: contract.address,
      contractInterface: contract.interface,
      functionName: 'getPools',
      args: el,
    })),
    enabled: callStatePoolsCountProcessed.length > 0,
  })

  const pools = useMemo(() => {
    const pools: PoolData[] = []
    callStatePools?.forEach((s, i) => {
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

  const { data: resultsReserves } = useContractReads({
    contracts: poolsAddresses.map((addressOrName) => ({
      chainId,
      addressOrName,
      contractInterface: POOL_INTERFACE,
      functionName: 'getReserves',
    })),
    enabled: poolsAddresses.length > 0,
  })

  const { data: resultsFee } = useContractReads({
    contracts: poolsAddresses.map((addressOrName) => ({
      chainId,
      addressOrName,
      contractInterface: POOL_INTERFACE,
      functionName: 'swapFee',
    })),
    enabled: poolsAddresses.length > 0,
  })

  return useMemo(
    () =>
      pools.map((p, i) => {
        if (!resultsReserves?.[i].valid || !resultsReserves?.[i].result) return [PoolState.LOADING, null]
        if (!resultsFee?.[i].valid || !resultsFee?.[i].result) return [PoolState.LOADING, null]
        return [
          PoolState.EXISTS,
          new ConstantProductPool(
            Amount.fromRawAmount(p.token0, resultsReserves[i].result._reserve0.toString()),
            Amount.fromRawAmount(p.token1, resultsReserves[i].result._reserve1.toString()),
            parseInt(resultsFee[i].result?.[0].toString()),
            resultsReserves[i].result?._blockTimestampLast !== 0
          ),
        ]
      }),
    [pools, resultsReserves, resultsFee]
  )
}

export function useConstantProductPools(
  chainId: number,
  pools: PoolInput[]
): [PoolState, ConstantProductPool | null][] {
  const constantProductPoolFactory = useConstantProductPoolFactoryContract(chainId)

  const input = useMemo(
    () =>
      pools
        .filter((input): input is [Type, Type, Fee, boolean] => {
          const [currencyA, currencyB, fee, twap] = input
          return Boolean(
            currencyA &&
              currencyB &&
              fee &&
              twap !== undefined &&
              currencyA.chainId === currencyB.chainId &&
              !currencyA.wrapped.equals(currencyB.wrapped) &&
              constantProductPoolFactory?.address
          )
        })
        .map<[Token, Token, Fee, boolean]>(([currencyA, currencyB, fee, twap]) => [
          currencyA.wrapped,
          currencyB.wrapped,
          fee,
          twap,
        ]),
    [constantProductPoolFactory?.address, pools]
  )

  const poolsAddresses = useMemo(
    () =>
      input.reduce<string[]>((acc, [tokenA, tokenB, fee, twap]) => {
        acc.push(
          computeConstantProductPoolAddress({
            factoryAddress: constantProductPoolFactory.address,
            tokenA,
            tokenB,
            fee,
            twap,
          })
        )
        return acc
      }, []),
    [constantProductPoolFactory.address, input]
  )

  const { data } = useContractReads({
    contracts: poolsAddresses.map((addressOrName) => ({
      chainId,
      addressOrName,
      contractInterface: POOL_INTERFACE,
      functionName: 'getReserves',
    })),
    enabled: poolsAddresses.length > 0,
  })

  return useMemo(() => {
    if (poolsAddresses.length === 0) return [[PoolState.INVALID, null]]
    if (!data) return poolsAddresses.map(() => [PoolState.LOADING, null])
    return data.map((result, i) => {
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]

      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PoolState.INVALID, null]
      if (!result) return [PoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = result
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      return [
        PoolState.EXISTS,
        new ConstantProductPool(
          Amount.fromRawAmount(token0, reserve0.toString()),
          Amount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      ]
    })
  }, [data, pools, poolsAddresses])
}

export function useConstantProductPool(
  chainId: number,
  tokenA: Type | undefined,
  tokenB: Type | undefined,
  fee: Fee,
  twap: boolean
): [PoolState, ConstantProductPool | null] {
  const inputs: [PoolInput] = useMemo(() => [[tokenA, tokenB, fee, twap]], [tokenA, tokenB, fee, twap])
  return useConstantProductPools(chainId, inputs)[0]
}
