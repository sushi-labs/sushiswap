import { Interface } from '@ethersproject/abi'
import { Amount, Token, Type } from '@sushiswap/currency'
import { computeStablePoolAddress, Fee, StablePool } from '@sushiswap/exchange'
import { JSBI } from '@sushiswap/math'
import stablePoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/stable/StablePool.sol/StablePool.json'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { getStablePoolFactoryContract, useStablePoolFactoryContract } from './useStablePoolFactoryContract'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const POOL_INTERFACE = new Interface(stablePoolArtifact.abi)

interface Rebase {
  base: JSBI
  elastic: JSBI
}

type PoolInput = [Type | undefined, Type | undefined, Fee, boolean, Rebase, Rebase]

export function useStablePools(chainId: number, pools: PoolInput[]): [StablePoolState, StablePool | null][] {
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
      input.reduce<string[]>((acc, [tokenA, tokenB, fee]) => {
        acc.push(
          computeStablePoolAddress({
            factoryAddress: stablePoolFactory.address,
            tokenA,
            tokenB,
            fee,
          })
        )
        return acc
      }, []),
    [stablePoolFactory.address, input]
  )

  const { data } = useContractReads({
    contracts: poolsAddresses.map((addressOrName) => ({
      chainId,
      addressOrName,
      contractInterface: POOL_INTERFACE,
      functionName: 'getReserves',
    })),
    enabled: poolsAddresses.length > 0 && getStablePoolFactoryContract(chainId).addressOrName,
    watch: true,
    keepPreviousData: true,
  })

  return useMemo(() => {
    if (poolsAddresses.length === 0) return [[StablePoolState.INVALID, null]]
    if (!data) return poolsAddresses.map(() => [StablePoolState.LOADING, null])
    return data.map((result, i) => {
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      const total0 = pools[i]?.[4]
      const total1 = pools[i]?.[5]

      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [StablePoolState.INVALID, null]
      if (!result) return [StablePoolState.NOT_EXISTS, null]
      const [reserve0, reserve1] = result
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      return [
        StablePoolState.EXISTS,
        new StablePool(
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

export function useStablePool(
  chainId: number,
  tokenA: Type | undefined,
  tokenB: Type | undefined,
  fee: Fee,
  twap: boolean,
  // TODO: Change this, just to satify TS for now
  total0: Rebase = { base: JSBI.BigInt(0), elastic: JSBI.BigInt(0) },
  total1: Rebase = { base: JSBI.BigInt(0), elastic: JSBI.BigInt(0) }
): [StablePoolState, StablePool | null] {
  const inputs: [PoolInput] = useMemo(
    () => [[tokenA, tokenB, Number(fee), Boolean(twap), total0, total1]],
    [tokenA, tokenB, fee, twap, total0, total1]
  )
  return useStablePools(chainId, inputs)[0]
}
