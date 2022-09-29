import { Interface } from '@ethersproject/abi'
import { Amount, Token, Type } from '@sushiswap/currency'
import { computeStablePoolAddress, StablePool, Fee } from '@sushiswap/exchange'
import stablePoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/stable/StablePool.sol/StablePool.json'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'

import { getStablePoolFactoryContract, useStablePoolFactoryContract } from './useStablePoolFactoryContract'

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const POOL_INTERFACE = new Interface(stablePoolArtifact.abi)

type PoolInput = [Type | undefined, Type | undefined, Fee, boolean]

export function useStablePools(
  chainId: number,
  pools: PoolInput[]
): [PoolState, StablePool | null][] {
  const stablePoolFactory = useStablePoolFactoryContract(chainId)

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
              stablePoolFactory?.address
          )
        })
        .map<[Token, Token, Fee, boolean]>(([currencyA, currencyB, fee, twap]) => [
          currencyA.wrapped,
          currencyB.wrapped,
          fee,
          twap,
        ]),
    [stablePoolFactory?.address, pools]
  )

  const poolsAddresses = useMemo(
    () =>
      input.reduce<string[]>((acc, [tokenA, tokenB, fee, twap]) => {
        acc.push(
          computeStablePoolAddress({
            factoryAddress: stablePoolFactory.address,
            tokenA,
            tokenB,
            fee,
            twap,
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
        new StablePool(
          Amount.fromRawAmount(token0, reserve0.toString()),
          Amount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
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
  twap: boolean
): [PoolState, StablePool | null] {
  const inputs: [PoolInput] = useMemo(() => [[tokenA, tokenB, Number(fee), Boolean(twap)]], [tokenA, tokenB, fee, twap])
  return useStablePools(chainId, inputs)[0]
}
