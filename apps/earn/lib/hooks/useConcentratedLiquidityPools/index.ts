import { Token, Type } from '@sushiswap/currency'
import { computePoolAddress, FeeAmount, Pool } from '@sushiswap/v3-sdk'
import { BigintIsh, JSBI } from '@sushiswap/math'
import { useContractReads } from 'wagmi'
import { useMemo } from 'react'
import IUniswapV3PoolStateABI from './abi'
import { ChainId } from '@sushiswap/chain'

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = []
  private static addresses: { key: string; address: string }[] = []

  static getPoolAddress(factoryAddress: string, tokenA: Token, tokenB: Token, fee: FeeAmount): string {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2)
    }

    const { address: addressA } = tokenA
    const { address: addressB } = tokenB
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`
    const found = this.addresses.find((address) => address.key === key)
    if (found) return found.address

    const address = {
      key,
      address: computePoolAddress({
        factoryAddress,
        tokenA,
        tokenB,
        fee,
      }),
    }
    this.addresses.unshift(address)
    return address.address
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tick: number
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2)
    }

    const found = this.pools.find(
      (pool) =>
        pool.token0 === tokenA &&
        pool.token1 === tokenB &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick
    )
    if (found) return found

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tick)
    this.pools.unshift(pool)
    return pool
  }
}

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools({
  chainId,
  poolKeys,
}: {
  chainId: ChainId
  poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][]
}): [PoolState, Pool | null][] {
  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    if (!chainId) return new Array(poolKeys.length)

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }, [chainId, poolKeys])

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    // TODO make dynamic
    const v3CoreFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
    if (!v3CoreFactoryAddress) return new Array(poolTokens.length)

    return poolTokens.map((value) => value && PoolCache.getPoolAddress(v3CoreFactoryAddress, ...value))
  }, [poolTokens])

  const {
    data: slot0s,
    isLoading: slot0sLoading,
    isError: slot0sError,
  } = useContractReads({
    contracts: poolAddresses.map((el) => ({
      chainId,
      address: el,
      abi: IUniswapV3PoolStateABI,
      functionName: 'slot0',
    })),
  })

  const {
    data: liquidities,
    isLoading: liquiditiesLoading,
    isError: liquiditiesError,
  } = useContractReads({
    contracts: poolAddresses.map((el) => ({
      chainId,
      address: el,
      abi: IUniswapV3PoolStateABI,
      functionName: 'liquidity',
    })),
  })

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      if (slot0sLoading || liquiditiesLoading) return [PoolState.LOADING, null]
      if (slot0sError || liquiditiesError || !slot0s || !liquidities) return [PoolState.INVALID, null]

      const tokens = poolTokens[index]
      if (!tokens) return [PoolState.INVALID, null]
      const [token0, token1, fee] = tokens

      if (!slot0s[index]) return [PoolState.INVALID, null]
      const slot0 = slot0s[index]

      if (!liquidities[index]) return [PoolState.INVALID, null]
      const liquidity = liquidities[index]

      if (!tokens || !slot0 || !liquidity) return [PoolState.INVALID, null]
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]
      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity, slot0.tick)
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [poolKeys, slot0sLoading, liquiditiesLoading, slot0sError, liquiditiesError, slot0s, liquidities, poolTokens])
}

export function usePool({
  chainId,
  token0,
  token1,
  feeAmount,
}: {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
}): [PoolState, Pool | null] {
  const poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][] = useMemo(
    () => [[token0, token1, feeAmount]],
    [token0, token1, feeAmount]
  )

  return usePools({ poolKeys, chainId })[0]
}
